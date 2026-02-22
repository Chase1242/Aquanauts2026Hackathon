using OceanTown.Database.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OceanTown.Database.Repositories;

public class SimulationProjectRepository : ISimulationProjectRepository
{
    private readonly AquanautsOceanTownContext _context;

    public SimulationProjectRepository(AquanautsOceanTownContext context)
    {
        _context = context;
    }

    public async Task<SimulationProject?> GetByIdAsync(int id)
    {
        return await _context.SimulationProjects.FindAsync(id);
    }

    public async Task<IEnumerable<SimulationProject>> GetAllAsync()
    {
        return await _context.SimulationProjects.ToListAsync();
    }

    public async Task AddAsync(SimulationProject entity)
    {
        _context.SimulationProjects.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(SimulationProject entity)
    {
        _context.SimulationProjects.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _context.SimulationProjects.FindAsync(id);
        if (entity != null)
        {
            _context.SimulationProjects.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
