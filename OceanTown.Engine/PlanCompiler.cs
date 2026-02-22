using OceanTown.Shared;

namespace OceanTown.Engine;

public static class PlanCompiler
{
    public static ExecutionPlan Compile(Simulation sim)
    {
        // map: variableId -> producing function
        var producerByVar = sim.Functions
            .GroupBy(f => f.ReturnVarId)
            .ToDictionary(g => g.Key, g => g.Single()); // enforce 1 producer per var

        // adjacency: function -> dependent functions
        var dependents = sim.Functions.ToDictionary(f => f.FuncId, _ => new List<int>());
        var indegree = sim.Functions.ToDictionary(f => f.FuncId, _ => 0);

        foreach (var f in sim.Functions)
        {
            foreach (var p in f.Parameters.Where(p => p.VarId.HasValue))
            {
                if (!producerByVar.TryGetValue(p.VarId!.Value, out var producer))
                    continue; // input might come from initial state, not computed

                // producer -> f
                dependents[producer.FuncId].Add(f.FuncId);
                indegree[f.FuncId]++;
            }
        }

        // Kahn’s algorithm (topological sort)
        var queue = new Queue<int>(indegree.Where(kv => kv.Value == 0).Select(kv => kv.Key));
        var ordered = new List<Function>(sim.Functions.Count);

        var byId = sim.Functions.ToDictionary(f => f.FuncId);

        while (queue.Count > 0)
        {
            var id = queue.Dequeue();
            ordered.Add(byId[id]);

            foreach (var dep in dependents[id])
            {
                indegree[dep]--;
                if (indegree[dep] == 0) queue.Enqueue(dep);
            }
        }

        // If not all scheduled, there is a cycle (toposort impossible on cyclic graphs) [3](https://www.geeksforgeeks.org/dsa/topological-sorting/)[4](https://www.geeksforgeeks.org/dsa/topological-sort-using-dfs/)
        if (ordered.Count != sim.Functions.Count)
        {
            var cycleNodes = indegree.Where(kv => kv.Value > 0).Select(kv => byId[kv.Key].Name);
            throw new InvalidOperationException("Cyclic function dependencies detected: " + string.Join(", ", cycleNodes));
        }

        return new ExecutionPlan(ordered);
    }

}
