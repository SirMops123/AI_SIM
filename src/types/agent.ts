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
    | "sadistic"
    | "masochistic"
    | "vindictive"
    | "nihilistic"
    | "manipulative"
    | "deceitful"
    | "volatile"
    | "cruel"
    | "obsessive"
    | "predatory"
    | "jealous"
    | "romantic"
    | "flirtatious"
    | "possessive"
    | "submissive"
    | "dominant"
    | "codependent"
    | "people_pleasing"
    | "attention_seeking"
    | "righteous"
    | "hypocritical"
    | "opportunistic"
    | "principled"
    | "corrupt"
    | "self_righteous"
    | "dissociative"
    | "delusional"
    | "narcissistic"
    | "borderline"
    | "avoidant"
    | "dependent"
    | "disciplined"
    | "patient"
    | "curious"
    | "creative"
    | "stoic"
    | "adaptable"
    | "humorous"
    | "nostalgic"
    | "spiritual"
    | "idealistic"
    | "pessimistic"
    | "optimistic";

export type Skill =
    | "stealth"
    | "persuasion"
    | "combat"
    | "theft"
    | "medicine"
    | "crafting"
    | "survival"
    | "hacking"
    | "seduction"
    | "intimidation"
    | "leadership"
    | "manipulation"
    | "acting"
    | "negotiation"
    | "networking"
    | "teaching"
    | "driving"
    | "cooking"
    | "gambling"
    | "lockpicking"
    | "weapons_handling"
    | "explosives"
    | "forging"
    | "pickpocketing"
    | "investigation"
    | "psychology"
    | "law"
    | "chemistry"
    | "engineering"
    | "streetwise"
    | "athletics"
    | "endurance"
    | "climbing"
    | "swimming"
    | "shooting"
    | "martial_arts";

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

export type ConditionType =
    | "depression"
    | "bipolar"
    | "dysthymia"
    | "cyclothymia"
    | "generalized_anxiety"
    | "panic_disorder"
    | "social_anxiety"
    | "ptsd"
    | "ocd"
    | "specific_phobia"
    | "borderline_personality"
    | "narcissistic_personality"
    | "antisocial_personality"
    | "paranoid_personality"
    | "schizoid_personality"
    | "histrionic_personality"
    | "schizophrenia"
    | "schizoaffective"
    | "brief_psychotic"
    | "alcohol_dependency"
    | "drug_dependency"
    | "gambling_addiction"
    | "sex_addiction"
    | "adhd"
    | "autism_spectrum"
    | "dissociative_identity"
    | "eating_disorder"
    | "impulse_control_disorder";

export type SexualOrientation =
    | "heterosexual"
    | "homosexual"
    | "bisexual"
    | "pansexual"
    | "asexual"
    | "demisexual"

export interface MentalCondition {
    condition: ConditionType;
    severity: number; // 0 - 1 schweregrad
    isMedicated: boolean;
    triggerConditions: string[];
}

export interface Addiction {
    substance: string;
    dependencyLevel: number; // 0-1
    daysSinceLastUsed: number;
    withdrawalSeverity: number; // 0-1
    triggeredBy: string[]; //liste von situationen die Sucht auslösen
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
    cashOnHand:number;
    weapons: string[];
    tools: string[];
    drugs: string[];
    valuables: number;
}


export interface AgentMemory {
    recentEvents: string[];
    traumaticEvents: string[];
    currentGoal?: string;
    currentFear?: string;
}

export interface AgentBody {
    height: number; // in cm
    weight: number; // in kg
    fitnessLevel: number; // 0 - 1
    attractiveness: number; // 0 - 1
    visibleScars: boolean;
    visibleTattos: boolean;
    disabilities: string[];
    chronicConditions: string[];
    lastSlept: number;
    lastAte: number;
}


