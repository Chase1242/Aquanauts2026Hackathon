using OceanTown.Database.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OceanTown.Database.Repositories;

public interface IFunctionParameterRepository
{
    Task<FunctionParameter?> GetByIdAsync(int id);
    Task<IEnumerable<FunctionParameter>> GetAllAsync();
    Task AddAsync(FunctionParameter entity);
    Task UpdateAsync(FunctionParameter entity);
    Task DeleteAsync(int id);
}
