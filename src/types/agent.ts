

export type Trait =
    | "impulsive"
    | "calculating"
    | "empathetic"
    | "ruthless"
    | "cowardly"
    | "brave"
    | "greedy"
    | "altruistic"
    | "paranoid"
    | "charismatic"
    | "antisocial"
    | "loyal"

export type Skill =
    | "stealth"
    | "persuasion"
    | "combat"
    | "theft"
    | "medicine"
    | "crafting"
    | "survival"
    | "hacking"

export type RelationshipType =
    | "stranger"
    | "acquaintance"
    | "friend"
    | "enemy"
    | "family"
    | "gang_member";

export type Weather =
    | "clear"
    | "rain"
    | "storm"
    | "snow"
    | "heatwave"

export type TimeOfDay =
    | "dawn"
    | "morning"
    | "noon"
    | "afternoon"
    | "evening"
    | "night"
    | "deep_night"


export interface AgentStats {
    hunger: number; // 0 = full 1 = starving
    thirst: number; // 0 = full 1 = very thirsty
    fatigue: number; // 0 = awake 1 = very tired
    stress: number; // 0 = chill 1 = stressed out
    pain: number; // 0 = no pain 1 = in great pain
    morale: number; // 0 = hopeless 1 = euphoric
    health: number; // 0 = almost dead 1 = healthy
    intoxication: number // 0 = sober // 1 = high
}

export interface AgentEconomics {
    cash: number;
    debt: number;
    hasJob: boolean;
    jobSatisfaction: number; // 0 = unsatisfied 1 = satisfied
    daysSinceIncome: number;
}

export interface AgentInventory {
    food: number;
    water: number;
    weapons: string[];
    tools: string[];
    drugs: string[];
    valuables: number;
}

export interface KnownAgent {
    id: string;
    trustLevel: number; // -1 = suspicious 0 = unknown 1 = trusted
    relationshipType: RelationshipType;
}

export interface AgentRelations {
    knownAgents: KnownAgent[];
    gangId?: string;
    reputation: number; // -1 = wanted 0 = doesnt matter 1 = popular
}

export interface AgentMemory {
    recentEvents: string[];
    traumaticEvents: string[];
    currentGoal?: string;
    currentFear?: string;
}

export interface Agent {
    id: string;
    name: string;
    age: number;
    gender: "male" | "female" | "other";
    backstory: string;
    traits: Trait[];
    skills: Partial<Record<Skill,number>>
    stats: AgentStats;
    economics: AgentEconomics;
    inventory: AgentInventory;
    relations: AgentRelations;
    memory: AgentMemory;
    isOutside: boolean;
}

export interface EnvironmentObject {
    id: string;
    type: string;
    label: string;
    isLocked: boolean;
    isOccupied: boolean;
    hasOwner: boolean;
    ownerId?: string;
    value: number;
    properties: Record<string, unknown>
}

export interface SimulationEnvironment {
    tick: number;
    timeOfDay: TimeOfDay;
    weather: Weather;
    temperature: number;
    district: string;
    crimeRate: number; // 0 = no crimes 1 = very criminal
    policePresence: number; // 0 = no police 1 = highly alarmed police
    nearbyAgents: {agentId: string;
    distance: number;
    attitude: "friendly" | "neutral" | "hostile"}[]
    nearbyObjects: EnvironmentObject[]
    activeEvents: string[]
}

export interface AgentDecision {
    action: string;
    target?: string;
    reasoning: string;
    emotionalState: string;
    riskLevel: number; // 0 = no risk 1 = high risk
    alternativeConsidered?: string;
}

export interface LLMPromptContext{
    agent: Agent;
    environment: SimulationEnvironment;
    triggerReason: string;
}
