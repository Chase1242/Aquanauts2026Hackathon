import TitleScreen from "./TitleScreen";
import { getSimulationForUser, stepSimulation } from './oceanTownApi';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Users, TreePine, Droplets, Calendar, Bot, CheckCircle2, XCircle } from 'lucide-react';
import ISLAND_IMAGE from './assets/ocean.jpg';
import IslandGame from "./IslandGame";
import { scenarios } from './services/scenarioEngine';
import { applyScenario } from './services/gameEngine';
import { DIALOGUE_SESSIONS, DialogueData } from './audioData';

import VILLAGER_1 from './assets/villager1.png';
import VILLAGER_2 from './assets/villager2.png';
import VILLAGER_3 from './assets/villager3.png';
import SimulationInput from "./SimulationInput";

const MONTHS = ["JANUARY", "FEBRUARY", "MARCH"];
const SCENARIOS_PER_MONTH = 3;
export default function App() {
    // Handles Dialog Appearing
    const [showButtons, setShowButtons] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [dialogue, setDialogueData] = useState<DialogueData | null>(null);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);
    const [isTestingApi, setIsTestingApi] = useState(false);

    // Monthly Progression State
    const [monthIndex, setMonthIndex] = useState(0);
    const [scenarioCounter, setScenarioCounter] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);

    const [simState, setSimState] = useState<any>(null);

    const [gameStarted, setGameStarted] = useState(false);
    const [gameState, setGameState] = useState({
        ecosystem: 80,
        population: 300,
        happiness: 70
    });


    // Track initial stats for change calculation
    const [initialStats, setInitialStats] = useState<{ ecosystem: number, population: number, happiness: number } | null>(null);

    // StatItem mapping logic
    // Use simState.State.GlobalVariables for StatItems
    const globals = simState && simState.state && simState.state.globalVariables ? simState.state.globalVariables : {};

    // Debug output to verify structure
    // Friendly names for global variables
    const friendlyNames: { [key: string]: string } = {
        H: "Happiness",
        P: "Population",
        AirQ: "Air Quality",
        OceanQ: "Ocean Quality",
        TotForest: "% forest remaining",
        OilTot: "Oil Production"
    };

    //console.log(friendlyNames);
    // Icons for global variables
    const statIcons: { [key: string]: React.ReactNode } = {
        H: <Smile className="w-4 h-4" />,
        P: <Calendar className="w-4 h-4" />,
        AirQ: <Bot className="w-4 h-4" />,
        OceanQ: <Smile className="w-4 h-4" />,
        TotForest: <CheckCircle2 className="w-4 h-4" />,
        OilTot: <XCircle className="w-4 h-4" />
    };
    // Colors for progress bars
    const statColors: { [key: string]: string } = {
        H: "bg-green-400",
        P: "bg-blue-400",
        AirQ: "bg-yellow-400",
        OceanQ: "bg-cyan-400",
        TotForest: "bg-green-700",
        OilTot: "bg-orange-400"
    };
    // Text colors
    const statTextColors: { [key: string]: string } = {
        H: "text-green-600",
        P: "text-blue-600",
        AirQ: "text-yellow-600",
        OceanQ: "text-cyan-600",
        TotForest: "text-green-700",
        OilTot: "text-orange-600"
    };
    // Progress calculation
    const statProgress: { [key: string]: (value: any) => number } = {
        H: v => Math.max(0, Math.min(100, Number(v) * 100)),
        P: v => Math.max(0, Math.min(100, Number(v) / 10)),
        AirQ: v => Math.max(0, Math.min(100, Number(v) * 100)),
        OceanQ: v => Math.max(0, Math.min(100, Number(v) * 100)),
        TotForest: v => Math.max(0, Math.min(100, Number(v))),
        OilTot: v => Math.max(0, Math.min(100, Number(v)))
    };

    const CHARACTER_MAP: Record<string, string> = {
        'amazon_warehouse': VILLAGER_2,
        'coal_plant': VILLAGER_1,
        'solar_farm': VILLAGER_3,
        'fishing_expansion': VILLAGER_2,
        'wildlife_reserve': VILLAGER_2,
        'luxury_resort': VILLAGER_3,
        'plastic_factory': VILLAGER_1,
        'reforestation': VILLAGER_1,
        'oil_drilling': VILLAGER_2
    };

    const [currentScenario, setCurrentScenario] = useState(scenarios[0]);

    const handleDialogueComplete = useCallback(() => {
        setShowButtons(true);
    }, []);

    const FUN_FACTS = [
        "Air quality is similar without traffic, but during rush hour, tree-filled areas have much lower PM2.5 levels. Urban trees act like natural air filters when pollution spikes.",
        "Trees absorb and store carbon dioxide in their trunks and roots. Without forests, more CO? stays in the air, worsening climate change.",
        "Tree leaves capture harmful pollutants like SO?, NOx, and particulate matter. Forests work like giant, living air purifiers.",
        "When forests are cleared, soil washes into rivers and clouds ocean water. This blocks sunlight that corals and marine plants need to survive.",
        "Wetlands store massive amounts of carbon dioxide. Losing just one acre can release up to 1,000 tons of CO? back into the atmosphere."
    ];

    // Handles fun facts
    const [currentFact, setCurrentFact] = useState("");
    const getRandomFact = () => {
        const randomIndex = Math.floor(Math.random() * FUN_FACTS.length);
        setCurrentFact(FUN_FACTS[randomIndex]);
    };

    // 1. Trigger the first alert when the game starts
    useEffect(() => {
        if (gameStarted) {
            getRandomFact();
            setIsTransitioning(true);

            const transitionTimer = setTimeout(() => {
                setIsTransitioning(false);

                setTimeout(() => {
                    setShowAlert(true);
                }, 500);
            }, 4000);

            return () => clearTimeout(transitionTimer);
        }
    }, [gameStarted]);

    // Sync dialogue data
    useEffect(() => {
        const session = DIALOGUE_SESSIONS[currentScenario.id];
        setDialogueData(session || null);
    }, [currentScenario]);

    const handleChoice = async (choice: 'YES' | 'NO') => {
        const nextState = applyScenario(stats, currentScenario, choice);
        setStats(nextState);

        const nextCount = scenarioCounter + 1;
        setShowAlert(false);
        setIsAnimationComplete(false);
        setShowButtons(false);

        // Check if month ended (3 scenarios)
        if (nextCount >= SCENARIOS_PER_MONTH) {
            handleMonthEnd();
        } else {
            // Next scenario in same month
            setScenarioCounter(nextCount);
            const currentIndex = scenarios.findIndex(s => s.id === currentScenario.id);
            setTimeout(() => {
                setCurrentScenario(scenarios[currentIndex + 1] || scenarios[0]);
                setShowAlert(true);
            }, 800);
        }

        // Calculate which citizen "speaks"
        const visibleCount = Math.max(0, Math.floor(((simState.state.globalVariables?.P || 0) / 300) * 16));
        const randomIndex = visibleCount > 0 ? Math.floor(Math.random() * visibleCount) : null;

        // Set the next scenario
        const all = scenarios;
        setCurrentScenario(all[Math.floor(Math.random() * all.length)]);
    };

    const handleMonthEnd = () => {
        setTimeout(async () => {
            if (monthIndex < MONTHS.length - 1) {

                if (!simState || !currentScenario) return;

                // Calculate normalized ecosystem (0-1)
                const normalizedEcosystem = stats.ecosystem / 100;
                // Calculate d (deforestation rate), A (forest coverage), OilCell
                const d = 1 - normalizedEcosystem;
                const A = normalizedEcosystem;
                const OilCell = d * (1 - A); // Example formula, adjust as needed

                // Divide each value by 100 for cell posting
                const cellA = A / 100;
                const cellD = d / 100;
                const cellOil = OilCell / 100;
                const Cells = Array.from({ length: 100 }, () => ({ A: cellA, d: cellD, OilCell: cellOil }));


                // Build step request with Year, Cells, and previous globalVariables
                const stepRequest = {
                    State: {
                        Year: monthIndex,
                        Cells,
                        globalVariables: simState.state.globalVariables
                    }
                };

                const stepResult = await stepSimulation(2, 1, stepRequest);
                setSimState(stepResult);

                // Update parent state with converted values
                if (stepResult?.state?.globalVariables) {
                    setStats({
                        ecosystem: treesToEcosystem(stepResult.state.globalVariables?.TotForest || 300),
                        population: stepResult.state.globalVariables?.P || 0,
                        happiness: stepResult.state.globalVariables?.H || 0
                    });
                }

                getRandomFact(); // Pick a new fact for the month change
                setIsTransitioning(true);

                setTimeout(() => {
                    setMonthIndex(prev => prev + 1);
                    setScenarioCounter(0);
                    const currentIndex = scenarios.findIndex(s => s.id === currentScenario.id);
                    setCurrentScenario(scenarios[currentIndex + 1]);

                    setTimeout(() => {
                        setIsTransitioning(false);
                        setTimeout(() => setShowAlert(true), 500);
                    }, 2000);
                }, 6500);
            } else {
                setGameEnded(true);
            }
        }, 800);
    };


    // Handler to start game and fetch simulation project
    const handleStartGame = async () => {
        const sim = await getSimulationForUser(2, "chase.conaway"); // Replace 2 with your projectId if needed
        setSimState(sim);
        setGameStarted(true);
        const startStats = {
            happiness: sim?.state?.globalVariables.H || 70,
            population: sim?.state?.globalVariables?.P || 420,
            ecosystem: sim?.state?.globalVariables?.E || 60
        };
        setStats(startStats);
        setInitialStats(startStats);
    };

    const handleTestApi = () => { setIsTestingApi(true); console.log(isTestingApi); }; 

    const [stats, setStats] = useState({
        happiness: 70,
        population:420,
        ecosystem: 60
    });

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

    // Calculate total signed change and normalize to 0-1 (then percent)
    let totalChangePercent: number | null = null;
    if (initialStats) {
        const ecoChange = stats.ecosystem - initialStats.ecosystem;
        const popChange = stats.population - initialStats.population;
        const happyChange = stats.happiness - initialStats.happiness;
        const sum = ecoChange + popChange + happyChange;
        // Assume each can change -100 to +100 (adjust if your ranges differ)
        // So total range is -300 to +300
        totalChangePercent = ((sum + 300) / 600) * 100;
    }

    return (
        <div className="w-full h-screen bg-slate-900 overflow-hidden selection:bg-cyan-500/30">
            <AnimatePresence mode="wait">

                {/*API Test stuff*/}
                {!gameStarted && isTestingApi && (
                    <SimulationInput onBack={() => setIsTestingApi(false)} />
                )}

                {/* 1. Title Screen */}
                {!gameStarted && (
                    <motion.div key="title" exit={{ opacity: 0, filter: "blur(20px)" }} className="w-full h-full">
                        <TitleScreen onStartGame={handleStartGame} onTestApi={handleTestApi} />
                    </motion.div>
                )}

                {/* 2. Month Transition Overlay */}
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-8"
                    >
                        <div className="max-w-2xl w-full text-center">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mb-12"
                            >
                                <div className="h-16 flex items-center justify-center overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        <motion.h2
                                            key={monthIndex}
                                            initial={{ y: 40, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -40, opacity: 0 }}
                                            className="text-5xl font-black text-white tracking-widest absolute"
                                        >
                                            {MONTHS[monthIndex]}
                                        </motion.h2>
                                    </AnimatePresence>
                                </div>
                            </motion.div>

                            {/* Fact Box */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-cyan-500/5 border border-cyan-500/20 p-8 rounded-3xl backdrop-blur-md relative overflow-hidden"
                            >
                                {/* Decorative background pulse */}
                                <motion.div
                                    animate={{ opacity: [0.05, 0.15, 0.05] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                    className="absolute inset-0 bg-cyan-400/10 pointer-events-none"
                                />

                                <h4 className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-4">
                                    Ecosystem Insight
                                </h4>
                                <p className="text-slate-200 text-xl leading-relaxed font-medium">
                                    {currentFact}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 6, ease: "linear" }}
                                className="h-1 bg-cyan-500/30 mt-8 rounded-full overflow-hidden"
                            >
                                <div className="h-full bg-cyan-400 w-full animate-pulse" />
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* 3. Main Game Loop */}
                {gameStarted && !gameEnded && (
                    <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative flex flex-col md:flex-row h-screen w-full bg-slate-900"> {/* Changed bg to slate-900 to match water better */}
                        <main className="relative flex-1 h-screen overflow-hidden"> {/* Ensure h-screen here */}
                            <IslandGame
                                state={stats}
                                setState={setStats}
                            />
                            {/* Simple Month Indicator */}
                            <div className="absolute top-6 left-6 bg-white/90 px-4 py-2 rounded-lg border border-slate-200 shadow-sm z-10">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Month</span>
                                <p className="text-lg font-black text-primary">{MONTHS[monthIndex]}</p>
                            </div>
                        </main>

                        <aside className="w-full md:w-80 border-l border-slate-200 glass-panel z-20 h-full bg-white/90 flex flex-col">
                            <div className="p-6 border-b border-slate-100 pt-8">
                                <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Vital Signs</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                                {Object.keys(globals).length > 0 ? (
                                    Object.entries(globals)
                                        .filter(([key]) => key !== 'rP' && key !== 'AvgForest')
                                        .map(([key, value], idx) => (
                                            <StatItem
                                                key={key}
                                                icon={statIcons[key] || <Smile className="w-4 h-4" />}
                                                label={friendlyNames[key] || key}
                                                value={typeof value === 'number' ? value.toLocaleString() : String(value)}
                                                description={undefined}
                                                progress={statProgress[key] ? statProgress[key](value) : 100}
                                                color={statColors[key] || 'bg-gray-400'}
                                                textColor={statTextColors[key] || 'text-gray-600'}
                                                delay={idx * 0.1}
                                            />
                                        ))
                                ) : (
                                    <div className="text-slate-500 text-sm">No global stats found. Check API response structure.</div>
                                )}
                            </div>
                        </aside>

                        {/* Bottom Decision Panel */}
                        <div className="absolute bottom-6 left-0 right-0 md:left-8 md:right-[340px] px-4 md:px-0 z-30 flex justify-center pointer-events-none">
                            <motion.div
                                animate={{ y: showAlert ? 0 : 250, opacity: showAlert ? 1 : 0 }}
                                onAnimationComplete={() => { if (showAlert) setIsAnimationComplete(true); }}
                                className="w-full max-w-2xl glass-panel rounded-xl shadow-xl border border-white pointer-events-auto bg-white/95 overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row">
                                    <div className="hidden md:flex flex-col items-center justify-center bg-slate-100 w-32 border-r border-slate-200 overflow-hidden relative">
                                        <AnimatePresence mode="wait">
                                            <motion.img
                                                key={currentScenario.id}
                                                initial={{ opacity: 0, scale: 1.1 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                src={CHARACTER_MAP[currentScenario.id] || VILLAGER_1} // Fallback to villager 1
                                                alt="Villager"
                                                className={`w-full h-full object-cover ${isAnimationComplete ? 'brightness-100' : 'brightness-75'}`}
                                            />
                                        </AnimatePresence>
                                        {/* Optional: Small pulse indicator to show they are "talking" */}
                                        {!showButtons && isAnimationComplete && (
                                            <div className="absolute bottom-2 right-2 w-3 h-3 bg-primary rounded-full animate-ping" />
                                        )}
                                    </div>

                                    <div className="flex-1 p-5 flex flex-col gap-4">
                                        <div>
                                            <h4 className="text-slate-800 text-base font-bold mb-1">{currentScenario.title}</h4>
                                            {dialogue? (
                                                <DialogueTypewriter
                                                    key={currentScenario.id}
                                                    data={dialogue}
                                                    startPlaying={isAnimationComplete}
                                                    onComplete={handleDialogueComplete}
                                                />
                                            ) : (
                                                <p className="text-slate-500 text-sm italic">Initializing link...</p>
                                            )}
                                        </div>
                                        <div className="flex gap-3 mt-auto h-12">
                                            <AnimatePresence>
                                                {showButtons && (
                                                    <>
                                                        <ActionButton onClick={() => handleChoice('YES')} label="APPROVE" icon={<CheckCircle2 />} isPrimary />
                                                        <ActionButton onClick={() => handleChoice('NO')} label="IGNORE" icon={<XCircle />} />
                                                    </>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* 4. Game Over Screen */}
                {gameEnded && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-slate-900 flex items-center justify-center p-6">
                        <div className="max-w-md w-full text-center space-y-8">
                            <h2 className="text-4xl font-black text-white italic">SIMULATION COMPLETE</h2>
                            <div className="bg-white/10 p-8 rounded-2xl border border-white/10 space-y-4">
                                <div className="flex justify-between text-white"><span className="opacity-60">Happiness:</span><span className="font-bold text-emerald-400">{stats.happiness}%</span></div>
                                <div className="flex justify-between text-white"><span className="opacity-60">Population:</span><span className="font-bold text-primary">{stats.population}</span></div>
                                <div className="flex justify-between text-white"><span className="opacity-60">Ecosystem:</span><span className="font-bold text-green-400">{stats.ecosystem}%</span></div>
                                <hr className="border-white/10" />
                                <div className="text-2xl font-bold text-cyan-400">Final Score: {Math.floor((stats.happiness + stats.ecosystem) * (stats.population / 100))}</div>
                            </div>
                            <button onClick={() => window.location.reload()} className="w-full py-4 bg-primary text-white font-bold rounded-xl">RESTART MISSION</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
interface StatItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    description?: string;
    progress: number;
    color: string;
    textColor: string;
    delay?: number;
}
function ActionButton({ onClick, label, icon, isPrimary }: any) {
    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`flex-1 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${isPrimary ? "bg-primary text-white shadow-[0_4px_0_rgb(5,150,105)]" : "bg-white border-2 border-slate-200 text-slate-600 shadow-[0_4px_0_rgb(226,232,240)]"
                }`}
        >
            {icon} {label}
        </motion.button>
    );
}
function StatItem({ icon, label, value, progress, color, textColor }: any) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm font-bold">
                <span className={`flex items-center gap-2 ${textColor}`}>{icon} {label}</span>
                <span className="font-mono">{value}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full ${color}`} />
            </div>
        </div>
    );
}

function DialogueTypewriter({ data, startPlaying, onComplete }: { data: DialogueData, startPlaying: boolean, onComplete: () => void }) {
    const [visibleChars, setVisibleChars] = useState<string>("");
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hasStarted = useRef(false);

    useEffect(() => {
        // Only start if startPlaying is true AND we haven't started yet for this 'data'
        if (!startPlaying || hasStarted.current) return;

        const audio = new Audio(data.audioUrl);
        audioRef.current = audio;
        hasStarted.current = true;

        audio.onended = () => {
            setTimeout(onComplete, 500);
        };

        const updateText = () => {
            const currentTime = audio.currentTime;
            const { characters, character_start_times_seconds } = data.alignment;
            let currentText = "";
            for (let i = 0; i < character_start_times_seconds.length; i++) {
                if (character_start_times_seconds[i] <= currentTime) {
                    currentText += characters[i];
                } else { break; }
            }
            setVisibleChars(currentText);
            if (!audio.paused && !audio.ended) requestAnimationFrame(updateText);
        };

        audio.play().catch(e => console.error(e));
        const animId = requestAnimationFrame(updateText);

        return () => {
            audio.pause();
            cancelAnimationFrame(animId);
            // We don't reset hasStarted here because the 'key' on the 
            // component will handle the reset when the scenario changes.
        };
    }, [data, startPlaying, onComplete]);

    return (
        <p className="text-slate-600 text-sm leading-relaxed font-medium">
            {visibleChars}
            {/* Show cursor only while playing */}
            {(!audioRef.current?.ended && hasStarted.current) && (
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-1.5 h-4 ml-1 bg-primary align-middle"
                />
            )}
        </p>
    );
}
