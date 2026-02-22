import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { Smile, Users, TreePine, Droplets, Calendar, Bot, CheckCircle2, XCircle } from 'lucide-react';
import ISLAND_IMAGE from './assets/ocean.jpg';


export default function App() {
    // Handles Dialog Appearing
    const [showAlert, setShowAlert] = useState(false);

    // Holds the audio data from Elevenlabs
    const [dialogueData, setDialogueData] = useState<DialogueData | null>(null);

    // Tracks when the dialogue box animation completes
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);

    // Plays the audio data from Elevenlabs after animation completes
    useEffect(() => {
        if (showAlert && isAnimationComplete && !dialogueData) {
            setDialogueData(mockData);
        }
    }, [showAlert, isAnimationComplete, dialogueData]);

    // Handles ignore button animation
    const handleDismiss = () => {
        setShowAlert(false);
        setDialogueData(null); // Clear the data so the next alert works
        setIsAnimationComplete(false); // Reset animation state
    };

    return (
        <div className="relative flex flex-col md:flex-row h-screen w-full overflow-hidden bg-background-light">
            {/* Simulation Map Area */}
            <main className="relative flex-1 h-full ocean-bg overflow-hidden group">

                {/* --- INSERTED OVERLAY START --- */}
                {!showAlert && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
                        <motion.button
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAlert(true)}
                            className="bg-primary text-white px-8 py-4 rounded-full font-bold shadow-2xl z-50 flex items-center gap-3 border border-white/20"
                        >
                            <Bot className="w-5 h-5" />
                            INITIALIZE AI CORE
                        </motion.button>
                    </div>
                )}
                {/* --- INSERTED OVERLAY END --- */}

                <div className="absolute inset-0 wave-lines opacity-30 pointer-events-none" />

                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    {/* Background Island Image */}
                    <motion.div
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.4 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 bg-cover bg-center mix-blend-overlay transition-transform duration-[20s] ease-in-out group-hover:scale-105"
                        style={{
                            backgroundImage: `url('${ISLAND_IMAGE}')`,
                            filter: 'contrast(1.2) brightness(1.2)'
                        }}
                    />

                    {/* Masked Island Image for Focus */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-in-out group-hover:scale-105"
                        style={{
                            backgroundImage: `url('${ISLAND_IMAGE}')`,
                            maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
                            WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)'
                        }}
                    />

                    {/* Season Indicator */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="absolute top-8 left-8 p-3 rounded-lg glass-panel flex flex-col gap-1 shadow-lg z-10"
                    >
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Day 1</span>
                        <div className="flex items-center gap-2 text-slate-800 font-semibold">
                            <Calendar className="w-4 h-4 text-primary" />
                            Monday
                        </div>
                    </motion.div>

                    {/* Map Marker */}
                    <div className="absolute top-[40%] left-[60%] group/marker cursor-pointer z-10">
                        <div className="w-4 h-4 rounded-full bg-white/40 border border-white animate-ping absolute inset-0" />
                        <div className="w-4 h-4 rounded-full bg-white relative shadow-[0_0_15px_rgba(255,255,255,0.8)] group-hover/marker:scale-125 transition-transform border-2 border-primary" />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap bg-white text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-lg shadow-lg">
                            I think this island is awesome!
                        </div>
                    </div>
                </div>
            </main>

            {/* Sidebar: Vital Signs */}
            <aside className="w-full md:w-80 flex-shrink-0 flex flex-col border-l border-slate-200 glass-panel z-20 h-full shadow-xl bg-white/90">
                <div className="p-6 border-b border-slate-100 pt-8 bg-white/50">
                    <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">Vital Signs</h3>
                    <p className="text-sm text-slate-500">Eco-System Stability Monitor</p>
                </div>

                {/* SCROLL WHEEL AREA */}
                <div className="relative flex-1 overflow-hidden group/scroll">
                    {/* The Scrollable Container */}
                    <div className="h-full overflow-y-auto p-6 space-y-8 scroll-smooth scrollbar-hide">

                        <StatItem
                            icon={<Smile className="w-4 h-4" />}
                            label="Happiness"
                            value="75%"
                            description="Citizens remain content, though recreational zones are limited."
                            progress={75}
                            color="bg-emerald-500"
                            textColor="text-emerald-600"
                        />

                        <StatItem
                            icon={<Users className="w-4 h-4" />}
                            label="Population"
                            value="420"
                            description="Steady growth. Housing capacity at 60%."
                            progress={45}
                            color="bg-primary"
                            textColor="text-primary"
                            delay={0.1}
                        />

                        <StatItem
                            icon={<TreePine className="w-4 h-4" />}
                            label="Flora Density"
                            value="1,200"
                            description="Healthy CO2 absorption levels. Watch for overgrowth."
                            progress={60}
                            color="bg-green-500"
                            textColor="text-green-600"
                            delay={0.2}
                        />

                        <StatItem
                            icon={<Droplets className="w-4 h-4" />}
                            label="Water Purity"
                            value="98%"
                            description="Desalination plants operating at peak efficiency."
                            progress={98}
                            color="bg-blue-400"
                            textColor="text-blue-500"
                            delay={0.3}
                        />

                        <StatItem
                            icon={<Bot className="w-4 h-4" />}
                            label="AI Core Load"
                            value="22%"
                            description="Neural processing cycles are within safe margins."
                            progress={22}
                            color="bg-purple-500"
                            textColor="text-purple-600"
                            delay={0.4}
                        />

                        <StatItem
                            icon={<TreePine className="w-4 h-4" />}
                            label="Oxygen Levels"
                            value="21%"
                            description="Atmospheric mix is optimal for organic life."
                            progress={85}
                            color="bg-cyan-400"
                            textColor="text-cyan-600"
                            delay={0.5}
                        />

                        <StatItem
                            icon={<Smile className="w-4 h-4" />}
                            label="Biodiversity"
                            value="High"
                            description="12 new species identified in Sector 7."
                            progress={90}
                            color="bg-orange-400"
                            textColor="text-orange-600"
                            delay={0.6}
                        />

                        {/* Spacer for bottom scroll padding */}
                        <div className="h-12" /> 
                    </div>
                </div>
            </aside>

            {/* Bottom Decision Panel */}
            <div className="absolute bottom-6 left-0 right-0 md:left-8 md:right-[340px] px-4 md:px-0 z-30 flex justify-center pointer-events-none">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{
                        y: showAlert ? 0 : 200,
                        opacity: showAlert ? 1 : 0
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120, delay: showAlert ? 0.8 : 0 }}
                    onAnimationComplete={() => {
                        if (showAlert) {
                            setIsAnimationComplete(true);
                        }
                    }}
                    className="w-full max-w-2xl glass-panel rounded-xl shadow-xl overflow-hidden border border-white pointer-events-auto bg-white/90"
                >
                    <div className="flex flex-col md:flex-row items-stretch">
                        {/* AI Core Branding */}
                        <div className="hidden md:flex flex-col items-center justify-center p-6 bg-slate-50 w-32 border-r border-slate-100">
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-[spin_4s_linear_infinite]" />
                                <div className="absolute inset-1 border border-primary/50 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
                                <Bot className="w-6 h-6 text-primary animate-pulse" />
                            </div>
                            <span className="mt-3 text-[10px] font-bold tracking-widest text-slate-500">AI CORE</span>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-5 flex flex-col gap-4">
                            <div>
                                <h4 className="text-slate-800 text-base font-bold mb-1">Decision Required: Sector 4 Overgrowth</h4>
                                {dialogueData ? (
                                    <DialogueTypewriter data={dialogueData} />
                                ) : (
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Loading transmission...
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-1">
                                {/* 4. Add onClick to both buttons */}
                                <button
                                    onClick={handleDismiss}
                                    className="flex-1 bg-primary hover:bg-primary-dark text-white h-11 rounded-lg font-bold text-sm tracking-wide transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 group border border-transparent"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    APPROVE GRAZING
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-600 h-11 rounded-lg font-bold text-sm tracking-wide transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                                >
                                    <XCircle className="w-4 h-4" />
                                    IGNORE ALERT
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
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

const ELEVEN_LABS_BASE64 = "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bK11p6rV10KI6hiXJVi2B89KyCJKQ2JS89TPnrTbhiwfHKQtFU8JwocCmJGqJV60iUOBUCRyyMWiStESgAixoNZEqEjVU8U+9vlPLZ5/bZbKfKsiddG4deUXEskbmmwEhUEuXwTQbI5CFnAj00tIScq8r0oqmWFBhMTe8nj/eRqefYrXOE4ayiVOJJwnm5sYrXVrKnDp1Rdg+ZREJY4Rkh8lFQVBYHRkYIzD2WlViyaB7tzVWOX8////////7LYZGrWAg6DiRQUMFChA4gcSwUMGDoZMrKFBORk1kpGrWUHHI1asGEhpQt//8VbxRUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5LE7IAfJgjuTLDXyjWx1xj0jjhVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"
const ELEVEN_LABS_DATA_URI = `data:audio/mpeg;base64,${ELEVEN_LABS_BASE64}`;

function DialogueTypewriter({ data }: { data: DialogueData }) {
    const [visibleChars, setVisibleChars] = useState<string>("");
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        // Create audio only once per data change
        const audio = new Audio(data.audioUrl);
        audioRef.current = audio;
        let isCancelled = false;

        const animate = () => {
            if (!audioRef.current || isCancelled) return;

            const currentTime = audioRef.current.currentTime;
            let currentString = "";
            const { characters, character_start_times_seconds } = data.alignment;

            for (let i = 0; i < character_start_times_seconds.length; i++) {
                if (currentTime >= character_start_times_seconds[i]) {
                    currentString += characters[i];
                } else { break; }
            }

            setVisibleChars(currentString);

            if (!audioRef.current.ended) {
                requestRef.current = requestAnimationFrame(animate);
            }
        };

        const playAudio = async () => {
            console.log("Attempting to play audio from:", data.audioUrl);

            // Create a timeout so the typewriter starts even if the audio fails to load
            const loadTimeout = setTimeout(() => {
                console.warn("Audio metadata load timed out. Starting typewriter anyway.");
                if (!isCancelled) {
                    requestRef.current = requestAnimationFrame(animate);
                }
            }, 1000); // Wait 1 second max for audio metadata

            try {
                await new Promise((resolve) => {
                    audio.onloadedmetadata = () => {
                        clearTimeout(loadTimeout);
                        resolve(true);
                    };
                    if (audio.readyState >= 1) {
                        clearTimeout(loadTimeout);
                        resolve(true);
                    }
                });

                if (!isCancelled) {
                    await audio.play();
                    console.log("Playback started successfully!");
                    requestRef.current = requestAnimationFrame(animate);
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error("Audio Playback Error:", error);
                    // Fallback: Start typewriter even on play error
                    requestRef.current = requestAnimationFrame(animate);
                }
            }
        };

        playAudio();

        return () => {
            isCancelled = true;
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            audio.pause();
            audio.src = "";
            audio.load();
        };
    }, [data.audioUrl, data.alignment]); // Bind to specific data properties

    return (
        <p className="text-slate-500 text-sm leading-relaxed font-medium">
            {visibleChars}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="inline-block w-2 h-4 bg-primary ml-1 translate-y-0.5"
            />
        </p>
    );
}

