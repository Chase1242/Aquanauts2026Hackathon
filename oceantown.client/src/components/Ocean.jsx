import React from "react";

function Ocean({ ecosystem }) {
    const darkness = 1 - ecosystem / 100;

    return (
        <div className="sea-water">
            <div className="background-water"></div>

            <div className="water"></div>

            <div
                className="overlay"
                style={{ backgroundColor: `rgba(0,0,0,${darkness * 0.5})` }}
            />

            <svg width="0" height="0">
                <filter id="turbulence">
                    <feTurbulence
                        numOctaves="3"
                        seed="2"
                        baseFrequency="0.02 0.06"
                    >
                        <animate
                            attributeName="baseFrequency"
                            dur="30s"
                            values="0.02 0.06;0.04 0.08;0.02 0.06"
                            repeatCount="indefinite"
                        />
                    </feTurbulence>
                    <feDisplacementMap scale="20" in="SourceGraphic" />
                </filter>

                <filter id="turbulence2">
                    <feTurbulence
                        numOctaves="3"
                        seed="2"
                        baseFrequency="0.02 0.009"
                    >
                        <animate
                            attributeName="baseFrequency"
                            dur="30s"
                            values="0.02 0.009;0.09 0.018;0.02 0.009"
                            repeatCount="indefinite"
                        />
                    </feTurbulence>
                    <feDisplacementMap scale="35" in="SourceGraphic" />
                </filter>
            </svg>
        </div>
    );
}

export default Ocean;