using Microsoft.EntityFrameworkCore;
using OceanTown.Database.Entities;
using OceanTown.Database.Services.Interfaces;

namespace OceanTown.Database.Services.Repositories;

public class FunctionDefinitionRepository : IFunctionDefinitionRepository
{
    private readonly AquanautsOceanTownContext _context;

    public FunctionDefinitionRepository(AquanautsOceanTownContext context)
    {
        this._context = context;
    }

    public async Task<FunctionDefinition?> GetByIdAsync(int id)
    {
        return await this._context.FunctionDefinitions.FindAsync(id);
    }

    public async Task<IEnumerable<FunctionDefinition>> GetAllAsync()
    {
        return await this._context.FunctionDefinitions.ToListAsync();
    }

    public async Task AddAsync(FunctionDefinition entity)
    {
        this._context.FunctionDefinitions.Add(entity);
        await this._context.SaveChangesAsync();
    }

    public async Task UpdateAsync(FunctionDefinition entity)
    {
        this._context.FunctionDefinitions.Update(entity);
        await this._context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await this._context.FunctionDefinitions.FindAsync(id);
        if (entity != null)
        {
            this._context.FunctionDefinitions.Remove(entity);
            await this._context.SaveChangesAsync();
        }
    }
}
