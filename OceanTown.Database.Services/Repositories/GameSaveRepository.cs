using Microsoft.EntityFrameworkCore;
using OceanTown.Database.Entities;
using OceanTown.Database.Services.Interfaces;
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

    public async Task<GameSave?> GetByUsernameAsync(string username, int projId)
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
            SimulationProject sim = await this._context.SimulationProjects.FirstOrDefaultAsync(s => s.SimulationProjectId == projId)
                ?? throw new Exception("No simulation projects found in the database.");

            save = CreateDefaultGameSaveState(
                userAccountId: user.UserAccountId, // will be updated when user is created
                sim: sim, // can be updated later when user starts a simulation
                saveName: "Default Save"
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
        SimulationProject sim,
        string saveName,
        string? engineVersion = null)
    {
        JsonSerializerOptions jsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false,
            NumberHandling = JsonNumberHandling.Strict
        };

        // Build default runtime state
        var state = sim.StartState;

        //var json = JsonSerializer.Serialize(state, jsonOptions);

        // Create DB entity
        return new GameSave
        {
            UserAccountId = userAccountId,
            SimulationProjectId = sim.SimulationProjectId,
            SaveName = saveName,
            GameStateJson = sim.StartState ?? string.Empty,
            IsDeleted = false,
            DeletedAt = null,
            CreatedAt = DateTime.UtcNow,
            EngineVersion = engineVersion
        };
    }
}