using OceanTown.Database.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OceanTown.Database.Repositories;

public interface IFunctionDefinitionRepository
{
    Task<FunctionDefinition?> GetByIdAsync(int id);
    Task<IEnumerable<FunctionDefinition>> GetAllAsync();
    Task AddAsync(FunctionDefinition entity);
    Task UpdateAsync(FunctionDefinition entity);
    Task DeleteAsync(int id);
}
