import { checkThresholds } from "./engine/promptGenerator.ts";
import { requestDecision, checkOllamaConnection } from "./engine/ollamaService.ts";
import type { Agent, SimulationEnvironment, LLMPromptContext } from "./types/agent.ts";

// ============================================================
// UMGEBUNG – Armenviertel, Samstagabend
// ============================================================

const environment: SimulationEnvironment = {
    tick: 2847,
    timeOfDay: "night",
    weather: "rain",
    temperature: 6,
    district: "Bahnhofsviertel – sozialer Brennpunkt",
    crimeRate: 0.88,
    policePresence: 0.08,
    nearbyObjects: [
        {
            id: "obj_001",
            type: "convenience_store",
            label: "Spätkauf Ahmet – Fenster auf Kipp",
            isLocked: false,
            isOccupied: true,
            hasOwner: true,
            ownerId: "agent_ahmet",
            value: 350,
            properties: { hasAlarm: false, ownerAlone: true, cashRegisterVisible: true }
        },
        {
            id: "obj_002",
            type: "alley",
            label: "dunkle Seitengasse hinter dem Spätkauf",
            isLocked: false,
            isOccupied: false,
            hasOwner: false,
            value: 0,
            properties: { isolated: true, noCamera: true, noLighting: true }
        },
        {
            id: "obj_003",
            type: "bench",
            label: "Parkbank unter defekter Straßenlaterne",
            isLocked: false,
            isOccupied: true,
            hasOwner: false,
            value: 0,
            properties: { sheltered: false }
        },
        {
            id: "obj_004",
            type: "dumpster",
            label: "Mülltonne hinter dem Restauranteingang",
            isLocked: false,
            isOccupied: false,
            hasOwner: false,
            value: 8,
            properties: { lastEmptied: "vor zwei Tagen", foodWaste: true }
        },
        {
            id: "obj_005",
            type: "parked_car",
            label: "geparkter BMW – Fenster einen Spalt offen",
            isLocked: false,
            isOccupied: false,
            hasOwner: true,
            value: 180,
            properties: { hasAlarm: true, valuablesVisible: true }
        }
    ],
    nearbyAgents: [
        {
            name: "Ahmet",
            age: 52,
            gender: "male",
            visibleWeapon: false,
            attitude: "neutral",
            bodyLanguage: "calm",
            isKnownToAgent: false,
            apparentHealth: "healthy",
            apparentWealthLevel: "middle",
            groupSize: 1,
            isDistracted: true
        },
        {
            name: "Unbekannte Frau",
            age: 24,
            gender: "female",
            visibleWeapon: false,
            attitude: "neutral",
            bodyLanguage: "nervous",
            isKnownToAgent: false,
            apparentHealth: "healthy",
            apparentWealthLevel: "middle",
            groupSize: 1,
            isDistracted: false
        },
        {
            name: "Betrunkener Mann",
            age: 35,
            gender: "male",
            visibleWeapon: false,
            attitude: "neutral",
            bodyLanguage: "drunk",
            isKnownToAgent: false,
            apparentHealth: "healthy",
            apparentWealthLevel: "poor",
            groupSize: 1,
            isDistracted: true
        },
        {
            name: "Jugendlicher mit Kapuze",
            age: 17,
            gender: "male",
            visibleWeapon: true,
            attitude: "hostile",
            bodyLanguage: "aggressive",
            isKnownToAgent: false,
            apparentHealth: "healthy",
            apparentWealthLevel: "poor",
            groupSize: 3,
            isDistracted: false
        }
    ],
    activeEvents: [
        "starker_regen_deckt_geräusche_ab",
        "strassenlaterne_defekt",
        "keine_polizei_weit_und_breit",
        "samstagabend_wenig_zeugen"
    ]
};

// ============================================================
// AGENT 1 – Viktor, ehemaliger Söldner
// ============================================================

