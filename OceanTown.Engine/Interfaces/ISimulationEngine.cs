using OceanTown.Shared;

namespace OceanTown.Engine.Interfaces;

public interface ISimulationEngine
{
    GameState StepYear(GameState current, Simulation def, ExecutionPlan plan, bool snapshot = true);
}
