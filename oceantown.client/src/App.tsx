import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Smile, Users, TreePine, Droplets, Calendar, Bot, CheckCircle2, XCircle } from 'lucide-react';
import ISLAND_IMAGE from './assets/ocean.jpg';


export default function App() {
    const [showAlert, setShowAlert] = useState(true);

    const handleDismiss = () => {
        setShowAlert(false);
    };

    return (
        <div className="relative flex flex-col md:flex-row h-screen w-full overflow-hidden bg-background-light">
            {/* Simulation Map Area */}
            <main className="relative flex-1 h-full ocean-bg overflow-hidden group">
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
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Detecting rapid flora expansion...
                                </p>
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