const viktor: Agent = {
    id: "agent_viktor",
    name: "Viktor",
    age: 41,
    gender: "male",
    backstory: "Ehemaliger Söldner, nach dem Krieg nie wieder Fuß gefasst. Gewalt ist die einzige Sprache die er wirklich versteht.",
    isOutside: true,
    traits: ["ruthless", "predatory", "calculating", "nihilistic",],
    skills: {
        combat: 0.92,
        stealth: 0.75,
        intimidation: 0.88,
        weapons_handling: 0.95,
        survival: 0.8
    },
    stats: {
        hunger: 0.93,
        thirst: 0.3,
        fatigue: 0.45,
        stress: 0.75,
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
        water: 0,
        weapons: ["Klappmesser", "abgesägtes Metallrohr"],
        tools: [],
        drugs: [],
        valuables: 0
    },
    relations: { knownAgents: [], reputation: -0.8 },
    memory: {
        recentEvents: [
            "Hat gestern einen Mann für 20 Euro zusammengeschlagen",
            "Wurde aus der Notunterkunft geworfen",
            "Seit zwei Tagen nichts gegessen"
        ],
        traumaticEvents: [
            "Hat im Krieg Dinge getan die er nicht vergessen kann",
            "Wurde von seiner eigenen Einheit verraten"
        ],
        currentGoal: "Essen und Geld beschaffen – koste es was es wolle",
        currentFear: "Schwäche zu zeigen"
    },
    sexualOrientation: "heterosexual",
    libido: 0.1,
    lastIntimateContact: 365,
    body: {
        height: 188,
        weight: 95,
        fitnessLevel: 0.75,
        attractiveness: 0.25,
        visibleScars: true,
        visibleTattos: true,
        disabilities: [],
        chronicConditions: [],
        lastSlept: 20,
        lastAte: 54
    },
    family: {
        hasParents: false,
        parentRelationship: "deceased",
        hasSiblings: false,
        children: []
    },
    housing: {
        housingStatus: "homeless",
        district: "Bahnhofsviertel",
        monthlyRent: 0,
        roommates: []
    },
    goals: {
        shortTermGoal: "Essen und Geld – notfalls mit Gewalt",
        longTermGoal: "Die Stadt verlassen",
        coreValue: "Überleben",
        moralCode: "Keine. Moral ist Luxus.",
        wouldKillFor: ["Essen", "Geld", "Selbsterhalt"],
        wouldDieFor: []
    },
    conditions: [
        {
            condition: "ptsd",
            severity: 0.85,
            isMedicated: false,
            triggerConditions: ["laute Geräusche", "Uniformen"]
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
            triggeredBy: ["Stress", "Hunger"]
        }
    ]
};

// ============================================================
// AGENT 2 – Lena, drogenabhängige Mutter
// ============================================================

