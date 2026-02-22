using Microsoft.EntityFrameworkCore;
using OceanTown.Database.Entities;
using OceanTown.Database.Services.Interfaces;

namespace OceanTown.Database.Services.Repositories;

public class VariableDefinitionRepository : IVariableDefinitionRepository
{
    private readonly AquanautsOceanTownContext _context;

    public VariableDefinitionRepository(AquanautsOceanTownContext context)
    {
        this._context = context;
    }

    public async Task<VariableDefinition?> GetByIdAsync(int id)
    {
        return await this._context.VariableDefinitions.FindAsync(id);
    }

    public async Task<IEnumerable<VariableDefinition>> GetAllAsync()
    {
        return await this._context.VariableDefinitions.ToListAsync();
    }

    public async Task AddAsync(VariableDefinition entity)
    {
        this._context.VariableDefinitions.Add(entity);
        await this._context.SaveChangesAsync();
    }

    public async Task UpdateAsync(VariableDefinition entity)
    {
        this._context.VariableDefinitions.Update(entity);
        await this._context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await this._context.VariableDefinitions.FindAsync(id);
        if (entity != null)
        {
            this._context.VariableDefinitions.Remove(entity);
            await this._context.SaveChangesAsync();
        }
    }
}
