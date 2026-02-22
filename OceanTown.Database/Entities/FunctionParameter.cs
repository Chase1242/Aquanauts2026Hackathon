using System;
using System.Collections.Generic;

namespace OceanTown.Database.Entities;

public partial class FunctionParameter
{
    public int FunctionParameterId { get; set; }

    public int FunctionDefinitionId { get; set; }

    public string Name { get; set; } = null!;

    public int? VariableDefinitionId { get; set; }

    public double? ConstantValue { get; set; }

    public int? Order { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual FunctionDefinition FunctionDefinition { get; set; } = null!;

    public virtual VariableDefinition? VariableDefinition { get; set; }
}
