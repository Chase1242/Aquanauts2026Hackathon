using OceanTown.Database.Entities;

namespace OceanTown.Database.Services.Interfaces;

public interface IFunctionDefinitionRepository
{
    Task<FunctionDefinition?> GetByIdAsync(int id);
    Task<IEnumerable<FunctionDefinition>> GetAllAsync();
    Task AddAsync(FunctionDefinition entity);
    Task UpdateAsync(FunctionDefinition entity);
    Task DeleteAsync(int id);

    Task<IList<FunctionDef>> GetFunctionsByProjectIdAsync(int projectId, CancellationToken cancellationToken);
}

public sealed record FunctionDef(int FunctionDefinitionId, string Name, string ExpressionText,
    int ReturnVariableId, string? Category);