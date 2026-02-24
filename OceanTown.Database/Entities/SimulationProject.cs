namespace OceanTown.Database.Entities;

public partial class SimulationProject
{
    public int SimulationProjectId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? StartState { get; set; }

    public virtual ICollection<FunctionDefinition> FunctionDefinitions { get; set; } = new List<FunctionDefinition>();

    public virtual ICollection<GameSave> GameSaves { get; set; } = new List<GameSave>();

    public virtual ICollection<VariableDefinition> VariableDefinitions { get; set; } = new List<VariableDefinition>();
}
