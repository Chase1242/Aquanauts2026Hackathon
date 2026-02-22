using OceanTown.Database.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OceanTown.Database.Repositories;

public class GameSaveRepository : IGameSaveRepository
{
    private readonly AquanautsOceanTownContext _context;

    public GameSaveRepository(AquanautsOceanTownContext context)
    {
        _context = context;
    }

    public async Task<GameSave?> GetByIdAsync(int id)
    {
        return await _context.GameSaves.FindAsync(id);
    }

    public async Task<IEnumerable<GameSave>> GetAllAsync()
    {
        return await _context.GameSaves.ToListAsync();
    }

    public async Task AddAsync(GameSave entity)
    {
        _context.GameSaves.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(GameSave entity)
    {
        _context.GameSaves.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _context.GameSaves.FindAsync(id);
        if (entity != null)
        {
            _context.GameSaves.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
