export function applyScenario(state, scenario, choice) {
  const newState = { ...state };
  const effect = scenario.effects[choice];

  newState.ecosystem += effect.ecosystem;
  newState.population += effect.population;
  newState.happiness += effect.happiness;

  newState.ecosystem = Math.max(0, newState.ecosystem);
  newState.population = Math.max(0, newState.population);
  newState.happiness = Math.max(0, newState.happiness);

  return newState;
}