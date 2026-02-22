using Microsoft.AspNetCore.Mvc;
using OceanTown.Database.Entities;
using OceanTown.Database.Services.Interfaces;

namespace OceanTown.Server.Controllers.Simulations;

[ApiController]
[Route("api/[controller]")]
public class FunctionDefinitionController : ControllerBase
{
    private readonly IFunctionDefinitionRepository _repository;
    public FunctionDefinitionController(IFunctionDefinitionRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FunctionDefinition>>> GetAll()
    {
        var entities = await _repository.GetAllAsync();
        return Ok(entities);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FunctionDefinition>> GetById(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null) return NotFound();
        return Ok(entity);
    }

    [HttpPost]
    public async Task<ActionResult<FunctionDefinition>> Create(FunctionDefinition entity)
    {
        await _repository.AddAsync(entity);
        return CreatedAtAction(nameof(GetById), new { id = entity.FunctionDefinitionId }, entity);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, FunctionDefinition entity)
    {
        if (id != entity.FunctionDefinitionId) return BadRequest();
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
