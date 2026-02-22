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

function Buildings({ ecosystem }) {
    const [positions] = useState(() =>
        generatePositions(MAX_BUILDINGS)
    );

    // Building count
    const buildingCount = useMemo(() => {
        if (ecosystem > 70) return 4;
        if (ecosystem > 55) return 5;
        if (ecosystem > 40) return 6;
        if (ecosystem > 25) return 7;
        if (ecosystem > 10) return 8;
        return 10;
    }, [ecosystem]);

    return (
        <>
            {positions.slice(0, buildingCount).map((pos, index) => {

                // 🌱 Progressive urbanization
                const urbanFactor = Math.max(0, (50 - ecosystem) / 50);
                const isSkyscraper =
                    Math.random() < urbanFactor;

                const src = isSkyscraper
                    ? "/skyscraper.png"
                    : "/house.png";

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

                            zIndex: Math.floor(pos.top * 10),

                            transform: `
                translate(-50%, -100%)
                scale(${pos.scale})
                ${isSkyscraper ? "scaleY(1.05)" : ""}
              `,

                            filter: `
                drop-shadow(0px 6px 10px rgba(0,0,0,0.35))
                brightness(${isSkyscraper ? 0.95 : 1})
              `,

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