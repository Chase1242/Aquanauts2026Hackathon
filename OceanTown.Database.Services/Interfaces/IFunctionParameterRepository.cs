using OceanTown.Database.Entities;

namespace OceanTown.Database.Services.Interfaces;

public interface IFunctionParameterRepository
{
    Task<FunctionParameter?> GetByIdAsync(int id);
    Task<IEnumerable<FunctionParameter>> GetAllAsync();
    Task AddAsync(FunctionParameter entity);
    Task UpdateAsync(FunctionParameter entity);
    Task DeleteAsync(int id);
    Task<IList<ParameterDef>> GetFunctionParametersByProjectId(int projId,
        IList<int> funcIds,
        CancellationToken ct);
}

public sealed record ParameterDef(int FunctionDefinitionId, string Name, int? VariableDefinitionId, double? ConstantValue);
