using OceanTown.Database.Services.Interfaces;
using Xunit;
using Moq;
using System.Collections.Generic;
using System.Threading;
using OceanTown.Engine;

namespace OceanTown.Engine.Tests;

public class SimulationLoaderTests
{
    [Fact]
    public async Task LoadAsync_ReturnsSimulationWithPlan()
    {
        var functionRepo = new Mock<IFunctionDefinitionRepository>();
        var variableRepo = new Mock<IVariableDefinitionRepository>();
        var funcParamRepo = new Mock<IFunctionParameterRepository>();

        functionRepo.Setup(r => r.GetFunctionsByProjectIdAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<FunctionDef>());
        variableRepo.Setup(r => r.GetVariablesByProjectIdAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<VariableDef>());
        funcParamRepo.Setup(r => r.GetFunctionParametersByProjectId(It.IsAny<int>(), It.IsAny<IList<int>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<ParameterDef>());

        var loader = new SimulationLoader(functionRepo.Object, variableRepo.Object, funcParamRepo.Object);
        var sim = await loader.LoadAsync(1, CancellationToken.None);

        Assert.NotNull(sim);
        Assert.NotNull(sim.Plan);
        Assert.Empty(sim.Functions);
        Assert.Empty(sim.Vars);
        Assert.Empty(sim.VarsByCode);
    }
}
