using OceanTown.Engine.Interfaces;
using OceanTown.Shared;
using static OceanTown.Engine.Aggregator;

namespace OceanTown.Engine;

public sealed class SimulationEngine : ISimulationEngine
{
    private readonly Dictionary<int, NCalc.Expression> _exprCache = new();

    public GameState StepYear(GameState loaded, Simulation def, ExecutionPlan plan,
        IList<AggregationRule> rules, bool snapshot = true)
    {

        var globalRead = snapshot
                ? new Dictionary<string, double>(loaded.GlobalVariables)
                : loaded.GlobalVariables;

        var next = new GameState
        {
            Year = loaded.Year + 1,
            GlobalVariables = new Dictionary<string, double>(globalRead) // start as copy, overwrite later
        };

        //// ---- Phase A: per-cell functions only ----
        //foreach (var cell in current.Cells)
        //{
        //    var cellRead = snapshot ? new Dictionary<string, double>(cell) : cell;
        //    var cellNext = new Dictionary<string, double>(cellRead);

        //    foreach (var fn in def.Functions.Where(of => of.Category == "Cell" || of.Category == null)) // <-- split plan!
        //    {
        //        var expr = GetOrCreateExpression(fn.FuncId, fn.Expression);

        //        // set parameters: (cell overrides globals)
        //        foreach (var p in fn.Parameters)
        //        {
        //            if (p.ConstantValue.HasValue)
        //            {
        //                expr.Parameters[p.ParamName] = p.ConstantValue.Value;
        //            }
        //            else if (p.VarId.HasValue)
        //            {
        //                var code = def.Vars[p.VarId.Value].Code;
        //                if (!cellRead.TryGetValue(code, out var v) && !globalRead.TryGetValue(code, out v))
        //                    throw new KeyNotFoundException($"Missing '{code}' for '{fn.Name}'.");

        //                expr.Parameters[p.ParamName] = v;
        //            }
        //        }

        //        var result = Convert.ToDouble(expr.Evaluate());
        //        var outCode = def.Vars[fn.ReturnVarId].Code;
        //        cellNext[outCode] = result;

        //        if (!snapshot) cellRead[outCode] = result;
        //    }

        //    next.Cells.Add(cellNext);
        //}

        //// ---- Phase B: aggregate next.Cells -> next.GlobalVariables ----
        //Aggregator.Apply(next.Cells, next.GlobalVariables, rules);

        // ---- Phase C: global functions once ----
        foreach (var fn in def.Functions.Where(of => of.Category == "Global"))
        {
            var expr = GetOrCreateExpression(fn.FuncId, fn.Expression);

            foreach (var p in fn.Parameters)
            {
                if (p.ConstantValue.HasValue)
                {
                    expr.Parameters[p.ParamName] = p.ConstantValue.Value;
                }
                else if (p.VarId.HasValue)
                {
                    var code = def.Vars[p.VarId.Value].Code;
                    if (!next.GlobalVariables.TryGetValue(code, out var v) &&
                        !globalRead.TryGetValue(code, out v))
                        throw new KeyNotFoundException($"Missing global '{code}' for '{fn.Name}'.");

                    expr.Parameters[p.ParamName] = v;
                }
            }
            var result = Convert.ToDouble(expr.Evaluate());

            result = Math.Max(0, Math.Min(1, result)); // clamp to [0,1] if desired

            var outCode = def.Vars[fn.ReturnVarId].Code;
            next.GlobalVariables[outCode] = result;
        }

        return next;
    }

    private NCalc.Expression GetOrCreateExpression(int funcId, string exprText)
    {
        if (!this._exprCache.TryGetValue(funcId, out var expr))
        {
            expr = new NCalc.Expression(exprText);
            this._exprCache[funcId] = expr;
        }
        return expr;
    }

    private static void Aggregate(IList<Dictionary<string, double>> cells, Dictionary<string, double> globals)
    {
        // Examples:
        globals["TotalDeforestation"] = cells.Sum(c => c.GetValueOrDefault("Deforestation"));
        globals["AvgForestCover"] = cells.Average(c => c.GetValueOrDefault("ForestCover"));
        globals["TotalPollution"] = cells.Sum(c => c.GetValueOrDefault("Pollution"));

        // Optionally: weighted (e.g., coastal cells weigh more)
    }


}