using OceanTown.Database.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OceanTown.Database.Repositories;

public interface ISimulationProjectRepository
{
    Task<SimulationProject?> GetByIdAsync(int id);
    Task<IEnumerable<SimulationProject>> GetAllAsync();
    Task AddAsync(SimulationProject entity);
    Task UpdateAsync(SimulationProject entity);
    Task DeleteAsync(int id);
}
