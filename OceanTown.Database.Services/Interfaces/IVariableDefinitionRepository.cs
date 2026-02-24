using OceanTown.Database.Entities;

namespace OceanTown.Database.Services.Interfaces;

public interface IVariableDefinitionRepository
{
    Task<VariableDefinition?> GetByIdAsync(int id);
    Task<IEnumerable<VariableDefinition>> GetAllAsync();
    Task AddAsync(VariableDefinition entity);
    Task UpdateAsync(VariableDefinition entity);
    Task DeleteAsync(int id);

    Task<IList<VariableDef>> GetVariablesByProjectIdAsync(int projectId, CancellationToken cancellationToken);

    /// <summary>
    /// Query VariableDefinitions by all attributes. Any non-null property of the filter will be used.
    /// </summary>
    Task<IEnumerable<VariableDefinition>> QueryAsync(VariableDefinition filter);
}

public sealed record VariableDef(int VariableDefinitionId, string Code);