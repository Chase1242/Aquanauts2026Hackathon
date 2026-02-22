using OceanTown.Shared;
using Xunit;

namespace OceanTown.Engine.Tests;

public class ExecutionPlanRecordsTests
{
    [Fact]
    public void VariableRecord_CreatesCorrectly()
    {
        var variable = new Variable(1, "CodeA");
        Assert.Equal(1, variable.VarId);
        Assert.Equal("CodeA", variable.Code);
    }

    [Fact]
    public void ParameterRecord_CreatesCorrectly()
    {
        var param = new Parameter("Param1", 2, 3.5);
        Assert.Equal("Param1", param.ParamName);
        Assert.Equal(2, param.VarId);
        Assert.Equal(3.5, param.ConstantValue);
    }

    [Fact]
    public void Function_CreatesCorrectly()
    {
        var parameters = new List<Parameter> { new("P", 1, null) };
        var func = new Function(10, "FuncName", "x+1", 2, "Cell", parameters);
        Assert.Equal(10, func.FuncId);
        Assert.Equal("FuncName", func.Name);
        Assert.Equal("x+1", func.Expression);
        Assert.Equal(2, func.ReturnVarId);
        Assert.Equal("Cell", func.Category);
        Assert.Equal(parameters, func.Parameters);
    }

    [Fact]
    public void Simulation_CreatesCorrectly()
    {
        var vars = new Dictionary<int, Variable> { { 1, new Variable(1, "A") } };
        var varsByCode = new Dictionary<string, Variable> { { "A", new Variable(1, "A") } };
        var functions = new List<Function>();
        var sim = new Simulation(5, vars, varsByCode, functions);
        Assert.Equal(5, sim.ProjId);
        Assert.Equal(vars, sim.Vars);
        Assert.Equal(varsByCode, sim.VarsByCode);
        Assert.Equal(functions, sim.Functions);
    }

    [Fact]
    public void ExecutionPlan_CreatesCorrectly()
    {
        var functions = new List<Function>();
        var plan = new ExecutionPlan(functions);
        Assert.Equal(functions, plan.OrderedFunctions);
    }
}
