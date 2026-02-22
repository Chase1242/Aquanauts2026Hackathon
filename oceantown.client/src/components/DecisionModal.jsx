import React from "react";

function DecisionModal({ eventText, onYes, onNo }) {
    return (
        <div className="decisionOverlay">
            <div className="decisionBox">
                <p>{eventText}</p>
                <div className="decisionButtons">
                    <button onClick={onYes}>Yes</button>
                    <button onClick={onNo}>No</button>
                </div>
            </div>
        </div>
    );
}

export default DecisionModal;