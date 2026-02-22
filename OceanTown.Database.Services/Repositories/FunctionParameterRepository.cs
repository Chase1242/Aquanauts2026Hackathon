using Microsoft.EntityFrameworkCore;
using OceanTown.Database.Entities;
using OceanTown.Database.Services.Interfaces;

namespace OceanTown.Database.Services.Repositories;

public class FunctionParameterRepository : IFunctionParameterRepository
{
    private readonly AquanautsOceanTownContext _context;

    public FunctionParameterRepository(AquanautsOceanTownContext context)
    {
        this._context = context;
    }

    public async Task<FunctionParameter?> GetByIdAsync(int id)
    {
        return await this._context.FunctionParameters.FindAsync(id);
    }

    public async Task<IEnumerable<FunctionParameter>> GetAllAsync()
    {
        return await this._context.FunctionParameters.ToListAsync();
    }

    public async Task AddAsync(FunctionParameter entity)
    {
        this._context.FunctionParameters.Add(entity);
        await this._context.SaveChangesAsync();
    }

    public async Task UpdateAsync(FunctionParameter entity)
    {
        this._context.FunctionParameters.Update(entity);
        await this._context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await this._context.FunctionParameters.FindAsync(id);
        if (entity != null)
        {
            this._context.FunctionParameters.Remove(entity);
            await this._context.SaveChangesAsync();
        }
    }
}
