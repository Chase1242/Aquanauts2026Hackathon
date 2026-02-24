namespace OceanTown.Database.Entities;

public partial class VariableDefinition
{
    public int VariableDefinitionId { get; set; }

    public string Code { get; set; } = null!;

    public string DisplayName { get; set; } = null!;

    public string? Description { get; set; }

    public string? Unit { get; set; }

    public string? Category { get; set; }

    public int? SimulationProjectId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public double? MinValue { get; set; }

    public double? MaxValue { get; set; }

    public double? DeltaMax { get; set; }

    public virtual ICollection<FunctionDefinition> FunctionDefinitions { get; set; } = new List<FunctionDefinition>();

    public virtual ICollection<FunctionParameter> FunctionParameters { get; set; } = new List<FunctionParameter>();

    public virtual SimulationProject? SimulationProject { get; set; }
}
