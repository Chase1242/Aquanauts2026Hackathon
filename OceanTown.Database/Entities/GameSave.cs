namespace OceanTown.Database.Entities;

public partial class GameSave
{
    public int GameSaveId { get; set; }

    public int UserAccountId { get; set; }

    public string SaveName { get; set; } = null!;

    public string GameStateJson { get; set; } = null!;

    public bool IsDeleted { get; set; }

    public DateTime? DeletedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? EngineVersion { get; set; }

    public int? SimulationProjectId { get; set; }

    public virtual SimulationProject? SimulationProject { get; set; }

    public virtual UserAccount UserAccount { get; set; } = null!;
}
