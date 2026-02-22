using OceanTown.Database.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OceanTown.Database.Repositories;

public class FunctionDefinitionRepository : IFunctionDefinitionRepository
{
    private readonly AquanautsOceanTownContext _context;

    public FunctionDefinitionRepository(AquanautsOceanTownContext context)
    {
        _context = context;
    }

    public async Task<FunctionDefinition?> GetByIdAsync(int id)
    {
        return await _context.FunctionDefinitions.FindAsync(id);
    }

    public async Task<IEnumerable<FunctionDefinition>> GetAllAsync()
    {
        return await _context.FunctionDefinitions.ToListAsync();
    }

    public async Task AddAsync(FunctionDefinition entity)
    {
        _context.FunctionDefinitions.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(FunctionDefinition entity)
    {
        _context.FunctionDefinitions.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _context.FunctionDefinitions.FindAsync(id);
        if (entity != null)
        {
            _context.FunctionDefinitions.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
