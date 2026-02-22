import React, { useState } from "react";
import IslandScene from "./components/IslandScene";
import { applyScenario } from "./services/gameEngine";
import { scenarios } from "./services/scenarioEngine";
import { getCitizenDialogue } from "./services/geminiService";
import "./App.css";

type GameState = {
    ecosystem: number;
    population: number;
    happiness: number;
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

    // Initialize the first scenario
    const [currentScenario, setCurrentScenario] = useState<Scenario>(() => {
        const all = scenarios as unknown as Scenario[];
        return all[Math.floor(Math.random() * all.length)];
    });

    const [loadingAI, setLoadingAI] = useState(false);
    const [citizenReaction, setCitizenReaction] = useState<CitizenReaction | null>(null);
    const [selectedCitizen, setSelectedCitizen] = useState<number | null>(null);
    const [bubbleVisible, setBubbleVisible] = useState(false);

    async function handleDecision(choice: "YES" | "NO") {
        const updated = applyScenario(state, currentScenario, choice) as GameState;

        // Constraint clamping
        updated.ecosystem = Math.min(updated.ecosystem, 100);
        updated.population = Math.min(updated.population, 300);
        updated.happiness = Math.min(updated.happiness, 100);

        setState(updated);
        setLoadingAI(true);
        setBubbleVisible(false);
        setCitizenReaction(null);

        // Fetch AI Dialogue based on decision
        const aiResponse = await getCitizenDialogue(updated, currentScenario.title, choice);

        setCitizenReaction(aiResponse);
        setLoadingAI(false);

        // Calculate which citizen "speaks"
        const visibleCount = Math.max(0, Math.floor((updated.population / 300) * 16));
        const randomIndex = visibleCount > 0 ? Math.floor(Math.random() * visibleCount) : null;

        setSelectedCitizen(randomIndex);
        setBubbleVisible(visibleCount > 0);

        // Set the next scenario
        setCurrentScenario(getRandomScenario(updated));
    }

    return (
        <div className="game-container w-full h-full relative">
            <div className="absolute inset-0 flex items-center justify-center pt-32">
                <IslandScene
                    ecosystem={state.ecosystem}
                    population={state.population}
                    frozen={loadingAI || !!citizenReaction}
                    selectedCitizen={selectedCitizen}
                    bubbleVisible={bubbleVisible}
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