export interface Agent {
    id: string;
    name: string;
    age: number;
    gender: "male" | "female" | "other";
    backstory: string;
    traits: Trait[];
    skills: Partial<Record<Skill, number>>
    stats: AgentStats;
    economics: AgentEconomics;
    inventory: AgentInventory;
    relations: AgentRelations;
    memory: AgentMemory;
    isOutside: boolean;
    sexualOrientation: SexualOrientation;
    libido: number; // 0 - 1
    lastIntimateContact: number;
    body: AgentBody;
    family: AgentFamily;
    housing: AgentHousing;
    goals: AgentGoals;
    conditions?: MentalCondition[];
    addiction?: Addiction[];

}

export interface KnownAgent extends Partial<Agent> {
    id: string;
    name: string;
    gender: "male" | "female" | "other";
    romanticHistory: "none" | "childhood_crush" | "crush" | "dated_briefly" | "relationship" | "longterm_relationship" | "heartbreak" | "affair" | "abusive_past"
    currentRomanticStatus: "none" | "attracted" | "dating" | "engaged" | "married" | "seperated" | "divorced" | "complicated"
    sexualAttraction: number // -1 - 1
    trustLevel: number; // -1 = suspicious 0 = unknown 1 = trusted
    jelousyLevel: number; // 0 - 1
    powerDynamic: "equal" | "dominant" | "submissive"
    sharedTrauma: boolean
    hasChildrenWith: boolean;
    owedFavor: boolean;
    desireToImpress: number; // 0 - 1
    relationshipType: RelationshipType;
}

export interface AgentFamily {
    hasParents: boolean;
    parentRelationship: "good" | "estranged" | "abusive" | "deceased"
    hasSiblings: boolean;
    partner?: KnownAgent
    children?: KnownAgent[];
}

export interface AgentHousing {
    housingStatus: "homeless" | "shelter" | "renting" | "owning" | "squatting" | "couch_surfing"
    district: string;
    monthlyRent: number;
    daysUntilEviction?: number;
    roommates: KnownAgent[]
}

export interface AgentGoals {
    shortTermGoal: string;
    longTermGoal: string;
    coreValue: string
    moralCode: string
    wouldKillFor: string[];
    wouldDieFor: string[];
}

export interface AgentRelations {
    knownAgents: KnownAgent[];
    gangId?: string;
    reputation: number; // -1 = wanted 0 = doesnt matter 1 = popular
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
    inventory?: Partial<AgentInventory>
}

export interface SimulationEnvironment {
    tick: number;
    timeOfDay: TimeOfDay;
    weather: Weather;
    temperature: number;
    district: string;
    crimeRate: number; // 0 = no crimes 1 = very criminal
    policePresence: number; // 0 = no police 1 = highly alarmed police
    nearbyAgents: NearbyAgent[];
    nearbyObjects: EnvironmentObject[]
    activeEvents: string[]
}


export interface NearbyAgent {
    id?: string;
    name: string;
    age: number;
    gender: "male" | "female" | "other";
    visibleWeapon: boolean;
    attitude: "friendly" | "neutral" | "hostile"
    bodyLanguage: "aggressive" | "nervous" | "calm" | "drunk" | "crying" | "threatening" | "threatened"
    isKnownToAgent: boolean;
    apparentHealth: "healthy" | "injured" | "dying"
    apparentWealthLevel: "homeless" | "poor" | "middle" | "wealthy"
    groupSize: number;
    isDistracted: boolean;
}

export interface AgentDecision {
    action: string;
    target?: string;
    reasoning: string;
    emotionalState: string;
    riskLevel: number; // 0 = no risk 1 = high risk
    alternativeConsidered?: string;
}

export interface LLMPromptContext {
    agent: Agent;
    environment: SimulationEnvironment;
}

export interface TriggerResult {
    shouldTrigger: boolean;
    reason: string;
    urgency: number // 0 - 1
    type: "crisis" | "desire" | "social" | "ambition"
    category: "survival" | "addiction" | "mental" | "economic" | "housing" | "romantic" | "biological" | "social" | "ambition"
}

