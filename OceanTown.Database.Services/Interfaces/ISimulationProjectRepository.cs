using OceanTown.Database.Entities;

namespace OceanTown.Database.Services.Interfaces;

public interface ISimulationProjectRepository
{
    Task<SimulationProject?> GetByIdAsync(int id);
    Task<IEnumerable<SimulationProject>> GetAllAsync();
    Task AddAsync(SimulationProject entity);
    Task UpdateAsync(SimulationProject entity);
    Task DeleteAsync(int id);
}
