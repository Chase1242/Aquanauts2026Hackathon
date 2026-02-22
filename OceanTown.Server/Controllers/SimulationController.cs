using Microsoft.AspNetCore.Mvc;
using OceanTown.Engine;
using OceanTown.Engine.Interfaces;
using OceanTown.Shared;

namespace OceanTown.Server.Controllers;


[ApiController]
[Route("api/simulation")]
public sealed class SimulationController : ControllerBase
{
    private readonly ISimulationLoader _loader;
    private readonly SimulationEngine _engine;

    public SimulationController(
        ISimulationLoader loader,
        SimulationEngine engine)
    {
        this._loader = loader;
        this._engine = engine;
    }

    /// <summary>
    /// Load a simulation definition (variables, functions, execution plan).
    /// </summary>
    [HttpGet("{projectId:int}")]
    [ProducesResponseType(typeof(Simulation), StatusCodes.Status200OK)]
    public async Task<IActionResult> LoadSimulation(int projectId, CancellationToken ct)
    {
        var simulation = await this._loader.LoadAsync(projectId, ct);
        return Ok(simulation);
    }

    /// <summary>
    /// Advance the simulation by one year.
    /// </summary>
    [HttpPost("{projectId:int}/step")]
    [ProducesResponseType(typeof(StepResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Step(
        int projectId,
        [FromBody] StepRequest request,
        CancellationToken ct)
    {
        var simulation = await this._loader.LoadAsync(projectId, ct);
        var plan = simulation.Plan;

        var nextState = this._engine.StepYear(
            request.State,
            simulation,
            plan ?? throw new ArgumentNullException(nameof(plan)),
            snapshot: request.Snapshot
        );

        return Ok(new StepResponse
        {
            NextState = nextState
        });
    }
}

public sealed class StepRequest
{
    public GameState State { get; set; } = default!;
    public bool Snapshot { get; set; } = true;
}

public sealed class StepResponse
{
    public GameState NextState { get; set; } = default!;
}
