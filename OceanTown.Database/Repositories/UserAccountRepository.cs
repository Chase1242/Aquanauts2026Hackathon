using OceanTown.Database.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OceanTown.Database.Repositories;

public class UserAccountRepository : IUserAccountRepository
{
    private readonly AquanautsOceanTownContext _context;

    public UserAccountRepository(AquanautsOceanTownContext context)
    {
        _context = context;
    }

    public async Task<UserAccount?> GetByIdAsync(int id)
    {
        return await _context.UserAccounts.FindAsync(id);
    }

    public async Task<IEnumerable<UserAccount>> GetAllAsync()
    {
        return await _context.UserAccounts.ToListAsync();
    }

    public async Task AddAsync(UserAccount entity)
    {
        _context.UserAccounts.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(UserAccount entity)
    {
        _context.UserAccounts.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _context.UserAccounts.FindAsync(id);
        if (entity != null)
        {
            _context.UserAccounts.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
