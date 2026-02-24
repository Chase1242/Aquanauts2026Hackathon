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

    public async Task<IList<VariableDef>> GetVariablesByProjectIdAsync(int projectId, CancellationToken cancellationToken)
    {
        return await this._context.VariableDefinitions
            .Where(v => v.SimulationProjectId == projectId)
            .Select(v => new VariableDef(v.VariableDefinitionId, v.Code))
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VariableDefinition>> QueryAsync(VariableDefinition filter)
    {
        var query = this._context.VariableDefinitions.AsQueryable();

        if (filter.VariableDefinitionId != 0)
            query = query.Where(v => v.VariableDefinitionId == filter.VariableDefinitionId);
        if (!string.IsNullOrEmpty(filter.Code))
            query = query.Where(v => v.Code == filter.Code);
        if (!string.IsNullOrEmpty(filter.DisplayName))
            query = query.Where(v => v.DisplayName == filter.DisplayName);
        if (!string.IsNullOrEmpty(filter.Description))
            query = query.Where(v => v.Description == filter.Description);
        if (!string.IsNullOrEmpty(filter.Unit))
            query = query.Where(v => v.Unit == filter.Unit);
        if (!string.IsNullOrEmpty(filter.Category))
            query = query.Where(v => v.Category == filter.Category);
        if (filter.SimulationProjectId.HasValue)
            query = query.Where(v => v.SimulationProjectId == filter.SimulationProjectId);
        if (filter.CreatedAt != default)
            query = query.Where(v => v.CreatedAt == filter.CreatedAt);
        if (filter.UpdatedAt.HasValue)
            query = query.Where(v => v.UpdatedAt == filter.UpdatedAt);
        if (filter.MinValue.HasValue)
            query = query.Where(v => v.MinValue == filter.MinValue);
        if (filter.MaxValue.HasValue)
            query = query.Where(v => v.MaxValue == filter.MaxValue);
        if (filter.DeltaMax.HasValue)
            query = query.Where(v => v.DeltaMax == filter.DeltaMax);

        // Note: Not filtering on navigation properties/collections

        return await query.ToListAsync();
    }
}
