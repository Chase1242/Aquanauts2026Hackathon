using OceanTown.Shared;
using static OceanTown.Engine.Aggregator;

namespace OceanTown.Engine.Tests;

public class SimulationEngineTests
{
    [Fact]
    public void StepYear_IncrementsYearAndAggregatesCorrectly()
    {
        var engine = new SimulationEngine();
        var gameState = new GameState
        {
            Year = 0,
            GlobalVariables = new Dictionary<string, double> { { "Deforestation", 30 }, { "ForestCover", 55 }, { "Pollution", 15 } }
        };
        var simulation = new Simulation(1, new Dictionary<int, Variable>(), new Dictionary<string, Variable>(), new List<Function>());
        var plan = new ExecutionPlan(new List<Function>());

        var next = engine.StepYear(gameState, simulation, plan, new List<AggregationRule>());

        Assert.Equal(1, next.Year);
        Assert.True(next.GlobalVariables.ContainsKey("TotalDeforestation"));
        Assert.True(next.GlobalVariables.ContainsKey("AvgForestCover"));
        Assert.True(next.GlobalVariables.ContainsKey("TotalPollution"));
        Assert.Equal(30, next.GlobalVariables["TotalDeforestation"]);
        Assert.Equal(55, next.GlobalVariables["AvgForestCover"]);
        Assert.Equal(15, next.GlobalVariables["TotalPollution"]);
    }
}
