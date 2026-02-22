using Microsoft.AspNetCore.Mvc;
using OceanTown.Database.Entities;
using OceanTown.Database.Services.Interfaces;
using OceanTown.Shared;

namespace OceanTown.Server.Controllers.Simulations;

[ApiController]
[Route("api/[controller]")]
public class GameSaveController : ControllerBase
{
    private readonly IGameSaveRepository _repository;
    public GameSaveController(IGameSaveRepository repository)
    {
        this._repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GameSave>>> GetAll()
    {
        var entities = await this._repository.GetAllAsync();
        return Ok(entities);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GameSave>> GetById(int id)
    {
        var entity = await this._repository.GetByIdAsync(id);
        if (entity == null) return NotFound();
        return Ok(entity);
    }

    [HttpPost("{projId:int}/{userId:int}")]
    public async Task<ActionResult<GameSave>> Create(int projId, int userId, GameState entity)
    {
        await this._repository.AddAsync(entity.CreateGameSaveFromState(projId, userId));
        GameSave? createdEntity = await this._repository.GetByIdAsync(userId);
        return CreatedAtAction(nameof(GetById), new { id = createdEntity?.GameSaveId }, createdEntity);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, GameState state)
    {

        var entity = await this._repository.GetByIdAsync(id);
        if (entity == null) return NotFound();

        var updatedEntity = state.CreateGameSaveFromState(entity.SimulationProjectId ?? 2, entity.UserAccountId);
        await this._repository.AddAsync(updatedEntity);

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
