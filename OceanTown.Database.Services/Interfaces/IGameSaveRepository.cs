using OceanTown.Database.Entities;

namespace OceanTown.Database.Services.Interfaces;

public interface IGameSaveRepository
{
    Task<GameSave?> GetByIdAsync(int id);
    Task<GameSave?> GetByUsernameAsync(string username, int projId);
    Task<IEnumerable<GameSave>> GetAllAsync();
    Task AddAsync(GameSave entity);
    Task UpdateAsync(GameSave entity);
    Task DeleteAsync(int id);
}
