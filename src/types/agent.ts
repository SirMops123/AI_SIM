

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
    hunger: number;
    thirst: number;
    fatigue: number;
    stress: number;
    pain: number;
    morale: number;
    health: number;
    intoxication: number;
}

export interface AgentEconomics {
    cash: number;
    debt: number;
    hasJob: boolean;
    jobSatisfaction: number;
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
    trustLevel: number;
    relationshipType: RelationshipType;
}

export interface AgentRelations {
    knownAgents: KnownAgent[];
    gangId?: string;
    reputation: number;
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
    crimeRate: number;
    policePresence: number;
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
    riskLevel: number;
    alternativeConsidered?: string;
}

export interface LLMPromptContext{
    agent: Agent;
    environment: SimulationEnvironment;
    triggerReason: string;
}
