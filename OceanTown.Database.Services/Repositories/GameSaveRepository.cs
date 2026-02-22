using Microsoft.EntityFrameworkCore;
using OceanTown.Database.Entities;
using OceanTown.Database.Services.Interfaces;
using OceanTown.Shared;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace OceanTown.Database.Services.Repositories;

public class GameSaveRepository : IGameSaveRepository
{
    private readonly AquanautsOceanTownContext _context;
    private readonly IUserAccountRepository _userAccountRepository;

    public GameSaveRepository(AquanautsOceanTownContext context, IUserAccountRepository userAccountRepo)
    {
        this._context = context;
        this._userAccountRepository = userAccountRepo;
    }

    public async Task<GameSave?> GetByIdAsync(int id)
    {
        return await this._context.GameSaves.FindAsync(id);
    }

    public async Task<GameSave?> GetByUsernameAsync(string username)
    {
        var user = await this._context.UserAccounts
            .FirstOrDefaultAsync(gs => gs.Username == username);

        if (user is null)
        {
            var newUser = await this._userAccountRepository.AddAsync(new UserAccount
            {
                Username = username,
                CreatedAt = DateTime.UtcNow,
            });

            username = newUser.Username;
            user = newUser;
        }

        var save = await this._context.GameSaves
            .FirstOrDefaultAsync(gs => gs.UserAccountId == user.UserAccountId && !gs.IsDeleted);

        if (save is null)
        {
            save = CreateDefaultGameSaveState(
                userAccountId: user.UserAccountId, // will be updated when user is created
                simulationProjectId: 2, // can be updated later when user starts a simulation
                saveName: "Default Save",
                cellCount: 100,
                initialForestAreaPerCell: 1.0,
                defaultDeforestationRate: 0.01,
                initialPopulation: 1000,
                initialOceanQ: 1.0,
                initialAirQ: 1.0,
                populationGrowthRate: 0.02
            );

            await AddAsync(save);
        }

        return save;
    }

    public async Task<IEnumerable<GameSave>> GetAllAsync()
    {
        return await this._context.GameSaves.ToListAsync();
    }

    public async Task AddAsync(GameSave entity)
    {
        var existing = this._context.GameSaves.FirstOrDefault(e => e.UserAccountId == entity.UserAccountId
            && !e.IsDeleted);
        if (existing != null)
        {
            existing.IsDeleted = true;
            await UpdateAsync(existing);
        }

        this._context.GameSaves.Add(entity);

        await this._context.SaveChangesAsync();
    }

    public async Task UpdateAsync(GameSave entity)
    {
        this._context.GameSaves.Update(entity);
        await this._context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await this._context.GameSaves.FindAsync(id);
        if (entity != null)
        {
            this._context.GameSaves.Remove(entity);
            await this._context.SaveChangesAsync();
        }
    }

    public static GameSave CreateDefaultGameSaveState(
        int userAccountId,
        int simulationProjectId,
        string saveName,
        int cellCount,
        double initialForestAreaPerCell,
        double defaultDeforestationRate,
        double initialPopulation,
        double initialOceanQ = 1.0,
        double initialAirQ = 1.0,
        double initialH = 1.0,
        double? populationGrowthRate = null,
        string? engineVersion = null)
    {
        JsonSerializerOptions jsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false,
            NumberHandling = JsonNumberHandling.Strict
        };
        // Build default runtime state
        var state = new GameState
        {
            Year = 0,
            Cells = new List<Dictionary<string, double>>(capacity: cellCount),
            GlobalVariables = new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase)
            {
                ["P"] = initialPopulation,
                ["OceanQ"] = initialOceanQ,
                ["AirQ"] = initialAirQ,
                ["H"] = initialH,
            }
        };

        // Optional globals used by some functions
        if (populationGrowthRate.HasValue)
            state.GlobalVariables["rP"] = populationGrowthRate.Value;

        // Create N land cells
        for (int i = 0; i < cellCount; i++)
        {
            state.Cells.Add(new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase)
            {
                ["A"] = initialForestAreaPerCell,       // forest area
                ["d"] = defaultDeforestationRate,       // deforestation rate (frontend can override)
                ["OilCell"] = 0.0                       // derived later by functions
            });
        }

        var json = JsonSerializer.Serialize(state, jsonOptions);

        // Create DB entity
        return new GameSave
        {
            UserAccountId = userAccountId,
            SimulationProjectId = simulationProjectId,
            SaveName = saveName,
            GameStateJson = json,
            IsDeleted = false,
            DeletedAt = null,
            CreatedAt = DateTime.UtcNow,
            EngineVersion = engineVersion
        };
    }
}
