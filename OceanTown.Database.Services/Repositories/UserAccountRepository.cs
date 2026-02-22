using Microsoft.EntityFrameworkCore;
using OceanTown.Database.Entities;
using OceanTown.Database.Services.Interfaces;

namespace OceanTown.Database.Services.Repositories;

public class UserAccountRepository : IUserAccountRepository
{
    private readonly AquanautsOceanTownContext _context;

    public UserAccountRepository(AquanautsOceanTownContext context)
    {
        this._context = context;
    }

    public async Task<UserAccount?> GetByIdAsync(int id)
    {
        return await this._context.UserAccounts.FindAsync(id);
    }

    public async Task<IEnumerable<UserAccount>> GetAllAsync()
    {
        return await this._context.UserAccounts.ToListAsync();
    }

    public async Task<UserAccount> AddAsync(UserAccount entity)
    {
        this._context.UserAccounts.Add(entity);
        await this._context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(UserAccount entity)
    {
        this._context.UserAccounts.Update(entity);
        await this._context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await this._context.UserAccounts.FindAsync(id);
        if (entity != null)
        {
            this._context.UserAccounts.Remove(entity);
            await this._context.SaveChangesAsync();
        }
    }
}
