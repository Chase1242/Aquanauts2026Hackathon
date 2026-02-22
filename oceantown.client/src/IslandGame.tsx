import { useState } from 'react';
import IslandSceneRaw from "./components/IslandScene";
const IslandScene: any = IslandSceneRaw;
// @ts-ignore
import DecisionModalRaw from "./components/DecisionModal";
const DecisionModal: any = DecisionModalRaw;
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

function getRandomScenario(state: GameState) {
    if (state.ecosystem < 40) {
        const crisisEvents = scenarios.filter((s: any) =>
            s.id.includes("storm") ||
            s.id.includes("oil") ||
            s.id.includes("coral")
        );

        if (crisisEvents.length > 0) {
            return crisisEvents[Math.floor(Math.random() * crisisEvents.length)];
        }
    }

    return scenarios[Math.floor(Math.random() * scenarios.length)];
}

export default function IslandGame() {
    const [state, setState] = useState<GameState>({
        ecosystem: 80,
        population: 300,
        happiness: 70
    });

    const [currentScenario, setCurrentScenario] = useState<any>(
        scenarios[Math.floor(Math.random() * scenarios.length)]
    );

    const [loadingAI, setLoadingAI] = useState<boolean>(false);
    const [citizenReaction, setCitizenReaction] = useState<CitizenReaction | null>(null);
    const [selectedCitizen, setSelectedCitizen] = useState<number | null>(null);
    const [bubbleVisible, setBubbleVisible] = useState<boolean>(false);

    async function handleDecision(choice: string) {
        const updated = applyScenario(state, currentScenario, choice);

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

        const visibleCount = Math.floor((updated.population / 300) * 16);
        const randomIndex = Math.floor(Math.random() * visibleCount);

        setSelectedCitizen(randomIndex);
        setBubbleVisible(true);

        setCurrentScenario(getRandomScenario(updated));
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
            />

            <DecisionModal
                eventText={`${currentScenario.title} ${currentScenario.description}`}
                onYes={() => handleDecision("YES")}
                onNo={() => handleDecision("NO")}
            />

            {citizenReaction && (
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