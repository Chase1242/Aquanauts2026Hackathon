using Microsoft.AspNetCore.Mvc;
using OceanTown.Database.Entities;
using OceanTown.Database.Services.Interfaces;
using OceanTown.Engine.Interfaces;
using OceanTown.Shared;
using static OceanTown.Engine.Aggregator;

namespace OceanTown.Server.Controllers;


[ApiController]
[Route("api/simulation")]
public sealed class SimulationController : ControllerBase
{
    private readonly ISimulationLoader _loader;
    private readonly ISimulationEngine _engine;
    private readonly IGameSaveRepository _gameSaveRepository;
    private readonly IUserAccountRepository _userAccountRepository;
    private readonly IVariableDefinitionRepository _variableDefinitionRepository;

    public SimulationController(
        ISimulationLoader loader,
        ISimulationEngine engine,
        IGameSaveRepository gameSaveRepository,
        IUserAccountRepository userAccountRepository,
        IVariableDefinitionRepository variableDefinitionRepository)
    {
        this._loader = loader;
        this._engine = engine;
        this._gameSaveRepository = gameSaveRepository;
        this._userAccountRepository = userAccountRepository;
        this._variableDefinitionRepository = variableDefinitionRepository;
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
    /// Load a simulation definition (variables, functions, execution plan).
    /// </summary>
    [HttpGet("{projectId:int}/{username}")]
    [ProducesResponseType(typeof(LoadResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> LoadSimulation(int projectId, string username, CancellationToken ct)
    {
        //var simulation = await this._loader.LoadAsync(projectId, ct);
        var game = await this._gameSaveRepository.GetByUsernameAsync(username, projectId);
        var state = game!.ToGameState();
        //Aggregator.Apply(state.Cells, state.GlobalVariables, new List<AggregationRule>
        //    {
        //        new("TotForest", AggregateOp.Sum, "A"),
        //        new("AvgForest", AggregateOp.Avg, "A"),
        //        new("OilTot", AggregateOp.Sum, "OilCell"),
        //    });
        return Ok(new LoadResponse { State = state });
    }

    /// <summary>
    /// Advance the simulation by one year.
    /// </summary>
    [HttpPost("{projectId:int}/step/{userId:int}")]
    [ProducesResponseType(typeof(StepResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Step(
        int projectId,
        int userId,
        [FromBody] StepRequest request,
        CancellationToken ct)
    {
        var simulation = await this._loader.LoadAsync(projectId, ct);
        var plan = simulation.Plan;

        var prevSave = await this._gameSaveRepository.GetByUsernameAsync(userId.ToString(), projectId);
        var loadedState = prevSave?.ToGameState();
        var variables = await this._variableDefinitionRepository
            .QueryAsync(new VariableDefinition
            {
                SimulationProjectId = projectId

            });

        var mappedDict = loadedState?.GlobalVariables
            .ToDictionary(gv => gv.Key, gv =>
            {
                var variableDef = variables.FirstOrDefault(v => v.Code == gv.Key);
                double val = gv.Value;
                return (val, variableDef?.MinValue ?? 0, variableDef?.MaxValue ?? 1, variableDef?.MaxValue ?? 0.05);
            });

        var deltaAppliedState = mappedDict?.ApplyDeltas(request.State.GlobalVariables);

        request.State.GlobalVariables = deltaAppliedState ?? request.State.GlobalVariables;
        var nextState = this._engine.StepYear(
            request.State,
            simulation,
            plan,
            new List<AggregationRule>
            {
                new("TotForest", AggregateOp.Sum, "A"),
                new("AvgForest", AggregateOp.Avg, "A"),
                new("OilTot", AggregateOp.Sum, "OilCell"),
            },
            snapshot: request.Snapshot
        );

        var gameSave = nextState.CreateGameSaveFromState(projectId, userId);
        await this._gameSaveRepository.AddAsync(gameSave);

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

public sealed class LoadResponse
{
    public GameState State { get; set; } = default!;
}
