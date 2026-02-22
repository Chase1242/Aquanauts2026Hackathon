import React, { useMemo } from "react";

export default function Trees({ ecosystem, positions = [] }) {
    const MAX_TREES = positions.length;

    const visibleTreeCount = useMemo(
        () => Math.floor((ecosystem / 100) * MAX_TREES),
        [ecosystem, MAX_TREES]
    );

    return (
        <>
            {positions.map((pos, index) => (
                <img
                    key={index}
                    src="/tree.png"
                    alt="tree"
                    className="tree"
                    style={{
                        left: `${pos.left}%`,
                        top: `${pos.top}%`,
                        zIndex: 100 + Math.floor(pos.top * 10),
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