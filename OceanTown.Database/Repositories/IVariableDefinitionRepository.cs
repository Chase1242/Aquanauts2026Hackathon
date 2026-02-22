using OceanTown.Database.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OceanTown.Database.Repositories;

public interface IVariableDefinitionRepository
{
    Task<VariableDefinition?> GetByIdAsync(int id);
    Task<IEnumerable<VariableDefinition>> GetAllAsync();
    Task AddAsync(VariableDefinition entity);
    Task UpdateAsync(VariableDefinition entity);
    Task DeleteAsync(int id);
}
