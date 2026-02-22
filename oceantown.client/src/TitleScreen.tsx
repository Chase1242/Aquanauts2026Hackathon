import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Leaf, Users, Zap, Play, Settings, HelpCircle, FolderOpen } from 'lucide-react';
import MAIN_MENU_BG from './assets/MainMenuBG.jpg';

interface TitleScreenProps {
    onStartGame: () => void;
}

export default function TitleScreen({ onStartGame }: TitleScreenProps) {
    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-slate-900 font-sans selection:bg-cyan-500/30"
            style={{
                backgroundImage: `url('${MAIN_MENU_BG}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Cinematic Overlay: Vignette and Blur */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent z-0" />
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-0" />

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
                {[...Array(25)].map((_, i) => {
                    const isLeaf = Math.random() > 0.5;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, rotate: 0 }}
                            animate={{
                                x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                                y: [Math.random() * -200, Math.random() * 200],
                                opacity: [0, 0.9, 0],
                                rotate: isLeaf ? [0, 90, 180, 360] : 0,
                            }}
                            transition={{
                                duration: 8 + Math.random() * 5,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "linear"
                            }}
                            className="absolute"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                        >
                            {isLeaf ? (
                                <Leaf className="w-6 h-6 text-green-300 fill-green-400/30" />
                            ) : (
                                <div className="w-2.5 h-2.5 bg-cyan-100/60 rounded-full blur-[1px]" />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Main Layout Grid */}
            <div className="relative z-20 grid grid-cols-12 h-full w-full max-w-7xl mx-auto px-8 md:px-16">

                {/* Left Side: Menu Content */}
                <div className="col-span-12 md:col-span-5 flex flex-col justify-center py-12">

                    {/* Game Logo/Title */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-10"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <Waves className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                            <span className="text-cyan-400 font-bold tracking-[0.3em] text-sm uppercase">Civilization Sim</span>
                        </div>
                        <h1 className="text-8xl font-black text-white leading-tight drop-shadow-2xl italic italic-none">
                            OCEAN<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">TOWN</span>
                        </h1>
                    </motion.div>

                    {/* Navigation Actions */}
                    <div className="flex flex-col gap-4 w-full max-w-sm">
                        <MenuButton
                            icon={<Play className="w-5 h-5 fill-current" />}
                            label="Start Game"
                            primary
                            onClick={onStartGame}
                        />
                        {/* Renamed Achievements to Load Game */}
                        <MenuButton icon={<FolderOpen className="w-5 h-5" />} label="Load Game" />
                        <MenuButton icon={<Settings className="w-5 h-5" />} label="Settings" />
                        <MenuButton icon={<HelpCircle className="w-5 h-5" />} label="How to Play" />
                    </div>

                    {/* Version & Credits */}
                    <div className="mt-auto pt-12">
                        <p className="text-cyan-100/40 text-xs font-mono tracking-widest uppercase">
                            Build v1.0.0 // Aquanauts 2026
                        </p>
                    </div>
                </div>

                {/* Right Side: Feature Teasers with hover descriptions */}
                <div className="hidden md:flex col-span-7 items-center justify-end">
                    <div className="flex flex-col gap-6 w-full max-w-md">
                        <FeatureTag
                            icon={<Leaf />}
                            text="Flora Management"
                            description="Cultivate and maintain diverse underwater ecosystems to sustain marine life."
                            delay={0.7}
                        />
                        <FeatureTag
                            icon={<Users />}
                            text="Population Growth"
                            description="Oversee the expansion of your colony and manage citizen happiness and resource needs."
                            delay={0.9}
                        />
                        <FeatureTag
                            icon={<Zap />}
                            text="Neural AI Logic"
                            description="Advanced autonomous agents that respond dynamically to environmental and social changes."
                            delay={1.1}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Updated Feature Tag with Hover Description
function FeatureTag({ icon, text, description, delay }: { icon: React.ReactNode, text: string, description: string, delay: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            transition={{ delay }}
            className="group relative flex flex-col gap-3 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl w-full ml-auto cursor-help transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-900/80"
        >
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-cyan-500/20 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <span className="text-white font-bold text-lg tracking-wide">{text}</span>
            </div>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="text-cyan-100/80 text-sm leading-relaxed border-t border-white/10 pt-3">
                            {description}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function MenuButton({ icon, label, primary = false, onClick }: { icon: React.ReactNode, label: string, primary?: boolean, onClick?: () => void }) {
    return (
        <motion.button
            whileHover={{ x: 10 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all duration-300 group
                ${primary
                    ? 'bg-cyan-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-400'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-cyan-500/50'}
            `}
        >
            <span className={primary ? 'text-slate-900' : 'text-cyan-400 group-hover:scale-110 transition-transform'}>
                {icon}
            </span>
            <span className="uppercase tracking-widest text-sm">{label}</span>
        </motion.button>
    );
}