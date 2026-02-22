namespace OceanTown.Engine;

public static class Aggregator
{
    public enum AggregateOp
    {
        Sum,
        Avg,
        Min,
        Max,
        CountNonZero,
        WeightedSum,
        WeightedAvg
    }

    public sealed record AggregationRule(
        string OutputKey,          // global variable name to write
        AggregateOp Op,            // aggregation type
        string InputKey,           // cell variable name to read
        string? WeightKey = null,  // optional: per-cell weight variable name
        double MissingDefault = 0  // value if cell doesn't have InputKey
    );

    public static void Apply(
            IList<Dictionary<string, double>> cells,
            Dictionary<string, double> globals,
            IEnumerable<AggregationRule> rules)
    {
        foreach (var rule in rules)
        {
            double result = rule.Op switch
            {
                AggregateOp.Sum => Sum(cells, rule.InputKey, rule.MissingDefault),
                AggregateOp.Avg => Avg(cells, rule.InputKey, rule.MissingDefault),
                AggregateOp.Min => Min(cells, rule.InputKey, rule.MissingDefault),
                AggregateOp.Max => Max(cells, rule.InputKey, rule.MissingDefault),
                AggregateOp.CountNonZero => CountNonZero(cells, rule.InputKey),
                AggregateOp.WeightedSum => WeightedSum(cells, rule.InputKey, rule.WeightKey!, rule.MissingDefault),
                AggregateOp.WeightedAvg => WeightedAvg(cells, rule.InputKey, rule.WeightKey!, rule.MissingDefault),
                _ => throw new NotSupportedException($"Unsupported op: {rule.Op}")
            };

            globals[rule.OutputKey] = result;
        }
    }

    private static double Get(Dictionary<string, double> cell, string key, double missingDefault)
        => cell.TryGetValue(key, out var v) ? v : missingDefault;

    private static double Sum(IList<Dictionary<string, double>> cells, string key, double missingDefault)
        => cells.Sum(c => Get(c, key, missingDefault));

    private static double Avg(IList<Dictionary<string, double>> cells, string key, double missingDefault)
        => cells.Count == 0 ? 0 : cells.Average(c => Get(c, key, missingDefault));

    private static double Min(IList<Dictionary<string, double>> cells, string key, double missingDefault)
        => cells.Count == 0 ? 0 : cells.Min(c => Get(c, key, missingDefault));

    private static double Max(IList<Dictionary<string, double>> cells, string key, double missingDefault)
        => cells.Count == 0 ? 0 : cells.Max(c => Get(c, key, missingDefault));

    private static double CountNonZero(IList<Dictionary<string, double>> cells, string key)
        => cells.Count(c => c.TryGetValue(key, out var v) && Math.Abs(v) > 1e-12);

    private static double WeightedSum(IList<Dictionary<string, double>> cells, string key, string weightKey, double missingDefault)
        => cells.Sum(c => Get(c, key, missingDefault) * Get(c, weightKey, 0));

    private static double WeightedAvg(IList<Dictionary<string, double>> cells, string key, string weightKey, double missingDefault)
    {
        double num = 0, den = 0;
        foreach (var c in cells)
        {
            var w = Get(c, weightKey, 0);
            num += Get(c, key, missingDefault) * w;
            den += w;
        }
        return den == 0 ? 0 : num / den;
    }

}
