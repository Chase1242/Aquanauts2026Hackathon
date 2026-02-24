namespace OceanTown.Shared;

public sealed record Variable(int VarId, string Code);
public sealed record Parameter(string ParamName, int? VarId, double? ConstantValue);
public sealed class Function(int FuncId, string Name, string Expression,
    int ReturnVarId, string? Category, IList<Parameter> Parameters)
{
    public int FuncId { get; } = FuncId;
    public string Name { get; } = Name;
    public string Expression { get; } = Expression;
    public int ReturnVarId { get; } = ReturnVarId;
    public string? Category { get; } = Category;
    public IList<Parameter> Parameters { get; } = Parameters;
}

public sealed record ExecutionPlan(IReadOnlyList<Function> OrderedFunctions);

public sealed record Simulation(int ProjId, IDictionary<int, Variable> Vars,
    IDictionary<string, Variable> VarsByCode,
    IList<Function> Functions
    )
{
    public ExecutionPlan? Plan { get; set; } = null!;
}

public class GameState
{
    public int Year { get; set; }              // e.g., 0..N
    public Dictionary<string, double> GlobalVariables { get; set; } = [];

    public GameState() { }
}