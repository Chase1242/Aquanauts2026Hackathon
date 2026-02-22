import React, { useState } from "react";

function generateTreePositions(count) {
    const positions = [];
    const MIN_DISTANCE = 11; 
    const MAX_ATTEMPTS = 500;

    let attempts = 0;

    while (positions.length < count && attempts < MAX_ATTEMPTS) {
        attempts++;

        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random());

        const ellipseX = 0.33;
        const ellipseY = 0.26;

        const centerX = 50;
        const centerY = 50;

        const left = centerX + radius * Math.cos(angle) * 100 * ellipseX;
        const top = centerY + radius * Math.sin(angle) * 100 * ellipseY;

        const scale = 0.85 + Math.random() * 0.35;

        const newPos = { left, top, scale };

        const overlapping = positions.some(pos => {
            const dx = pos.left - newPos.left;
            const dy = pos.top - newPos.top;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // account for scale
            return distance < MIN_DISTANCE * Math.max(scale, pos.scale);
        });

        if (!overlapping) {
            positions.push(newPos);
        }
    }

    console.log("Trees allocated:", positions.length);

    return positions;
}
function Trees({ ecosystem }) {
    const MAX_TREES = 28;

    const [treePositions] = useState(() =>
        generateTreePositions(MAX_TREES)
    );

    const visibleTreeCount = Math.floor((ecosystem / 100) * MAX_TREES);

    return (
        <>
            {treePositions.map((pos, index) => (
                <img
                    key={index}
                    src="/tree.png"
                    alt="tree"
                    className="tree"
                    style={{
                        left: `${pos.left}%`,
                        top: `${pos.top}%`,
                        zIndex: Math.floor(pos.top * 10), 
                        transform:
                            index < visibleTreeCount
                                ? `translate(-50%, -100%) scale(${pos.scale})`
                                : `translate(-50%, -100%) scale(0)`
                    }}
                />
            ))}
        </>
    );
}

export default Trees;