import React, { useState, useEffect } from "react";
import IslandScene from "./components/IslandScene";
import { getSimulation, getSimulationForUser, stepSimulation } from "./oceanTownApi";
import { scenarios } from "./services/scenarioEngine";
import { getCitizenDialogue } from "./services/geminiService";
import "./App.css";

type GameState = {
    ecosystem: number;
    population: number;
    happiness: number;
    [key: string]: any;
};

type CitizenReaction = {
    citizen: string;
    tone?: string;
};

type Scenario = {
    id: string;
    title: string;
    description: string;
    [key: string]: unknown;
};

function getRandomScenario(state: GameState): Scenario {
    const all = scenarios as unknown as Scenario[];

    if (state.ecosystem < 40) {
        const crisisEvents = all.filter(
            (s) => s.id.includes("storm") || s.id.includes("oil") || s.id.includes("coral")
        );

        if (crisisEvents.length > 0) {
            return crisisEvents[Math.floor(Math.random() * crisisEvents.length)];
        }
    }

    return all[Math.floor(Math.random() * all.length)];
}

export default function IslandGame({ state, setState }: { state: GameState, setState: (s: GameState) => void }) {
    // Simulation project/user IDs (customize as needed)
    const projectId = 2;
    const userId = 1;

    // Holds the simulation state from the API
    const [simState, setSimState] = useState<any>(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [citizenReaction, setCitizenReaction] = useState<CitizenReaction | null>(null);
    const [selectedCitizen, setSelectedCitizen] = useState<number | null>(null);
    const [bubbleVisible, setBubbleVisible] = useState(false);
    const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);

    // Helper: Convert number of trees to ecosystem percentage
    function treesToEcosystem(numTrees: number) {
        return Math.round((numTrees / 300) * 100);
    }

    // Helper: Convert ecosystem percentage to number of trees (min 300)
    function ecosystemToTrees(ecosystem: number) {
        return Math.max(300, Math.round((ecosystem / 100) * 300));
    }

    // Helper: Convert GameState to d and A
    function getDA(ecosystem: number) {
        const d = ecosystem / 100;
        const A = 1 - d;
        return { d, A };
    }

    // Fetch initial simulation state on mount
    useEffect(() => {
        async function fetchSim() {
            const sim = await getSimulationForUser(projectId, "chase.conaway");
            setSimState(sim);
            // Optionally, pick a scenario based on sim state
            const all = scenarios as unknown as Scenario[];
            setCurrentScenario(all[Math.floor(Math.random() * all.length)]);
            // Update parent state with converted values
            if (setState && sim?.state?.globalVariables) {
                setState({
                    ecosystem: treesToEcosystem(sim.state.globalVariables?.TotForest || 300),
                    population: sim.state.globalVariables?.P || 0,
                    happiness: sim.state.globalVariables?.H || 0
                });
            }
        }
        fetchSim();
    }, []);

    async function handleDecision(choice: "YES" | "NO") {
        if (!simState || !currentScenario) return;

        setLoadingAI(true);
        setBubbleVisible(false);
        setCitizenReaction(null);

        // Prepare state for API: convert ecosystem percentage to number of trees
        const apiState = {
            ...simState.state,
            globalVariables: {
                ...simState.state.globalVariables,
                TotForest: ecosystemToTrees(state.ecosystem)
            }
        };

        // Call the API to step the simulation
        const stepRequest = {
            State: apiState,
            Scenario: currentScenario.id,
            Choice: choice
        };
        const stepResult = await stepSimulation(projectId, userId, stepRequest);
        setSimState(stepResult);

        // Update parent state with converted values
        if (setState) {
            setState({
                ecosystem: treesToEcosystem(stepResult.state.globalVariables?.TotForest || 300),
                population: stepResult.state.globalVariables?.P || 0,
                happiness: stepResult.state.globalVariables?.H || 0
            });
        }

        // Fetch AI Dialogue based on decision
        const aiResponse = await getCitizenDialogue(stepResult, currentScenario.title, choice);
        //console.log(aiResponse);
        setCitizenReaction(aiResponse);
        setLoadingAI(false);

        // Calculate which citizen "speaks"
        const visibleCount = Math.max(0, Math.floor(((stepResult.state.globalVariables?.P || 0) / 300) * 16));
        const randomIndex = visibleCount > 0 ? Math.floor(Math.random() * visibleCount) : null;

        setSelectedCitizen(randomIndex);
        setBubbleVisible(visibleCount > 0);

        // Set the next scenario
        const all = scenarios as unknown as Scenario[];
        setCurrentScenario(all[Math.floor(Math.random() * all.length)]);
    }


    // Handler for when all citizens are gone
    function handleAllGone() {
        // You can add custom logic here, e.g., show a message or reset the game
        alert("All citizens are gone!");
    }

    return (
        <div className="game-container w-full h-full relative">
            <div className="absolute inset-0 flex items-center justify-center pt-32">
                <IslandScene
                    ecosystem={treesToEcosystem(simState?.state?.globalVariables?.TotForest || 300)}
                    population={simState?.state?.globalVariables?.P ?? state.population}
                    onAllGone={handleAllGone}
                />
            </div>

            {citizenReaction && (
                <div className="speechOverlay" onClick={() => setCitizenReaction(null)}>
                    <div className="speechBox">
                        <p>"{citizenReaction.citizen}"</p>
                        <small>Click to continue</small>
                    </div>
                </div>
            )}
        </div>
    );
}
