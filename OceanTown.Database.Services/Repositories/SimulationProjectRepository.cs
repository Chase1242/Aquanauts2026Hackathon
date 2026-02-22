using Microsoft.EntityFrameworkCore;
using OceanTown.Database.Entities;
using OceanTown.Database.Services.Interfaces;

namespace OceanTown.Database.Services.Repositories;

public class SimulationProjectRepository : ISimulationProjectRepository
{
    private readonly AquanautsOceanTownContext _context;

    public SimulationProjectRepository(AquanautsOceanTownContext context)
    {
        this._context = context;
    }

    public async Task<SimulationProject?> GetByIdAsync(int id)
    {
        return await this._context.SimulationProjects.FindAsync(id);
    }

    public async Task<IEnumerable<SimulationProject>> GetAllAsync()
    {
        return await this._context.SimulationProjects.ToListAsync();
    }

    public async Task AddAsync(SimulationProject entity)
    {
        this._context.SimulationProjects.Add(entity);
        await this._context.SaveChangesAsync();
    }

    public async Task UpdateAsync(SimulationProject entity)
    {
        this._context.SimulationProjects.Update(entity);
        await this._context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await this._context.SimulationProjects.FindAsync(id);
        if (entity != null)
        {
            this._context.SimulationProjects.Remove(entity);
            await this._context.SaveChangesAsync();
        }
    }
}
