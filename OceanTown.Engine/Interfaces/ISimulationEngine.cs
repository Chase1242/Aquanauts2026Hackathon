using OceanTown.Shared;
using static OceanTown.Engine.Aggregator;

namespace OceanTown.Engine.Interfaces;

public interface ISimulationEngine
{
    GameState StepYear(GameState deltas, Simulation def, ExecutionPlan plan,
        IList<AggregationRule> rules, bool snapshot = true);
}
