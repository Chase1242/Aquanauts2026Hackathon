using OceanTown.Shared;

namespace OceanTown.Engine.Interfaces;

public interface ISimulationLoader
{
    Task<Simulation> LoadAsync(int projId, CancellationToken cancellationToken);
}
