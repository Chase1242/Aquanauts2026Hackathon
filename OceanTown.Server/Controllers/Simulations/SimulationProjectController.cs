using Microsoft.AspNetCore.Mvc;
using OceanTown.Database.Entities;
using OceanTown.Database.Services.Interfaces;

namespace OceanTown.Server.Controllers.Simulations;

[ApiController]
[Route("api/[controller]")]
public class SimulationProjectController : ControllerBase
{
    private readonly ISimulationProjectRepository _repository;
    public SimulationProjectController(ISimulationProjectRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SimulationProject>>> GetAll()
    {
        var entities = await _repository.GetAllAsync();
        return Ok(entities);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SimulationProject>> GetById(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null) return NotFound();
        return Ok(entity);
    }

    [HttpPost]
    public async Task<ActionResult<SimulationProject>> Create(SimulationProject entity)
    {
        await _repository.AddAsync(entity);
        return CreatedAtAction(nameof(GetById), new { id = entity.SimulationProjectId }, entity);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, SimulationProject entity)
    {
        if (id != entity.SimulationProjectId) return BadRequest();
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return NotFound();
        await _repository.UpdateAsync(entity);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return NotFound();
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}
