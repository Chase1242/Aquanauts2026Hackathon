namespace OceanTown.Database.Entities;

public partial class FunctionDefinition
{
    public int FunctionDefinitionId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string ExpressionText { get; set; } = null!;

    public int ReturnVariableId { get; set; }

    public int? SimulationProjectId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<FunctionParameter> FunctionParameters { get; set; } = new List<FunctionParameter>();

    public virtual VariableDefinition ReturnVariable { get; set; } = null!;

    public virtual SimulationProject? SimulationProject { get; set; }
}
