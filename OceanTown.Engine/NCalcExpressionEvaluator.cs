using NCalc;
using OceanTown.Engine.Interfaces;

namespace OceanTown.Engine;

public sealed class NCalcExpressionEvaluator : IExpressionEvaluator
{
    public double Evaluate(string expressionText, IReadOnlyDictionary<string, double> variables)
    {
        var expression = new Expression(expressionText);

        foreach (var kvp in variables)
            expression.Parameters[kvp.Key] = kvp.Value;

        var result = expression.Evaluate();

        double.TryParse(result?.ToString(), out double numericResult);
        // Implement NCalc-based expression evaluation logic here
        return numericResult;
    }
}
