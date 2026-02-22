import React from "react";

function DecisionModal({ eventText, onYes, onNo }) {
  return (
    <div className="modal">
      <p>{eventText}</p>
      <button onClick={onYes}>Yes</button>
      <button onClick={onNo}>No</button>
    </div>
  );
}

export default DecisionModal;