const lena: Agent = {
    id: "agent_lena",
    name: "Lena",
    age: 29,
    gender: "female",
    backstory: "Ehemalige Krankenpflegeschülerin. Mit 22 durch einen Freund an Heroin gekommen. Hat ihr Kind vor drei Monaten ans Jugendamt verloren.",
    isOutside: true,
    traits: ["manipulative", "codependent", "impulsive", "deceitful"],
    skills: {
        persuasion: 0.72,
        seduction: 0.68,
        medicine: 0.45,
        acting: 0.65,
        theft: 0.5
    },
    stats: {
        hunger: 0.65,
        thirst: 0.5,
        fatigue: 0.7,
        stress: 0.92,
        pain: 0.4,
        morale: 0.08,
        health: 0.45,
        intoxication: 0.15
    },
    economics: {
        cash: 3.50,
        debt: 1200,
        hasJob: false,
        jobSatisfaction: 0,
        daysSinceIncome: 9
    },
    inventory: {
        food: 0,
        water: 0,
        weapons: [],
        tools: [],
        drugs: ["Heroin-Restmenge (fast leer)"],
        valuables: 0
    },
    relations: { knownAgents: [], reputation: -0.4 },
    memory: {
        recentEvents: [
            "Hat ihr Kind vor drei Monaten ans Jugendamt verloren",
            "Ihr Dealer hat ihr heute nichts gegeben weil sie kein Geld hatte",
            "Hat die letzte Nacht in einem Hauseingang verbracht"
        ],
        traumaticEvents: [
            "Kind wurde weggenommen",
            "Mit 16 von einem Verwandten missbraucht"
        ],
        currentGoal: "Geld für eine Dosis auftreiben bevor der Entzug sie zerstört",
        currentFear: "Den Schmerz des Entzugs"
    },
    sexualOrientation: "bisexual",
    libido: 0.2,
    lastIntimateContact: 14,
    body: {
        height: 165,
        weight: 48,
        fitnessLevel: 0.2,
        attractiveness: 0.55,
        visibleScars: true,
        visibleTattos: false,
        disabilities: [],
        chronicConditions: ["Hepatitis C", "Mangelernährung"],
        lastSlept: 14,
        lastAte: 28
    },
    family: {
        hasParents: true,
        parentRelationship: "estranged",
        hasSiblings: true,
        children: [
            {
                id: "child_001",
                name: "Finn",
                gender: "male",
                romanticHistory: "none",
                currentRomanticStatus: "none",
                sexualAttraction: 0,
                trustLevel: 1.0,
                jelousyLevel: 0,
                powerDynamic: "equal",
                sharedTrauma: false,
                hasChildrenWith: false,
                owedFavor: false,
                desireToImpress: 1.0,
                relationshipType: "family",
                age: 4
            }
        ]
    },
    housing: {
        housingStatus: "homeless",
        district: "Bahnhofsviertel",
        monthlyRent: 0,
        roommates: []
    },
    goals: {
        shortTermGoal: "Geld für Heroin auftreiben",
        longTermGoal: "Sauber werden und Finn zurückbekommen",
        coreValue: "Finn",
        moralCode: "Ich tue alles für eine weitere Dosis – und hasse mich dafür.",
        wouldKillFor: [],
        wouldDieFor: ["Finn"]
    },
    conditions: [
        {
            condition: "drug_dependency",
            severity: 0.95,
            isMedicated: false,
            triggerConditions: ["Stress", "Einsamkeit", "Schmerz"]
        },
        {
            condition: "depression",
            severity: 0.88,
            isMedicated: false,
            triggerConditions: ["Gedanken an Finn"]
        },
        {
            condition: "ptsd",
            severity: 0.7,
            isMedicated: false,
            triggerConditions: ["ältere Männer", "Dunkelheit", "Eingeschlossensein"]
        }
    ],
    addiction: [
        {
            substance: "Heroin",
            dependencyLevel: 0.95,
            daysSinceLastUsed: 1,
            withdrawalSeverity: 0.75,
            triggeredBy: ["Stress", "Schmerz", "Einsamkeit", "Gedanken an Finn"]
        }
    ]
};

// ============================================================
// AGENT 3 – Karim, 19, Gangmitglied
// ============================================================

