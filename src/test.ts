import { checkThresholds, buildSystemPrompt, buildUserPrompt } from "./engine/promptGenerator.ts";
import { requestDecision, checkOllamaConnection } from "./engine/ollamaService.ts";
import type { Agent, SimulationEnvironment, LLMPromptContext } from "./types/agent.ts";



const testAgent: Agent = {
    id: "agent_001",
    name: "Markus",
    age: 34,
    gender: "male",
    backstory: "Früher Maurer, vor acht Monaten entlassen. Seitdem arbeitslos und dem Alkohol verfallen. Starke Psychische veranlagung zum Töten.",
    isOutside: true,
    traits: ["impulsive", "greedy","brave"],
    skills: {
        stealth: 0.3,
        survival: 0.6,
        theft: 0.2,
        combat: 1
    },
    stats: {
        hunger: 0.95,
        thirst: 0.87,
        fatigue: 0.45,
        stress: 0.72,
        pain: 0.4,
        morale: 0.00,
        health: 0.7,
        intoxication: 0.2
    },
    economics: {
        cash: 0,
        debt: 320,
        hasJob: false,
        jobSatisfaction: 0,
        daysSinceIncome: 12
    },
    inventory: {
        food: 0,
        water: 0,
        weapons: ["knife"],
        tools: ["crowbar"],
        drugs: [],
        valuables: 0
    },
    relations: {
        knownAgents: [],
        reputation: -0.1
    },
    memory: {
        recentEvents: [
            "Wurde gestern vom Supermarkt des Geländes verwiesen",
            "Hat letzte Nacht in einer Unterführung geschlafen",
            "Wurde von einem anderen Obdachlosen bestohlen"
        ],
        traumaticEvents: [
            "Frau hat ihn nach dem Jobverlust verlassen und die Kinder mitgenommen",
            "Du hast einen Hund getötet weil es dir Spaß macht"
        ],
        currentGoal: "Irgendwie an Essen kommen",
        currentFear: "Auf der Straße zu sterben"
    }
};
const eliteAgent: Agent = {
    id: "agent_099",
    name: "Maximilian von Hohenstein",
    age: 42,
    gender: "male",
    backstory: "Erfolgreicher Investmentbanker, der gerade ein lukratives Geschäft abgeschlossen hat. Er ist es gewohnt, dass sich die Welt nach seinen Regeln dreht.",
    isOutside: true,
    traits: ["antisocial","cowardly"],
    skills: {
        stealth: 0.1,
        survival: 0.1,
        theft: 0.0
    },
    stats: {
        hunger: 0.1,
        thirst: 0.05,
        fatigue: 0.2,
        stress: 0.15,
        pain: 0.0,
        morale: 0.95,
        health: 1.0,
        intoxication: 0.65
    },
    economics: {
        cash: 12500, //
        debt: 0,
        hasJob: true,
        jobSatisfaction: 0.9,
        daysSinceIncome: 1
    },
    inventory: {
        food: 0,
        water: 1, // Eine Flasche teures Evian
        weapons: [],
        tools: ["smartphone_pro_max", "car_keys_porsche"],
        drugs: ["Heroine"],
        valuables: 15000 // Teure Armbanduhr (z.B. Rolex), Designeranzug
    },
    relations: {
        knownAgents: [],
        reputation: 0.8
    },
    memory: {
        recentEvents: [
            "Hat gerade ein 5-Gänge-Menü genossen",
            "Wartet auf sein Uber vor dem Bahnhofsviertel",
            "Ärgert sich über den starken Regen, der seine Maßschuhe ruiniert"
        ],
        traumaticEvents: [
            "Musste einmal Economy-Class fliegen"
        ],
        currentGoal: "Trocken nach Hause kommen",
        currentFear: "Schmutz oder Kontakt mit der Unterschicht"
    }
};

const testEnvironment: SimulationEnvironment = {
    tick: 847,
    timeOfDay: "night",
    weather: "rain",
    temperature: 4,
    district: "Bahnhofsviertel",
    crimeRate: 0.72,
    policePresence: 0.18,
    nearbyAgents: [{agentId:eliteAgent.id, attitude:"neutral", distance: 2}],
    nearbyObjects: [


    ],
    activeEvents: ["starker_regen"]
};

async function main() {
    console.log("=== THE HUMAN SANDBOX – Test ===\n");

    const ollamaOnline = await checkOllamaConnection();
    if (!ollamaOnline) {
        console.error("Ollama ist nicht erreichbar. Starte die Ollama-App und versuche es erneut.");
        return;
    }
    console.log("Ollama ist online.\n");

    const trigger = checkThresholds(testAgent);
    console.log(`Trigger: ${trigger.shouldTrigger}`);
    console.log(`Grund: ${trigger.reason}`);
    console.log(`Dringlichkeit: ${trigger.urgency}\n`);

    if (!trigger.shouldTrigger) {
        console.log("Kein kritischer Schwellenwert erreicht.");
        return;
    }

    const ctx: LLMPromptContext = {
        agent: testAgent,
        environment: testEnvironment,
        triggerReason: trigger.reason
    };

    console.log("=== SYSTEM PROMPT ===");
    console.log(buildSystemPrompt());
    console.log("\n=== USER PROMPT ===");
    console.log(buildUserPrompt(ctx));
    console.log("\n=== OLLAMA ANFRAGE LÄUFT... ===\n");

    const decision = await requestDecision(ctx);

    console.log("=== ENTSCHEIDUNG ===");
    console.log(`Aktion:          ${decision.action}`);
    console.log(`Ziel:            ${decision.target ?? "—"}`);
    console.log(`Emotionaler Zustand: ${decision.emotionalState}`);
    console.log(`Risikolevel:     ${decision.riskLevel}`);
    console.log(`Erwogen:         ${decision.alternativeConsidered ?? "—"}`);
    console.log(`\nInnerer Monolog:\n"${decision.reasoning}"`);
}

main().catch(console.error);