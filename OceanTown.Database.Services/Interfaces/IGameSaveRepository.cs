using OceanTown.Database.Entities;

namespace OceanTown.Database.Services.Interfaces;

public interface IGameSaveRepository
{
    Task<GameSave?> GetByIdAsync(int id);
    Task<IEnumerable<GameSave>> GetAllAsync();
    Task AddAsync(GameSave entity);
    Task UpdateAsync(GameSave entity);
    Task DeleteAsync(int id);
}
