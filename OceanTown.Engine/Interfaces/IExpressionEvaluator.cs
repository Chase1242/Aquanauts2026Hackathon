namespace OceanTown.Engine.Interfaces;

public interface IExpressionEvaluator
{
    double Evaluate(string expressionText, IReadOnlyDictionary<string, double> variables);
}
