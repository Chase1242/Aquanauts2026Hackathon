using OceanTown.Database.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OceanTown.Database.Services.Interfaces;

public interface IUserAccountRepository
{
    Task<UserAccount?> GetByIdAsync(int id);
    Task<IEnumerable<UserAccount>> GetAllAsync();
    Task AddAsync(UserAccount entity);
    Task UpdateAsync(UserAccount entity);
    Task DeleteAsync(int id);
}
