using OceanTown.Database.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OceanTown.Database.Repositories;

public class VariableDefinitionRepository : IVariableDefinitionRepository
{
    private readonly AquanautsOceanTownContext _context;

    public VariableDefinitionRepository(AquanautsOceanTownContext context)
    {
        _context = context;
    }

    public async Task<VariableDefinition?> GetByIdAsync(int id)
    {
        return await _context.VariableDefinitions.FindAsync(id);
    }

    public async Task<IEnumerable<VariableDefinition>> GetAllAsync()
    {
        return await _context.VariableDefinitions.ToListAsync();
    }

    public async Task AddAsync(VariableDefinition entity)
    {
        _context.VariableDefinitions.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(VariableDefinition entity)
    {
        _context.VariableDefinitions.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _context.VariableDefinitions.FindAsync(id);
        if (entity != null)
        {
            _context.VariableDefinitions.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
