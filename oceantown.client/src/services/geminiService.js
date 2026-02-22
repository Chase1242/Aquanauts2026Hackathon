export async function getCitizenDialogue(state, scenarioTitle, choice) {
    try {
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ecosystem: state.ecosystem,
                population: state.population,
                happiness: state.happiness,
                scenarioTitle,
                choice
            })
        });

        if (!response.ok) {
            throw new Error("Gemini request failed");
        }

        const data = await response.json();

        const raw = data.text?.trim() || "";

        const start = raw.indexOf("{");
        const end = raw.lastIndexOf("}");

        const jsonOnly =
            start !== -1 && end !== -1
                ? raw.slice(start, end + 1)
                : raw;

        const parsed = JSON.parse(jsonOnly);

        return parsed;

    } catch (err) {
        console.error("Gemini failed:", err);

        return {
            citizen: "I have mixed feelings about this.",
            tone: "neutral"
        };
    }
}