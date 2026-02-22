import TitleScreen from "./TitleScreen";
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Users, TreePine, Droplets, Calendar, Bot, CheckCircle2, XCircle } from 'lucide-react';
import IslandGame from "./IslandGame";
import { scenarios } from './services/scenarioEngine';
import { applyScenario } from './services/gameEngine';
import { DIALOGUE_SESSIONS, DialogueData } from './audioData';

const MONTHS = ["JANUARY", "FEBRUARY", "MARCH"];
const SCENARIOS_PER_MONTH = 3;

export default function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [dialogueData, setDialogueData] = useState<DialogueData | null>(null);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);

    // Monthly Progression State
    const [monthIndex, setMonthIndex] = useState(0);
    const [scenarioCounter, setScenarioCounter] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);

    const [stats, setStats] = useState({
        happiness: 75,
        population: 420,
        ecosystem: 60
    });

    const [currentScenario, setCurrentScenario] = useState(scenarios[0]);

    const handleDialogueComplete = useCallback(() => {
        setShowButtons(true);
    }, []);

    // Trigger the first alert when the game starts
    useEffect(() => {
        if (gameStarted && !isTransitioning) {
            const timer = setTimeout(() => {
                setShowAlert(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [gameStarted, isTransitioning]);

    // Sync dialogue data
    useEffect(() => {
        const session = DIALOGUE_SESSIONS[currentScenario.id];
        setDialogueData(session || null);
    }, [currentScenario]);

    const handleChoice = (choice: 'YES' | 'NO') => {
        const nextState = applyScenario(stats, currentScenario, choice);
        setStats(nextState);

        const nextCount = scenarioCounter + 1;
        setShowAlert(false);
        setIsAnimationComplete(false);
        setShowButtons(false);

        if (nextCount >= SCENARIOS_PER_MONTH) {
            handleMonthEnd();
        } else {
            setScenarioCounter(nextCount);
            const currentIndex = scenarios.findIndex(s => s.id === currentScenario.id);
            setTimeout(() => {
                setCurrentScenario(scenarios[currentIndex + 1] || scenarios[0]);
                setShowAlert(true);
            }, 800);
        }
    };

    const handleMonthEnd = () => {
        setTimeout(() => {
            if (monthIndex < MONTHS.length - 1) {
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
                }, 500);
            } else {
                setGameEnded(true);
            }
        }, 800);
    };

    return (
        <div className="w-full h-screen bg-slate-900 overflow-hidden selection:bg-cyan-500/30">
            <AnimatePresence mode="wait">
                {!gameStarted && (
                    <motion.div key="title" exit={{ opacity: 0, filter: "blur(20px)" }} className="w-full h-full">
                        <TitleScreen onStartGame={() => setGameStarted(true)} />
                    </motion.div>
                )}

                {isTransitioning && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
                            <Calendar className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                            <h2 className="text-5xl font-black text-white tracking-[0.2em]">{MONTHS[monthIndex]}</h2>
                            <p className="text-cyan-400 mt-2 font-mono">PREPARING NEXT CYCLE...</p>
                        </motion.div>
                    </motion.div>
                )}

                {gameStarted && !gameEnded && (
                    <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative flex flex-col md:flex-row h-screen w-full bg-white overflow-hidden">
                        <main className="relative flex-1 h-full overflow-hidden">
                            <IslandGame />
                            <div className="absolute top-6 left-6 bg-white/90 px-4 py-2 rounded-lg border border-slate-200 shadow-sm z-10">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Month</span>
                                <p className="text-lg font-black text-primary">{MONTHS[monthIndex]}</p>
                            </div>
                        </main>

                        {/* MERGED SIDEBAR FROM GROUPMATE */}
                        <aside className="w-full md:w-80 flex-shrink-0 flex flex-col border-l border-slate-200 glass-panel z-20 h-full shadow-xl bg-white/90">
                            <div className="p-6 border-b border-slate-100 pt-8 bg-white/50">
                                <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">Vital Signs</h3>
                                <p className="text-sm text-slate-500">Eco-System Stability Monitor</p>
                            </div>

                            <div className="relative flex-1 overflow-hidden group/scroll">
                                <div className="h-full overflow-y-auto p-6 space-y-8 scroll-smooth scrollbar-hide">
                                    <StatItem
                                        icon={<Smile className="w-4 h-4" />}
                                        label="Happiness"
                                        value={`${stats.happiness}%`}
                                        description="Citizens remain content, though recreational zones are limited."
                                        progress={stats.happiness}
                                        color="bg-emerald-500"
                                        textColor="text-emerald-600"
                                    />
                                    <StatItem
                                        icon={<Users className="w-4 h-4" />}
                                        label="Population"
                                        value={stats.population.toString()}
                                        description="Steady growth. Housing capacity at 60%."
                                        progress={Math.min((stats.population / 1000) * 100, 100)}
                                        color="bg-primary"
                                        textColor="text-primary"
                                        delay={0.1}
                                    />
                                    <StatItem
                                        icon={<TreePine className="w-4 h-4" />}
                                        label="Ecosystem"
                                        value={`${stats.ecosystem}%`}
                                        description="Healthy CO2 absorption levels across all sectors."
                                        progress={stats.ecosystem}
                                        color="bg-green-500"
                                        textColor="text-green-600"
                                        delay={0.2}
                                    />
                                    <StatItem
                                        icon={<Droplets className="w-4 h-4" />}
                                        label="Water Purity"
                                        value={`${stats.ecosystem}%`}
                                        description="Desalination plants operating at peak efficiency."
                                        progress={stats.ecosystem}
                                        color="bg-blue-400"
                                        textColor="text-blue-500"
                                        delay={0.3}
                                    />
                                    <div className="h-12" />
                                </div>
                            </div>
                        </aside>

                        {/* Bottom Decision Panel */}
                        <div className="absolute bottom-6 left-0 right-0 md:left-8 md:right-[340px] px-4 md:px-0 z-30 flex justify-center pointer-events-none">
                            <motion.div
                                animate={{ y: showAlert ? 0 : 250, opacity: showAlert ? 1 : 0 }}
                                onAnimationComplete={() => { if (showAlert) setIsAnimationComplete(true); }}
                                className="w-full max-w-2xl glass-panel rounded-xl shadow-xl border border-white pointer-events-auto bg-white/95"
                            >
                                <div className="flex flex-col md:flex-row">
                                    <div className="hidden md:flex flex-col items-center justify-center p-6 bg-slate-50 w-32 border-r border-slate-100">
                                        <Bot className={`w-6 h-6 text-primary ${isAnimationComplete ? 'animate-pulse' : ''}`} />
                                    </div>
                                    <div className="flex-1 p-5 flex flex-col gap-4">
                                        <div>
                                            <h4 className="text-slate-800 text-base font-bold mb-1">{currentScenario.title}</h4>
                                            {dialogueData ? (
                                                <DialogueTypewriter
                                                    key={currentScenario.id}
                                                    data={dialogueData}
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

                {/* Game Over Screen */}
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

// ActionButton Helper
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

// MERGED STATITEM FROM GROUPMATE
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

function StatItem({ icon, label, value, description, progress, color, textColor, delay = 0 }: StatItemProps) {
    return (
        <div className="flex flex-col gap-2 group">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-slate-600">
                    <span className={`${textColor} flex items-center`}>{icon}</span>
                    <span className="text-sm font-semibold">{label}</span>
                </div>
                <span className={`${textColor} font-mono font-bold bg-primary/10 px-1.5 py-0.5 rounded text-sm`}>
                    {value}
                </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay, ease: 'easeOut' }}
                    className={`h-full ${color} rounded-full shadow-[0_0_10px_rgba(0,191,165,0.3)]`}
                />
            </div>
            {description && (
                <p className="text-xs text-slate-400 group-hover:text-primary transition-colors">
                    {description}
                </p>
            )}
        </div>
    );
}

interface DialogueData {
    audioUrl: string;
    alignment: {
        characters: string[];
        character_start_times_seconds: number[];
        character_end_times_seconds: number[];
    };
    normalized_alignment?: {
        characters: string[];
        character_start_times_seconds: number[];
        character_end_times_seconds: number[];
    };
}

function DialogueTypewriter({ data, startPlaying, onComplete }: { data: DialogueData, startPlaying: boolean, onComplete: () => void }) {
    const [visibleChars, setVisibleChars] = useState("");
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hasStarted = useRef(false); // <--- Add this ref

    useEffect(() => {
        // Only start if startPlaying is true AND we haven't started yet for this 'data'
        if (!startPlaying || hasStarted.current) return;

        const audio = new Audio(data.audioUrl);
        audioRef.current = audio;
        hasStarted.current = true; // Mark as started

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