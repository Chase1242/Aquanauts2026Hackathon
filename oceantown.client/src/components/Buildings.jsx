import React, { useState, useMemo } from "react";

const CENTER = 50;
const ELLIPSE_X = 0.33;
const ELLIPSE_Y = 0.26;

const MAX_BUILDINGS = 10;
const MIN_DISTANCE = 14;

function generatePositions(count) {
    const positions = [];
    const MAX_ATTEMPTS = 500;
    let attempts = 0;

    while (positions.length < count && attempts < MAX_ATTEMPTS) {
        attempts++;

        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random());

        const left =
            CENTER + radius * Math.cos(angle) * 100 * ELLIPSE_X;

        const top =
            CENTER + radius * Math.sin(angle) * 100 * ELLIPSE_Y;

        const scale = 0.7 + Math.random() * 0.25;

        const newPos = { left, top, scale };

        const overlapping = positions.some(pos => {
            const dx = pos.left - newPos.left;
            const dy = pos.top - newPos.top;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < MIN_DISTANCE;
        });

        if (!overlapping) {
            positions.push(newPos);
        }
    }

    return positions;
}

function Buildings({ ecosystem, population, positions = [] }) {

    const buildingCount = useMemo(() => {
        const ratio = population / 300;
        return Math.max(2, Math.floor(ratio * MAX_BUILDINGS));
    }, [population]);

    return (
        <>
            {positions.slice(0, buildingCount).map((pos, index) => {
                const urbanFactor = population / 300;
                const isSkyscraper = Math.random() < urbanFactor;

                const src = isSkyscraper ? "/skyscraper.png" : "/house.png";

                return (
                    <img
                        key={index}
                        src={src}
                        alt="building"
                        style={{
                            position: "absolute",
                            left: `${pos.left}%`,
                            top: `${pos.top}%`,
                            width: isSkyscraper ? "145px" : "90px",
                            zIndex: 150 + Math.floor(pos.top * 10),
                            transform: `
                                translate(-50%, -100%)
                                scale(${pos.scale})
                            `,
                            filter: "drop-shadow(0px 6px 10px rgba(0,0,0,0.35))",
                            opacity: 0.95,
                            transition: "all 0.8s ease"
                        }}
                    />
                );
            })}
        </>
    );
}

export default Buildings;