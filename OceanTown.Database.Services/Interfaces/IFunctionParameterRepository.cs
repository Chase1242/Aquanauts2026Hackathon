using OceanTown.Database.Entities;

namespace OceanTown.Database.Services.Interfaces;

public interface IFunctionParameterRepository
{
    Task<FunctionParameter?> GetByIdAsync(int id);
    Task<IEnumerable<FunctionParameter>> GetAllAsync();
    Task AddAsync(FunctionParameter entity);
    Task UpdateAsync(FunctionParameter entity);
    Task DeleteAsync(int id);
}
