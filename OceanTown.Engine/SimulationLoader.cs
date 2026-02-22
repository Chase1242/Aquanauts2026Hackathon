using OceanTown.Database.Services.Interfaces;
using OceanTown.Engine.Interfaces;
using OceanTown.Shared;

namespace OceanTown.Engine;

public sealed class SimulationLoader(IFunctionDefinitionRepository functionRepo,
    IVariableDefinitionRepository variableRepo,
    IFunctionParameterRepository funcParamRepo) : ISimulationLoader
{
    private readonly IFunctionDefinitionRepository _functionRepo = functionRepo;
    private readonly IVariableDefinitionRepository _variableRepo = variableRepo;
    private readonly IFunctionParameterRepository _funcParamRepo = funcParamRepo;

    public async Task<Simulation> LoadAsync(int projId, CancellationToken cancellationToken)
    {
        // fetch the variables, functions, and parameters for the project
        var variables = await this._variableRepo.GetVariablesByProjectIdAsync(projId, cancellationToken);
        var functions = await this._functionRepo.GetFunctionsByProjectIdAsync(projId, cancellationToken);

        // fetch parameters for all functions in one go to minimize database calls using a list of function
        // ids
        var parameters = await this._funcParamRepo.GetFunctionParametersByProjectId(projId,
            functions.Select(f => f.FunctionDefinitionId).ToList(),
            cancellationToken);

        // create dictionaries for variables and parameters for easy lookup when constructing the simulation
        var varsById = variables.ToDictionary(v => v.VariableDefinitionId,
            v => new Variable(v.VariableDefinitionId, v.Code));

        var varsByCode = variables.ToDictionary(v =>
            v.Code, v => new Variable(v.VariableDefinitionId, v.Code));

        // group parameters by function id for easy lookup when constructing the functions in the simulation
        var parametersByFuncId = parameters.GroupBy(p => p.FunctionDefinitionId)
            .ToDictionary(g => g.Key, g => g.Select(p =>
                new Parameter(p.Name, p.VariableDefinitionId,
                    p.ConstantValue))
            .ToList());

        // construct groups of functions to their paramters and variables for the simulation
        var functionDefinitions = functions.Select(f =>
            new Function(
                f.FunctionDefinitionId,
                f.Name,
                f.ExpressionText,
                f.ReturnVariableId,
                f.Category,
                parametersByFuncId.TryGetValue(f.FunctionDefinitionId, out List<Parameter>? pars) ?
                pars : Array.Empty<Parameter>()
                )
            ).ToList();

        var sim = new Simulation(projId, varsById, varsByCode, functionDefinitions);
        ExecutionPlan plan = PlanCompiler.Compile(sim);
        sim.Plan = plan;

        return sim;
    }
}