import React, { useMemo } from "react";
import { motion } from "framer-motion";

const villagers = [
    "/villager1.png",
    "/villager2.png",
    "/villager3.png"
];

function DecisionModal({ eventText, onYes, onNo }) {

    // random portrait each time modal appears
    const villagerImage = useMemo(() => {
        return villagers[Math.floor(Math.random() * villagers.length)];
    }, [eventText]);

    return (
        <div className="decisionOverlay">
            <motion.div
                className="decisionWrapper"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
            >
                {/* Portrait */}
                <div className="villagerSection">
                    <motion.img
                        src={villagerImage}
                        alt="Villager"
                        className="villagerPortrait"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    />
                    <span className="villagerLabel">Villager</span>
                </div>

                {/* Dialogue */}
                <div className="dialogueSection">
                    <div className="speechBubble">
                        <p>{eventText}</p>
                    </div>

                    <div className="decisionButtons">
                        <button onClick={onYes} className="yesBtn">Yes</button>
                        <button onClick={onNo} className="noBtn">No</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default DecisionModal;