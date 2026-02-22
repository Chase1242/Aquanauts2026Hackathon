import React from "react";
import Ocean from "./Ocean";
import Trees from "./Trees";
import Buildings from "./Buildings";
import People from "./People";

function IslandScene({ ecosystem, population, onAllGone }) {
    return (
        <div className="scene">
            <Ocean ecosystem={ecosystem} />

            <div className="island-container">
                <img src="/island.png" alt="island" className="island-image" />

                <div className="island-mask">
                    <Trees ecosystem={ecosystem} />
                    <Buildings ecosystem={ecosystem} />
                    <People
                        population={population}
                        onAllGone={onAllGone}
                    />
                </div>
            </div>
        </div>
    );
}

export default IslandScene;