import React, { useState } from "react";
import IslandScene from "./components/IslandScene";
import DecisionModal from "./components/DecisionModal";
import { applyScenario } from "./services/gameEngine";
import { scenarios } from "./services/scenarioEngine";
import { getCitizenDialogue } from "./services/geminiService";
import { AnimatePresence } from "framer-motion";
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
};
const showReaction = false;

function getRandomScenario(state: GameState): Scenario {
    const all = scenarios as Scenario[];

    if (state.ecosystem < 40) {
        const crisisEvents = all.filter(
            (s) =>
                s.id.includes("storm") ||
                s.id.includes("oil") ||
                s.id.includes("coral")
        );

        if (crisisEvents.length > 0) {
            return crisisEvents[
                Math.floor(Math.random() * crisisEvents.length)
            ];
        }
    }

    return all[Math.floor(Math.random() * all.length)];
}

export default function IslandGame({
    state,
    setState,
}: {
    state: GameState;
    setState: React.Dispatch<React.SetStateAction<GameState>>;
}) {
    const [currentScenario, setCurrentScenario] = useState<Scenario>(() => {
        const all = scenarios as Scenario[];
        return all[Math.floor(Math.random() * all.length)];
    });

    const [loadingAI, setLoadingAI] = useState(false);
    const [citizenReaction, setCitizenReaction] =
        useState<CitizenReaction | null>(null);
    const [selectedCitizen, setSelectedCitizen] =
        useState<number | null>(null);
    const [bubbleVisible, setBubbleVisible] = useState(false);

    // 🔥 THIS controls fade in/out of modal
    const [showDecision, setShowDecision] = useState(true);

    async function handleDecision(choice: "YES" | "NO") {
        const updated = applyScenario(
            state,
            currentScenario,
            choice
        ) as GameState;

        updated.ecosystem = Math.min(updated.ecosystem, 100);
        updated.population = Math.min(updated.population, 300);
        updated.happiness = Math.min(updated.happiness, 100);

        setState(updated);

        setLoadingAI(true);
        setBubbleVisible(false);
        setCitizenReaction(null);

        const aiResponse = await getCitizenDialogue(
            updated,
            currentScenario.title,
            choice
        );

        setCitizenReaction(aiResponse);
        setLoadingAI(false);

        const visibleCount = Math.max(
            0,
            Math.floor((updated.population / 300) * 16)
        );

        const randomIndex =
            visibleCount > 0
                ? Math.floor(Math.random() * visibleCount)
                : null;

        setSelectedCitizen(randomIndex);
        setBubbleVisible(visibleCount > 0);

        // 🔥 FADE OUT
        setShowDecision(false);

        // 🔥 WAIT THEN LOAD NEXT SCENARIO
        setTimeout(() => {
            setCurrentScenario(getRandomScenario(updated));
            setShowDecision(true);
        }, 1500);
    }

    function closeReaction() {
        setCitizenReaction(null);
        setBubbleVisible(false);
        setSelectedCitizen(null);
    }

    return (
        <div>
            <h1>Island Balance Simulator</h1>

            <IslandScene
                ecosystem={state.ecosystem}
                population={state.population}
                frozen={loadingAI || !!citizenReaction}
                selectedCitizen={selectedCitizen}
                bubbleVisible={bubbleVisible}
            >
                <AnimatePresence mode="wait">
                    {showDecision && (
                        <DecisionModal
                            key={currentScenario.id}
                            eventText={`${currentScenario.title} ${currentScenario.description}`}
                            onYes={() => handleDecision("YES")}
                            onNo={() => handleDecision("NO")}
                        />
                    )}
                </AnimatePresence>
            </IslandScene>

            {showReaction && citizenReaction && (
                <div className="speechOverlay">
                    <div className="speechBox">
                        <p>{citizenReaction.citizen}</p>
                        <button onClick={closeReaction}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}