using Microsoft.AspNetCore.Mvc;
using OceanTown.Database.Entities;
using OceanTown.Database.Services.Interfaces;

namespace OceanTown.Server.Controllers.Simulations;

[ApiController]
[Route("api/[controller]")]
public class UserAccountController : ControllerBase
{
    private readonly IUserAccountRepository _repository;
    public UserAccountController(IUserAccountRepository repository)
    {
        this._repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserAccount>>> GetAll()
    {
        var entities = await this._repository.GetAllAsync();
        return Ok(entities);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserAccount>> GetById(int id)
    {
        var entity = await this._repository.GetByIdAsync(id);
        if (entity == null) return NotFound();
        return Ok(entity);
    }

    [HttpGet("{username}/username")]
    public async Task<ActionResult<UserAccount>> GetByUsername(string username)
    {
        var entity = await this._repository.GetByUsernameAsync(username);
        if (entity == null) return NotFound();

        return Ok(entity);
    }

    [HttpPost]
    public async Task<ActionResult<UserAccount>> Create(UserAccount entity)
    {
        await this._repository.AddAsync(entity);
        return CreatedAtAction(nameof(GetById), new { id = entity.UserAccountId }, entity);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UserAccount entity)
    {
        if (id != entity.UserAccountId) return BadRequest();
        var existing = await this._repository.GetByIdAsync(id);
        if (existing == null) return NotFound();
        await this._repository.UpdateAsync(entity);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await this._repository.GetByIdAsync(id);
        if (existing == null) return NotFound();
        await this._repository.DeleteAsync(id);
        return NoContent();
    }
}
