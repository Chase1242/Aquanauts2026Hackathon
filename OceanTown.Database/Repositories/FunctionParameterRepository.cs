using OceanTown.Database.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OceanTown.Database.Repositories;

public class FunctionParameterRepository : IFunctionParameterRepository
{
    private readonly AquanautsOceanTownContext _context;

    public FunctionParameterRepository(AquanautsOceanTownContext context)
    {
        _context = context;
    }

    public async Task<FunctionParameter?> GetByIdAsync(int id)
    {
        return await _context.FunctionParameters.FindAsync(id);
    }

    public async Task<IEnumerable<FunctionParameter>> GetAllAsync()
    {
        return await _context.FunctionParameters.ToListAsync();
    }

    public async Task AddAsync(FunctionParameter entity)
    {
        _context.FunctionParameters.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(FunctionParameter entity)
    {
        _context.FunctionParameters.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _context.FunctionParameters.FindAsync(id);
        if (entity != null)
        {
            _context.FunctionParameters.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
