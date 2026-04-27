import { checkThresholds, buildUserPrompt } from "./engine/promptGenerator.ts";
import { requestDecision, checkOllamaConnection } from "./engine/ollamaService.ts";
import type { Agent, SimulationEnvironment, LLMPromptContext } from "./types/agent.ts";

const testAgent: Agent = {
    id: "agent_002",
    name: "Viktor",
    age: 41,
    gender: "male",
    backstory: "Ehemaliger Söldner, der nach dem Krieg nie wieder Fuß gefasst hat. Gewalt ist die einzige Sprache die er wirklich versteht.",
    isOutside: true,
    traits: ["ruthless", "predatory", "calculating", "nihilistic"],
    skills: {
        combat: 0.92,
        stealth: 0.75,
        intimidation: 0.88,
        weapons_handling: 0.95,
        survival: 0.8
    },
    stats: {
        hunger: 0.92,
        thirst: 0.3,
        fatigue: 0.4,
        stress: 0.78,
        pain: 0.2,
        morale: 0.1,
        health: 0.75,
        intoxication: 0.0
    },
    economics: {
        cash: 0,
        debt: 0,
        hasJob: false,
        jobSatisfaction: 0,
        daysSinceIncome: 14
    },
    inventory: {
        food: 0,
        water: 1,
        weapons: ["Klappmesser", "abgesägtes Rohr"],
        tools: [],
        drugs: [],
        valuables: 0
    },
    relations: {
        knownAgents: [],
        reputation: -0.8
    },
    memory: {
        recentEvents: [
            "Hat gestern einen Mann für 20 Euro zusammengeschlagen",
            "Wurde aus der Notunterkunft geworfen wegen Gewalt gegen andere Bewohner",
            "Hat zwei Tage lang nichts gegessen"
        ],
        traumaticEvents: [
            "Hat im Krieg Dinge getan die er nicht vergessen kann",
            "Wurde von seiner eigenen Einheit verraten und zurückgelassen"
        ],
        currentGoal: "Überleben – koste es was es wolle",
        currentFear: "Schwäche zu zeigen"
    },
    sexualOrientation: "heterosexual",
    libido: 0.2,
    lastIntimateContact: 180,
    body: {
        height: 188,
        weight: 95,
        fitnessLevel: 0.75,
        attractiveness: 0.25,
        visibleScars: true,
        visibleTattos: true,
        disabilities: [],
        chronicConditions: [],
        lastSlept: 18,
        lastAte: 52
    },
    family: {
        hasParents: false,
        parentRelationship: "deceased",
        hasSiblings: false,
        children: []
    },
    housing: {
        housingStatus: "homeless",
        district: "Industriegebiet",
        monthlyRent: 0,
        roommates: []
    },
    goals: {
        shortTermGoal: "Essen beschaffen – notfalls mit Gewalt",
        longTermGoal: "Genug Geld zusammenraffen um die Stadt zu verlassen",
        coreValue: "Überleben",
        moralCode: "Keiner. Moral ist ein Luxus den er sich nicht leisten kann.",
        wouldKillFor: ["Essen", "Geld", "Selbstverteidigung", "einfach weil er kann"],
        wouldDieFor: []
    },
    conditions: [
        {
            condition: "ptsd",
            severity: 0.85,
            isMedicated: false,
            triggerConditions: ["laute Geräusche", "Uniformen", "Autoritätspersonen"]
        },
        {
            condition: "antisocial_personality",
            severity: 0.9,
            isMedicated: false,
            triggerConditions: []
        }
    ],
    addiction: [
        {
            substance: "Alkohol",
            dependencyLevel: 0.7,
            daysSinceLastUsed: 3,
            withdrawalSeverity: 0.6,
            triggeredBy: ["Stress", "Hunger", "Einsamkeit"]
        }
    ]
};

const testEnvironment: SimulationEnvironment = {
    tick: 1203,
    timeOfDay: "deep_night",
    weather: "rain",
    temperature: 3,
    district: "Industriegebiet",
    crimeRate: 0.85,
    policePresence: 0.05,
    nearbyAgents: [
        {
            name: "Unbekannter Mann",
            age: 28,
            gender: "male",
            visibleWeapon: false,
            attitude: "neutral",
            bodyLanguage: "nervous",
            isKnownToAgent: false,
            apparentHealth: "healthy",
            apparentWealthLevel: "middle",
            groupSize: 1,
            isDistracted: true
        }
    ],
    nearbyObjects: [
        {
            id: "obj_001",
            type: "alley",
            label: "dunkle Gasse",
            isLocked: false,
            isOccupied: false,
            hasOwner: false,
            value: 0,
            properties: { isolated: true, noCamera: true }
        },
        {
            id: "obj_002",
            type: "convenience_store",
            label: "Spätkauf – Fenster steht auf Kipp",
            isLocked: false,
            isOccupied: true,
            hasOwner: true,
            ownerId: "agent_099",
            value: 200,
            properties: { hasAlarm: false, ownerAlone: true }
        }
    ],
    activeEvents: ["tiefe_nacht", "kaum_zeugen", "starker_regen_deckt_geräusche"]
};

async function main() {
    console.log("=== THE HUMAN SANDBOX – Extremtest ===\n");

    const ollamaOnline = await checkOllamaConnection();
    if (!ollamaOnline) {
        console.error("Ollama ist nicht erreichbar.");
        return;
    }
    console.log("Ollama ist online.\n");

    const trigger = checkThresholds(testAgent);
    console.log(`Trigger: ${trigger.shouldTrigger}`);
    console.log(`Grund: ${trigger.reason}`);
    console.log(`Dringlichkeit: ${trigger.urgency}\n`);

    if (!trigger.shouldTrigger) {
        console.log("Kein Trigger.");
        return;
    }

    const ctx: LLMPromptContext = {
        agent: testAgent,
        environment: testEnvironment,
        triggerReason: trigger.reason
    };

    console.log("=== USER PROMPT ===");
    console.log(buildUserPrompt(ctx));
    console.log("\n=== OLLAMA ANFRAGE LÄUFT... ===\n");

    const decision = await requestDecision(ctx);

    console.log("=== ENTSCHEIDUNG ===");
    console.log(`Aktion:              ${decision.action}`);
    console.log(`Ziel:                ${decision.target ?? "—"}`);
    console.log(`Emotionaler Zustand: ${decision.emotionalState}`);
    console.log(`Risikolevel:         ${decision.riskLevel}`);
    console.log(`Erwogen:             ${decision.alternativeConsidered ?? "—"}`);
    console.log(`\nInnerer Monolog:\n"${decision.reasoning}"`);
}

main().catch(console.error);