const karim: Agent = {
    id: "agent_karim",
    name: "Karim",
    age: 19,
    gender: "male",
    backstory: "In der Siedlung aufgewachsen, Vater abwesend, Mutter arbeitet zwei Jobs. Mit 14 von der Gang rekrutiert weil die die einzige Familie waren die er kannte.",
    isOutside: true,
    traits: ["impulsive", "loyal", "volatile", "brave", "attention_seeking"],
    skills: {
        combat: 0.65,
        intimidation: 0.7,
        stealth: 0.55,
        streetwise: 0.85,
        weapons_handling: 0.6
    },
    stats: {
        hunger: 0.4,
        thirst: 0.3,
        fatigue: 0.35,
        stress: 0.68,
        pain: 0.0,
        morale: 0.45,
        health: 0.85,
        intoxication: 0.35
    },
    economics: {
        cash: 45,
        debt: 0,
        hasJob: false,
        jobSatisfaction: 0,
        daysSinceIncome: 2
    },
    inventory: {
        food: 2,
        water: 1,
        weapons: ["Messer", "Pfefferspray"],
        tools: [],
        drugs: ["Joints (3)"],
        valuables: 2
    },
    relations: {
        knownAgents: [
            {
                id: "agent_viktor",
                name: "Viktor",
                gender: "male",
                romanticHistory: "none",
                currentRomanticStatus: "none",
                sexualAttraction: 0,
                trustLevel: -0.7,
                jelousyLevel: 0,
                powerDynamic: "equal",
                sharedTrauma: false,
                hasChildrenWith: false,
                owedFavor: false,
                desireToImpress: 0,
                relationshipType: "enemy",
                age: 41
            }
        ],
        reputation: 0.3
    },
    memory: {
        recentEvents: [
            "Hat heute Abend mit seiner Gang Territorium markiert",
            "Ein Unbekannter großer Mann (Viktor) hat ihm heute Abend einen feindseligen Blick zugeworfen",
            "Sein Anführer hat ihm gesagt er soll heute Nacht beweisen dass er bereit ist"
        ],
        traumaticEvents: [
            "Hat mit 16 zugesehen wie sein bester Freund erschossen wurde"
        ],
        currentGoal: "Sich vor seiner Gang beweisen",
        currentFear: "Als Feigling zu gelten"
    },
    sexualOrientation: "heterosexual",
    libido: 0.6,
    lastIntimateContact: 30,
    body: {
        height: 178,
        weight: 72,
        fitnessLevel: 0.7,
        attractiveness: 0.6,
        visibleScars: false,
        visibleTattos: true,
        disabilities: [],
        chronicConditions: [],
        lastSlept: 8,
        lastAte: 6
    },
    family: {
        hasParents: true,
        parentRelationship: "good",
        hasSiblings: true,
        children: []
    },
    housing: {
        housingStatus: "renting",
        district: "Plattenbausiedlung",
        monthlyRent: 380,
        roommates: []
    },
    goals: {
        shortTermGoal: "Sich heute Nacht beweisen – egal wie",
        longTermGoal: "Anführer der Gang werden",
        coreValue: "Respekt",
        moralCode: "Gang über alles. Schwäche ist Tod.",
        wouldKillFor: ["Respekt", "Gangmitglieder", "Territorium"],
        wouldDieFor: ["Gang", "Mutter"]
    },
    conditions: [
        {
            condition: "ptsd",
            severity: 0.55,
            isMedicated: false,
            triggerConditions: ["Schüsse", "Blut", "Freunde in Gefahr"]
        }
    ],
    addiction: [
        {
            substance: "Cannabis",
            dependencyLevel: 0.4,
            daysSinceLastUsed: 0,
            withdrawalSeverity: 0.1,
            triggeredBy: ["Langeweile", "Stress"]
        }
    ]
};

// ============================================================
// HAUPTPROGRAMM
// ============================================================

const agents = [viktor, lena, karim];

async function main() {
    console.log("=== THE HUMAN SANDBOX – Multi-Agent Test ===\n");

    const ollamaOnline = await checkOllamaConnection();
    if (!ollamaOnline) {
        console.error("Ollama nicht erreichbar.");
        return;
    }
    console.log("Ollama ist online.\n");
    console.log("Drei Agenten in derselben Umgebung. Jeder entscheidet für sich.\n");
    console.log("=".repeat(60) + "\n");

    for (const agent of agents) {
        console.log(`AGENT: ${agent.name.toUpperCase()} (${agent.age}, ${agent.gender})`);
        console.log("-".repeat(40));

        const trigger = checkThresholds(agent);

        if (!trigger.shouldTrigger) {
            console.log("Kein kritischer Schwellenwert – kein Trigger.\n");
            continue;
        }

        console.log(`Trigger: ${trigger.reason}`);
        console.log(`Dringlichkeit: ${trigger.urgency}\n`);

        const ctx: LLMPromptContext = {
            agent,
            environment,
            triggerReason: trigger.reason
        };

        console.log("Anfrage läuft...\n");

        const decision = await requestDecision(ctx);

        console.log(`Aktion:          ${decision.action}`);
        console.log(`Ziel:            ${decision.target ?? "—"}`);
        console.log(`Emotional:       ${decision.emotionalState}`);
        console.log(`Risiko:          ${decision.riskLevel}`);
        console.log(`Erwogen:         ${decision.alternativeConsidered ?? "—"}`);
        console.log(`\nMonolog: "${decision.reasoning}"`);
        console.log("\n" + "=".repeat(60) + "\n");
    }
}

main().catch(console.error);