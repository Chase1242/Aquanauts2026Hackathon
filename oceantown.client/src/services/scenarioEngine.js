export const scenarios = [

  {
    id: "amazon_warehouse",
    title: "Amazon wants to build a warehouse.",
    description: "They request clearing 50 trees.",
    effects: {
      YES: { ecosystem: -20, population: +15, happiness: +10 },
      NO: { ecosystem: 0, population: -10, happiness: -15 }
    }
  },

  {
    id: "coal_plant",
    title: "Energy crisis hits the island.",
    description: "Build a coal power plant for cheap electricity?",
    effects: {
      YES: { ecosystem: -25, population: +10, happiness: +15 },
      NO: { ecosystem: 0, population: -8, happiness: -12 }
    }
  },

  {
    id: "solar_farm",
    title: "Proposal to build a solar farm.",
    description: "Requires land but reduces emissions.",
    effects: {
      YES: { ecosystem: +10, population: +5, happiness: +8 },
      NO: { ecosystem: -5, population: 0, happiness: -5 }
    }
  },

  {
    id: "fishing_expansion",
    title: "Local fishermen want to expand operations.",
    description: "Boost economy but risk overfishing.",
    effects: {
      YES: { ecosystem: -15, population: +12, happiness: +6 },
      NO: { ecosystem: +5, population: -6, happiness: -8 }
    }
  },

  {
    id: "wildlife_reserve",
    title: "Create a protected wildlife reserve.",
    description: "Limit development in key forest area.",
    effects: {
      YES: { ecosystem: +20, population: -5, happiness: -3 },
      NO: { ecosystem: -10, population: +5, happiness: +5 }
    }
  },

  {
    id: "luxury_resort",
    title: "Investors want to build a luxury resort.",
    description: "Tourism income vs mangrove destruction.",
    effects: {
      YES: { ecosystem: -18, population: +14, happiness: +10 },
      NO: { ecosystem: +5, population: -7, happiness: -10 }
    }
  },

  {
    id: "plastic_factory",
    title: "A plastics factory offers jobs.",
    description: "Risk of ocean pollution increases.",
    effects: {
      YES: { ecosystem: -22, population: +18, happiness: +8 },
      NO: { ecosystem: +3, population: -12, happiness: -15 }
    }
  },

  {
    id: "reforestation",
    title: "Launch a reforestation initiative.",
    description: "Costs money but restores biodiversity.",
    effects: {
      YES: { ecosystem: +25, population: -3, happiness: +5 },
      NO: { ecosystem: -8, population: 0, happiness: -6 }
    }
  },

  {
    id: "oil_drilling",
    title: "Offshore oil drilling opportunity.",
    description: "Major economic boost but environmental risk.",
    effects: {
      YES: { ecosystem: -30, population: +20, happiness: +15 },
      NO: { ecosystem: +2, population: -15, happiness: -12 }
    }
  },

  {
    id: "climate_storm",
    title: "A major storm hits the island.",
    description: "Invest in rebuilding sustainably?",
    effects: {
      YES: { ecosystem: +8, population: +3, happiness: +12 },
      NO: { ecosystem: -12, population: -10, happiness: -20 }
    }
  }

];