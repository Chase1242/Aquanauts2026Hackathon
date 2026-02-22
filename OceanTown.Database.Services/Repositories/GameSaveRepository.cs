using Microsoft.EntityFrameworkCore;
using OceanTown.Database.Entities;
using OceanTown.Database.Services.Interfaces;

namespace OceanTown.Database.Services.Repositories;

public class GameSaveRepository : IGameSaveRepository
{
    private readonly AquanautsOceanTownContext _context;

    public GameSaveRepository(AquanautsOceanTownContext context)
    {
        this._context = context;
    }

    public async Task<GameSave?> GetByIdAsync(int id)
    {
        return await this._context.GameSaves.FindAsync(id);
    }

    public async Task<IEnumerable<GameSave>> GetAllAsync()
    {
        return await this._context.GameSaves.ToListAsync();
    }

    public async Task AddAsync(GameSave entity)
    {
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
}
