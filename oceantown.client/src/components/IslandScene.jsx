import React, { useMemo } from "react";
import Ocean from "./Ocean";
import Trees from "./Trees";
import Buildings from "./Buildings";
import People from "./People";

const CENTER = 50;
const ELLIPSE_X = 0.33;
const ELLIPSE_Y = 0.26;

function randomIslandPoint() {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random());
    const left = CENTER + radius * Math.cos(angle) * 100 * ELLIPSE_X;
    const top = CENTER + radius * Math.sin(angle) * 100 * ELLIPSE_Y;
    return { left, top };
}

function dist(a, b) {
    const dx = a.left - b.left;
    const dy = a.top - b.top;
    return Math.sqrt(dx * dx + dy * dy);
}

function generateOccupiedSpots({ buildingCount, treeCount }) {
    const occupied = [];

    const MAX_ATTEMPTS = 4000;

    // sizes in “percent-space” (tune if needed)
    const BUILDING_MIN = 16; // bigger because buildings are wide/tall
    const TREE_MIN = 12;

    // 1) Place buildings first
    let tries = 0;
    while (occupied.filter(o => o.type === "building").length < buildingCount && tries < MAX_ATTEMPTS) {
        tries++;
        const p = randomIslandPoint();
        const ok = occupied.every(o => dist(o, p) >= (o.type === "building" ? BUILDING_MIN : TREE_MIN));
        if (!ok) continue;

        occupied.push({ ...p, type: "building", scale: 0.7 + Math.random() * 0.25 });
    }

    // 2) Place trees next (avoid buildings + trees)
    tries = 0;
    while (occupied.filter(o => o.type === "tree").length < treeCount && tries < MAX_ATTEMPTS) {
        tries++;
        const p = randomIslandPoint();
        const ok = occupied.every(o => dist(o, p) >= (o.type === "building" ? BUILDING_MIN : TREE_MIN));
        if (!ok) continue;

        occupied.push({ ...p, type: "tree", scale: 0.75 + Math.random() * 0.45 });
    }

    return occupied;
}

function IslandScene({ ecosystem, population, onAllGone, children }) {    // choose how many you want overall
    const buildingCount = 7; // or compute from ecosystem like before
    const treeCount = 28;

    // ✅ shared placement, computed once
    const occupied = useMemo(
        () => generateOccupiedSpots({ buildingCount, treeCount }),
        [buildingCount, treeCount]
    );

    const buildingSpots = occupied.filter(o => o.type === "building");
    const treeSpots = occupied.filter(o => o.type === "tree");

    return (
        <div className="scene">
            <Ocean ecosystem={ecosystem} />
            <div className="islandBackgroundFade" />
            <div className="islandBackgroundFade" />

            <div className="island-container">
                <img src="/island.png" alt="island" className="island-image" />

                <div className="island-mask">
                    <Trees ecosystem={ecosystem} positions={treeSpots} />
                    <Buildings ecosystem={ecosystem} positions={buildingSpots} population={population}
                    />
                    <People population={population} onAllGone={onAllGone} />
                </div>

            </div>
            {children}
        </div>
    );
}

export default IslandScene;