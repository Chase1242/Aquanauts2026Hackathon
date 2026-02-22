import React, { useEffect, useState } from "react";

const MAX_PEOPLE = 16;
const ELLIPSE_X = 0.33;
const ELLIPSE_Y = 0.26;
const CENTER = 50;

function isInsideIsland(x, y) {
    const dx = (x - CENTER) / (100 * ELLIPSE_X);
    const dy = (y - CENTER) / (100 * ELLIPSE_Y);
    return dx * dx + dy * dy <= 1;
}

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function People({
    population,
    onAllGone,

    // NEW:
    frozen = false,
    selectedCitizen = null,
    bubbleVisible = false,
    onBubbleClick
}) {
    const [hopPhase, setHopPhase] = useState(0);

    const visibleCount = clamp(
        Math.floor((population / 300) * MAX_PEOPLE),
        0,
        MAX_PEOPLE
    );

    const [people, setPeople] = useState(() =>
        Array.from({ length: MAX_PEOPLE }).map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.sqrt(Math.random());

            const x = CENTER + radius * Math.cos(angle) * 100 * ELLIPSE_X;
            const y = CENTER + radius * Math.sin(angle) * 100 * ELLIPSE_Y;

            return {
                id: i,
                x,
                y,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                sprite: i % 2 === 0 ? "/person_left.png" : "/person_right.png",
                exiting: false,
                fade: 1
            };
        })
    );

    useEffect(() => {
        let animationFrame;

        function update() {
            setHopPhase(prev => prev + 0.08);

            setPeople(prev =>
                prev.map(p => {
                    if (p.exiting) {
                        const newFade = Math.max(p.fade - 0.02, 0);
                        return { ...p, y: p.y - 0.3, fade: newFade };
                    }

                    if (frozen) return p;

                    let vx = p.vx + (Math.random() - 0.5) * 0.01;
                    let vy = p.vy + (Math.random() - 0.5) * 0.01;

                    const speedLimit = 0.18;
                    const speed = Math.sqrt(vx * vx + vy * vy);

                    if (speed > speedLimit) {
                        vx = (vx / speed) * speedLimit;
                        vy = (vy / speed) * speedLimit;
                    }

                    let nx = p.x + vx;
                    let ny = p.y + vy;

                    if (!isInsideIsland(nx, ny)) {
                        vx *= -0.8;
                        vy *= -0.8;
                        nx = p.x + vx;
                        ny = p.y + vy;
                    }

                    return { ...p, x: nx, y: ny, vx, vy };
                })
            );

            animationFrame = requestAnimationFrame(update);
        }

        animationFrame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrame);
    }, [frozen]);

    useEffect(() => {
        setPeople(prev =>
            prev.map((p, index) => {
                // should be visible
                if (index < visibleCount) {
                    if (p.exiting || p.fade < 1) {
                        return { ...p, exiting: false, fade: 1 };
                    }
                    return p;
                }

                // should be gone
                if (!p.exiting) return { ...p, exiting: true };
                return p;
            })
        );
    }, [visibleCount]);

    useEffect(() => {
        const everyoneGone =
            visibleCount === 0 && people.every(p => p.exiting && p.fade <= 0);

        if (everyoneGone && onAllGone) onAllGone();
    }, [people, visibleCount, onAllGone]);

    return (
        <>
            {people.map((p, index) => {
                const isVisible = index < visibleCount;
                const hop = Math.sin(hopPhase + index) * 3;

                if (!isVisible && !p.exiting) return null;
                if (p.exiting && p.fade <= 0) return null;

                const showBubble = false; //  disable bubble entirely
                return (
                    <div
                        key={p.id}
                        style={{
                            position: "absolute",
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            transform: "translate(-50%, -50%)",
                            zIndex: Math.floor(p.y * 10)
                        }}
                    >
                        <img
                            src={p.sprite}
                            className="person"
                            style={{
                                width: "55px",
                                opacity: p.exiting ? p.fade : 1,
                                filter: p.exiting
                                    ? `blur(${(1 - p.fade) * 8}px) grayscale(1)`
                                    : "none",
                                transform: `
                  translateY(${p.exiting ? -20 * (1 - p.fade) : hop}px)
                  scale(${p.exiting ? 1.4 - 0.4 * p.fade : 1})
                `,
                                transition: "filter 0.2s linear"
                            }}
                        />

                        {showBubble && (
                            <button
                                type="button"
                                className="messageBubble"
                                onClick={onBubbleClick}
                                aria-label="Read citizen reaction"
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "-18px",
                                    transform: "translate(-50%, -50%)"
                                }}
                            >
                                💬
                            </button>
                        )}
                    </div>
                );
            })}
        </>
    );
}

export default People;