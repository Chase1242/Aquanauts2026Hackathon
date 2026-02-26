import React, { useState } from 'react';
import { stepSimulation } from './oceanTownApi';
import { param } from 'framer-motion/client';

interface SimulationInputProps {
    onBack?: () => void;
    onResult?: (result: any) => void;
}


export default function SimulationInput({ onBack, onResult }: SimulationInputProps) {
    // Model parameter defaults
    const defaults = {
        rf: 0.03,
        a1: 0.02,
        a2: 0.01,
        b1: 0.40,
        b2: 0.50,
        rp: 0.02,
        K0: 1.00,
        g1: 0.02,
        g2: 0.05,
        g3: 0.01,
        d1: 0.03,
        d2: 0.02,
        d3: 0.04
    };
    // Min/max for each parameter (delta = value - default)
    const ranges = {
        rf:   { min: 0.0 - defaults.rf,   max: 0.1 - defaults.rf },
        a1:   { min: 0.0 - defaults.a1,   max: 0.1 - defaults.a1 },
        a2:   { min: 0.0 - defaults.a2,   max: 0.1 - defaults.a2 },
        b1:   { min: 0.0 - defaults.b1,   max: 1.0 - defaults.b1 },
        b2:   { min: 0.0 - defaults.b2,   max: 2.0 - defaults.b2 },
        rp:   { min: -0.05 - defaults.rp, max: 0.1 - defaults.rp },
        K0:   { min: 0.1 - defaults.K0,   max: 2.0 - defaults.K0 },
        g1:   { min: 0.0 - defaults.g1,   max: 0.1 - defaults.g1 },
        g2:   { min: 0.0 - defaults.g2,   max: 0.2 - defaults.g2 },
        g3:   { min: 0.0 - defaults.g3,   max: 0.1 - defaults.g3 },
        d1:   { min: 0.0 - defaults.d1,   max: 0.1 - defaults.d1 },
        d2:   { min: 0.0 - defaults.d2,   max: 0.1 - defaults.d2 },
        d3:   { min: 0.0 - defaults.d3,   max: 0.2 - defaults.d3 },
    };
    // Delta state for each parameter
    const [rf, setRf] = useState(0);
    const [a1, setA1] = useState(0);
    const [a2, setA2] = useState(0);
    const [b1, setB1] = useState(0);
    const [b2, setB2] = useState(0);
    const [rp, setRp] = useState(0);
    const [K0, setK0] = useState(0);
    const [g1, setG1] = useState(0);
    const [g2, setG2] = useState(0);
    const [g3, setG3] = useState(0);
    const [d1, setD1] = useState(0);
    const [d2, setD2] = useState(0);
    const [d3, setD3] = useState(0);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [state, setState] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            // Compose the actual values as default + delta
            const paramValues = {
                rf: rf,
                a1: a1,
                a2: a2,
                b1: b1,
                b2: b2,
                rp: rp,
                K0: K0,
                g1: g1,
                g2: g2,
                g3: g3,
                d1: d1,
                d2: d2,
                d3: d3
            };
            console.log(paramValues);
            const stepRequest = {
                State: {
                    Year: !state ? 0 : state.Year,
                    globalVariables: {
                        ...paramValues
                    },
                },
                Snapshot: true,
            };
            //console.log(state);
            // Use projectId=2, userId=1 for demo
            const res = await stepSimulation(2, 1, stepRequest);
            console.log(res.nextState);

            setState(res.nextState);
            setResult(res);
            if (onResult) onResult(res);

            console.log(state);
        } catch (e: any) {
            setError(e.message || 'Error calling simulation endpoint');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-8">
            <div className="bg-white/10 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-cyan-400">Simulation Parameter Deltas</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Forest */}
                    <div>
                        <label className="block mb-1">rf Δ (Natural regrowth rate, default {defaults.rf})</label>
                        <input type="number" min={ranges.rf.min} max={ranges.rf.max} step={0.0001} value={rf} onChange={e => setRf(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 text-white" />
                    </div>
                    <div>
                        <label className="block mb-1">a1 Δ (Deforestation per population, default {defaults.a1})</label>
                        <input type="number" min={ranges.a1.min} max={ranges.a1.max} step={0.0001} value={a1} onChange={e => setA1(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 text-white" />
                    </div>
                    <div>
                        <label className="block mb-1">a2 Δ (Deforestation per oil, default {defaults.a2})</label>
                        <input type="number" min={ranges.a2.min} max={ranges.a2.max} step={0.0001} value={a2} onChange={e => setA2(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 text-white" />
                    </div>
                    {/* Oil */}
                    <div>
                        <label className="block mb-1">b1 Δ (Oil per capita, default {defaults.b1})</label>
                        <input type="number" min={ranges.b1.min} max={ranges.b1.max} step={0.0001} value={b1} onChange={e => setB1(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 text-white" />
                    </div>
                    <div>
                        <label className="block mb-1">b2 Δ (Industrial multiplier, default {defaults.b2})</label>
                        <input type="number" min={ranges.b2.min} max={ranges.b2.max} step={0.0001} value={b2} onChange={e => setB2(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 text-white" />
                    </div>
                    {/* Population */}
                    <div>
                        <label className="block mb-1">rp Δ (Population growth rate, default {defaults.rp})</label>
                        <input type="number" min={ranges.rp.min} max={ranges.rp.max} step={0.0001} value={rp} onChange={e => setRp(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 text-white" />
                    </div>
                    <div>
                        <label className="block mb-1">K0 Δ (Base carrying capacity, default {defaults.K0})</label>
                        <input type="number" min={ranges.K0.min} max={ranges.K0.max} step={0.0001} value={K0} onChange={e => setK0(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 text-white" />
                    </div>
                    {/* Ocean */}
                    <div>
                        <label className="block mb-1">g1 Δ (Forest benefit to ocean, default {defaults.g1})</label>
                        <input type="number" min={ranges.g1.min} max={ranges.g1.max} step={0.0001} value={g1} onChange={e => setG1(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 text-white" />
                    </div>
                    <div>
                        <label className="block mb-1">g2 Δ (Oil damage to ocean, default {defaults.g2})</label>
                        <input type="number" min={ranges.g2.min} max={ranges.g2.max} step={0.0001} value={g2} onChange={e => setG2(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 text-white" />
                    </div>
                    <div>
                        <label className="block mb-1">g3 Δ (Population damage to ocean, default {defaults.g3})</label>
                        <input type="number" min={ranges.g3.min} max={ranges.g3.max} step={0.0001} value={g3} onChange={e => setG3(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 text-white" />
                    </div>
                    {/* Air */}
                    <div>
                        <label className="block mb-1">d1 Δ (Forest benefit to air, default {defaults.d1})</label>
                        <input type="number" min={ranges.d1.min} max={ranges.d1.max} step={0.0001} value={d1} onChange={e => setD1(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 text-white" />
                    </div>
                    <div>
                        <label className="block mb-1">d2 Δ (Ocean benefit to air, default {defaults.d2})</label>
                        <input type="number" min={ranges.d2.min} max={ranges.d2.max} step={0.0001} value={d2} onChange={e => setD2(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 text-white" />
                    </div>
                    <div>
                        <label className="block mb-1">d3 Δ (Oil damage to air, default {defaults.d3})</label>
                        <input type="number" min={ranges.d3.min} max={ranges.d3.max} step={0.0001} value={d3} onChange={e => setD3(Number(e.target.value))} className="w-full p-2 rounded bg-slate-800 text-white" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2 bg-cyan-500 rounded font-bold mt-4">
                        {loading ? 'Submitting...' : 'Submit to Simulation'}
                    </button>
                </form>
                {error && <div className="text-red-400 mt-4">{error}</div>}
                {result && (
                    <div className="mt-6 bg-slate-800 p-4 rounded text-xs overflow-x-auto">
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                    </div>
                )}
                <button onClick={onBack} className="mt-6 text-cyan-300 underline">Back</button>
            </div>
        </div>
    );
}