const mockData: DialogueData = {
    audioUrl: ELEVEN_LABS_DATA_URI,
    "alignment": {
        "characters": [
            "D",
            "e",
            "t",
            "e",
            "c",
            "t",
            "i",
            "n",
            "g",
            " ",
            "r",
            "a",
            "p",
            "i",
            "d",
            " ",
            "f",
            "l",
            "o",
            "r",
            "a",
            " ",
            "e",
            "x",
            "p",
            "a",
            "n",
            "s",
            "i",
            "o",
            "n",
            " ",
            "i",
            "n",
            " ",
            "S",
            "e",
            "c",
            "t",
            "o",
            "r",
            " ",
            "4",
            ".",
            " ",
            "M",
            "a",
            "n",
            "u",
            "a",
            "l",
            " ",
            "i",
            "n",
            "t",
            "e",
            "r",
            "v",
            "e",
            "n",
            "t",
            "i",
            "o",
            "n",
            " ",
            "r",
            "e",
            "q",
            "u",
            "i",
            "r",
            "e",
            "d",
            "."
        ],
        "character_start_times_seconds": [
            0,
            0.116,
            0.197,
            0.255,
            0.325,
            0.372,
            0.43,
            0.488,
            0.511,
            0.546,
            0.639,
            0.697,
            0.778,
            0.848,
            0.894,
            0.94,
            0.998,
            1.045,
            1.126,
            1.207,
            1.265,
            1.312,
            1.358,
            1.405,
            1.486,
            1.579,
            1.649,
            1.695,
            1.753,
            1.8,
            1.846,
            1.881,
            1.927,
            1.962,
            1.997,
            2.067,
            2.101,
            2.194,
            2.241,
            2.299,
            2.357,
            2.392,
            2.508,
            2.833,
            3.007,
            3.251,
            3.332,
            3.402,
            3.483,
            3.553,
            3.611,
            3.657,
            3.715,
            3.738,
            3.773,
            3.808,
            3.843,
            3.901,
            3.959,
            4.017,
            4.052,
            4.098,
            4.145,
            4.191,
            4.226,
            4.296,
            4.331,
            4.4,
            4.47,
            4.54,
            4.69,
            4.748,
            4.807,
            4.888
        ],
        "character_end_times_seconds": [
            0.116,
            0.197,
            0.255,
            0.325,
            0.372,
            0.43,
            0.488,
            0.511,
            0.546,
            0.639,
            0.697,
            0.778,
            0.848,
            0.894,
            0.94,
            0.998,
            1.045,
            1.126,
            1.207,
            1.265,
            1.312,
            1.358,
            1.405,
            1.486,
            1.579,
            1.649,
            1.695,
            1.753,
            1.8,
            1.846,
            1.881,
            1.927,
            1.962,
            1.997,
            2.067,
            2.101,
            2.194,
            2.241,
            2.299,
            2.357,
            2.392,
            2.508,
            2.833,
            3.007,
            3.251,
            3.332,
            3.402,
            3.483,
            3.553,
            3.611,
            3.657,
            3.715,
            3.738,
            3.773,
            3.808,
            3.843,
            3.901,
            3.959,
            4.017,
            4.052,
            4.098,
            4.145,
            4.191,
            4.226,
            4.296,
            4.331,
            4.4,
            4.47,
            4.54,
            4.69,
            4.748,
            4.807,
            4.888,
            5.201
        ]
    },
    "normalized_alignment": {
        "characters": [
            " ",
            "D",
            "e",
            "t",
            "e",
            "c",
            "t",
            "i",
            "n",
            "g",
            " ",
            "r",
            "a",
            "p",
            "i",
            "d",
            " ",
            "f",
            "l",
            "o",
            "r",
            "a",
            " ",
            "e",
            "x",
            "p",
            "a",
            "n",
            "s",
            "i",
            "o",
            "n",
            " ",
            "i",
            "n",
            " ",
            "S",
            "e",
            "c",
            "t",
            "o",
            "r",
            " ",
            "4",
            ".",
            " ",
            "M",
            "a",
            "n",
            "u",
            "a",
            "l",
            " ",
            "i",
            "n",
            "t",
            "e",
            "r",
            "v",
            "e",
            "n",
            "t",
            "i",
            "o",
            "n",
            " ",
            "r",
            "e",
            "q",
            "u",
            "i",
            "r",
            "e",
            "d",
            ".",
            " "
        ],
        "character_start_times_seconds": [
            0,
            0.046,
            0.116,
            0.197,
            0.255,
            0.325,
            0.372,
            0.43,
            0.488,
            0.511,
            0.546,
            0.639,
            0.697,
            0.778,
            0.848,
            0.894,
            0.94,
            0.998,
            1.045,
            1.126,
            1.207,
            1.265,
            1.312,
            1.358,
            1.405,
            1.486,
            1.579,
            1.649,
            1.695,
            1.753,
            1.8,
            1.846,
            1.881,
            1.927,
            1.962,
            1.997,
            2.067,
            2.101,
            2.194,
            2.241,
            2.299,
            2.357,
            2.392,
            2.508,
            2.833,
            3.007,
            3.251,
            3.332,
            3.402,
            3.483,
            3.553,
            3.611,
            3.657,
            3.715,
            3.738,
            3.773,
            3.808,
            3.843,
            3.901,
            3.959,
            4.017,
            4.052,
            4.098,
            4.145,
            4.191,
            4.226,
            4.296,
            4.331,
            4.4,
            4.47,
            4.54,
            4.69,
            4.748,
            4.807,
            4.888,
            4.957
        ],
        "character_end_times_seconds": [
            0.046,
            0.116,
            0.197,
            0.255,
            0.325,
            0.372,
            0.43,
            0.488,
            0.511,
            0.546,
            0.639,
            0.697,
            0.778,
            0.848,
            0.894,
            0.94,
            0.998,
            1.045,
            1.126,
            1.207,
            1.265,
            1.312,
            1.358,
            1.405,
            1.486,
            1.579,
            1.649,
            1.695,
            1.753,
            1.8,
            1.846,
            1.881,
            1.927,
            1.962,
            1.997,
            2.067,
            2.101,
            2.194,
            2.241,
            2.299,
            2.357,
            2.392,
            2.508,
            2.833,
            3.007,
            3.251,
            3.332,
            3.402,
            3.483,
            3.553,
            3.611,
            3.657,
            3.715,
            3.738,
            3.773,
            3.808,
            3.843,
            3.901,
            3.959,
            4.017,
            4.052,
            4.098,
            4.145,
            4.191,
            4.226,
            4.296,
            4.331,
            4.4,
            4.47,
            4.54,
            4.69,
            4.748,
            4.807,
            4.888,
            4.957,
            5.201
        ]
    }
}