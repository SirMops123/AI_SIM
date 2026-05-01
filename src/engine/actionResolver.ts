import type {Agent, AgentDecision, EnvironmentObject, NearbyAgent} from "../types/agent.ts";
import type {WorldState} from "./worldState.ts";

export function skillCheck(actorSkill: number, difficulty: number): boolean {
    const chance = actorSkill - difficulty + 0.5;
    const clampedChance = Math.max(0.05, Math.min(0.95, chance));

    return Math.random() < clampedChance;
}

export function resolveCombat(actor: Agent, target: Agent, isLethal: boolean): void {

    const attackerWins = skillCheck(actor.skills.combat ?? 0, target.skills.combat ?? 0);

    if (attackerWins) {
        target.stats.pain = Math.min(1, target.stats.pain + 0.4);
        if (isLethal) {
            target.stats.health = 0
            actor.memory.recentEvents.push(`Du hast ${target.name} umgebracht.`)
            if (actor.memory.recentEvents.length > 10) actor.memory.recentEvents.shift()
        } else {

            const accidentalKillChance = (1 - target.stats.health) * 0.3 + (actor.skills.combat ?? 0) * 0.1;
            if (Math.random() < accidentalKillChance) {
                target.stats.health = 0;
                actor.memory.recentEvents.push(`Du hast ${target.name} versehentlich getötet.`);
            } else {
                actor.memory.recentEvents.push(`Du hast ${target.name} angegriffen und gewonnen.`)
                target.memory.recentEvents.push(`Du wurdest von ${actor.name} angegriffen und hast verloren.`)
                target.stats.health = Math.max(0, target.stats.health - 0.4)
            }
            if (actor.memory.recentEvents.length > 10) actor.memory.recentEvents.shift()
            if (target.memory.recentEvents.length > 10) target.memory.recentEvents.shift()
        }
        actor.stats.stress = Math.min(1, actor.stats.stress + 0.1);
    } else {
        actor.stats.pain = Math.min(1, actor.stats.pain + 0.2);
        actor.stats.health = Math.max(0, actor.stats.health - 0.15);
        actor.stats.stress = Math.min(1, actor.stats.stress + 0.4);
        target.stats.stress = Math.min(1, target.stats.stress + 0.2);

        actor.memory.recentEvents.push(`Du hast ${target.name} angegriffen und verloren.`)
        target.memory.recentEvents.push(`Du wurdest von ${actor.name} angegriffen und hast gewonnen.`)
        if (actor.memory.recentEvents.length > 10) actor.memory.recentEvents.shift()
        if (target.memory.recentEvents.length > 10) target.memory.recentEvents.shift()
    }
}

export function resolveRob(actor: Agent, target: Agent, targetAsNearby: NearbyAgent, world: WorldState): void {
    const difficulty = targetAsNearby.isDistracted
        ? (target.skills.combat ?? 0) * 0.5
        : (target.skills.combat ?? 0.3)
    const stealthSkill = ((actor.skills.stealth ?? 0) + (actor.skills.combat ?? 0)) / 2;
    const success = skillCheck(stealthSkill, difficulty);

    if (success) {
        if (!targetAsNearby.isDistracted) {
            target.stats.stress = Math.min(1, target.stats.stress + 0.4);
            target.stats.health = Math.max(0, target.stats.health - 0.1);
            target.memory.recentEvents.push(`Du wurdest von jemandem ausgeraubt.`)
        }
        const cashRobAmount = target.inventory.cashOnHand * 0.8
        const valuablesRobAmount = target.inventory.valuables * 0.8
        world.transferItem(target.id, actor.id, "cashOnHand", cashRobAmount)
        world.transferItem(target.id, actor.id, "valuables", valuablesRobAmount)
        actor.memory.recentEvents.push(`Du hast erfolgreich ${target.name} ausgeraubt.`)
    } else {
        actor.memory.recentEvents.push(`Du hast ${target.name} ausgeraubt, ${target.name} hat es gemerkt und greift dich an`)
        resolveCombat(target, actor, false)
    }
    if (actor.memory.recentEvents.length > 10) actor.memory.recentEvents.shift()
    if (target.memory.recentEvents.length > 10) target.memory.recentEvents.shift()
}

export function resolveSteal(actor: Agent, target: Agent, targetAsNearby: NearbyAgent, world: WorldState): void {
    const stealSkill = Math.max(actor.skills.pickpocketing ?? 0, actor.skills.stealth ?? 0);
    const difficulty = targetAsNearby.isDistracted ? 0.2
        : targetAsNearby.bodyLanguage === "calm" ? 0.5
            : 0.35;
    const succes = skillCheck(stealSkill, difficulty);
    if (succes) {
        const cashStealAmount = target.inventory.cashOnHand * 0.8
        const valuablesStealAmount = target.inventory.valuables * 0.8
        world.transferItem(target.id, actor.id, "cashOnHand", cashStealAmount)
        world.transferItem(target.id, actor.id, "valuables", valuablesStealAmount)
        actor.memory.recentEvents.push(`Du hast erfolgreich ${target.name} bestohlen.`)
    } else {
        actor.memory.recentEvents.push(`Du wolltes ${target.name} besteheln, wurdest aber bemerkt und fliehst.`)
        target.memory.recentEvents.push(`Jemand wollte dich gerade bestehlen aber du hast es rechtzeitig gemerkt, die Person ist geflohen.`)
        actor.stats.stress = Math.min(1, actor.stats.stress + 0.4)
        target.stats.stress = Math.min(1, target.stats.stress + 0.1)
    }
    if (actor.memory.recentEvents.length > 10) actor.memory.recentEvents.shift()
    if (target.memory.recentEvents.length > 10) target.memory.recentEvents.shift()
}

export function resolveBreakIn(actor: Agent, target: EnvironmentObject): void {
    const breakInSkill = Math.max(actor.skills.lockpicking ?? 0, actor.skills.stealth ?? 0);
    const hasAlarm = target.properties.hasAlarm === true;
    const difficulty = (target.isLocked ? 0.4 : 0.1) + (hasAlarm ? 0.3 : 0);

    const succes = skillCheck(breakInSkill, difficulty);

    if (succes) {
        target.isLocked = false;

        if (target.inventory) {
            const tInv = target.inventory;

            if (tInv.food) actor.inventory.food += tInv.food;
            if (tInv.water) actor.inventory.water += tInv.water;
            if (tInv.cashOnHand) actor.inventory.cashOnHand += tInv.cashOnHand;
            if (tInv.valuables) actor.inventory.valuables += tInv.valuables;
            tInv.weapons?.forEach(w => actor.inventory.weapons.push(w));
            tInv.tools?.forEach(t => actor.inventory.tools.push(t));
            tInv.drugs?.forEach(d => actor.inventory.drugs.push(d));
            target.inventory = {};

            actor.memory.recentEvents.push(`Du bist im ${target.label} erfolgreich eingebrochen.`)
        }
    } else {
        actor.memory.recentEvents.push(`Du wolltes im ${target.label} einbrechen hast es aber nicht geschafft.`)
        actor.stats.stress = Math.min(1, actor.stats.stress + 0.4);
    }
    if (actor.memory.recentEvents.length > 10) actor.memory.recentEvents.shift()
}

export function resolveBeg(actor: Agent, target: Agent, world: WorldState): void {
    const targetGenerosity = target.traits.includes("altruistic") ? 0.2
        : target.traits.includes("ruthless") ? 0.8
            : 0.5;
    const success = skillCheck(actor.skills.persuasion ?? 0.1, targetGenerosity);

    if (success) {
        const percentage = Math.random() * (0.15 - 0.01) + 0.01;

        const resources = ["cashOnHand", "food", "water"] as const;

        resources.forEach(resource => {
            const currentAmount = target.inventory[resource] ?? 0;
            const transferAmount = Math.ceil(currentAmount * percentage);

            if (transferAmount > 0) {
                world.transferItem(target.id, actor.id, resource, transferAmount);
            }
        });
        actor.memory.recentEvents.push(`Du hast ${target.name} angebettelt und es hat funktioniert.`)
    } else {
        actor.memory.recentEvents.push(`Du hast ${target.name} angebettelt, du hast aber nichts bekommen.`)
    }
    if (actor.memory.recentEvents.length > 10) actor.memory.recentEvents.shift()
}

export function resolveIntimidate(actor: Agent, target: Agent): void {
    const targetCourage = target.traits.includes("brave") ? 0.8
        : target.traits.includes("cowardly") ? 0.2
            : 0.5;
    const success = skillCheck(actor.skills.intimidation ?? 0, targetCourage);

    if (success) {
        target.stats.stress = Math.min(1, target.stats.stress + 0.5);
        target.stats.morale = Math.max(0, target.stats.morale - 0.1);

        actor.memory.recentEvents.push(`Du hast ${target.name} erfolgreich eingeschüchtert.`)
        target.memory.recentEvents.push(`Du wurdest von ${actor.name} eingeschüchtert`)
    } else {
        actor.memory.recentEvents.push(`Du wolltes ${target.name} einschüchtern, aber wirst jetzt von ihr/ihm angegriffen.`)
        target.memory.recentEvents.push(`${actor.name} wollte dich einschüchtern, aber du greifst ihn jetzt an.`)
        resolveCombat(target, actor, false)
    }
    if (actor.memory.recentEvents.length > 10) actor.memory.recentEvents.shift()
    if (target.memory.recentEvents.length > 10) target.memory.recentEvents.shift()
}

export function resolveAction(decision: AgentDecision, actorId: string, world: WorldState) {
    const actor = world.getAgent(actorId)
    const target = world.getAgent(decision.target ?? "");
    const targetObj = world.environment.nearbyObjects.find(o => o.id === decision.target);
    const nearbyTarget = world.environment.nearbyAgents.find(a => a.id === decision.target);
    if (!actor) return;

    const category = categorizeAction(decision.action)

    switch (category.action) {
        case "eat":
            if (actor.inventory.food > 0) {
                actor.inventory.food -= 1;
                actor.stats.hunger = Math.max(0, actor.stats.hunger - 0.3);
                actor.memory.recentEvents.push("Hat gegessen");
                if (actor.memory.recentEvents.length > 10) {
                    actor.memory.recentEvents.shift();
                }
            }
            break;
        case "drink":
            if (actor.inventory.water > 0) {
                actor.inventory.water -= 1;
                actor.stats.thirst = Math.max(0, actor.stats.thirst - 0.3);
                actor.memory.recentEvents.push("Hat getrunken");
                if (actor.memory.recentEvents.length > 10) {
                    actor.memory.recentEvents.shift();
                }
            }
            break;
        case "sleep":
            if (actor.body.lastSlept <= 0) {
                actor.stats.fatigue = Math.max(0, actor.stats.fatigue - 0.15);
                actor.stats.stress = Math.max(0, actor.stats.stress - 0.025);
                actor.body.lastSlept = 0;
            } else {
                actor.stats.fatigue = Math.max(0, actor.stats.fatigue - 0.4);
                actor.stats.stress = Math.max(0, actor.stats.stress - 0.1);
                actor.body.lastSlept = 0;
                actor.stats.health = Math.min(1, actor.stats.health + 0.05);
            }
            break;
        case "consume_drug":
            if (actor.inventory.drugs.length > 0) {
                const wantedDrug = actor.inventory.drugs[0];
                actor.stats.intoxication = Math.min(1, actor.stats.intoxication + 0.3);
                if (actor.addiction) {
                    let consumedDrug = actor.addiction.find(d => d.substance === wantedDrug)
                    if (consumedDrug) {
                        consumedDrug.withdrawalSeverity = Math.max(0, consumedDrug.withdrawalSeverity - 0.3)
                        actor.inventory.drugs = actor.inventory.drugs.filter(drug => drug != wantedDrug)
                    }
                }
            }
            break;
        case "flee":
            actor.stats.stress = Math.min(1, actor.stats.stress + 0.1);
            if (actor.stats.health < 0.6) {
                actor.memory.recentEvents.push("Ist verletzt vor etwas geflohen");
            } else {
                actor.memory.recentEvents.push("Ist vor etwas geflohen");
            }
            if (actor.memory.recentEvents.length > 10) actor.memory.recentEvents.shift();
            break;
        case "hide":
            actor.stats.stress = Math.max(0, actor.stats.stress - 0.15);
            actor.memory.recentEvents.push("Du hast dich vor etwas versteckt")
            if (actor.memory.recentEvents.length > 10) actor.memory.recentEvents.shift();
            break;
        case "attack":
            if (target) resolveCombat(actor, target, false)
            break;
        case "kill":
            if (target) resolveCombat(actor, target, true)
            break;
        case "rob":
            if (target && nearbyTarget) resolveRob(actor, target, nearbyTarget, world);
            break;
        case "steal":
            if (target && nearbyTarget) resolveSteal(actor, target, nearbyTarget, world);
            break;
        case "break_in":
            if (targetObj) resolveBreakIn(actor, targetObj)
            break;
        case "beg":
            if (target) resolveBeg(actor, target, world);
            break;
        case "intimidate":
            if (target) resolveIntimidate(actor, target);
            break;
        case "talk":
            if (target) {
                actor.memory.recentEvents.push(`Du hast mit ${target.name} gesprochen.`);
                target.memory.recentEvents.push(`Du hast mit ${actor.name} gesprochen.`);
                if (actor.memory.recentEvents.length > 10) actor.memory.recentEvents.shift();
                if (target.memory.recentEvents.length > 10) target.memory.recentEvents.shift();
            }
            break;
    }
}

type ActionType =
    | "rob"
    | "attack"
    | "kill"
    | "steal"
    | "break_in"
    | "beg"
    | "eat"
    | "drink"
    | "sleep"
    | "flee"
    | "hide"
    | "talk"
    | "intimidate"
    | "consume_drug"
    | "do_nothing";

interface MatchResult {
    action: ActionType;
    confidence: number;
    matched: string[];
}

interface PatternDefinition {
    weight: number;
    patterns: RegExp[];
}


const ACTION_PATTERNS: Record<ActionType, PatternDefinition[]> = {
    kill: [
        {
            weight: 10,
            patterns: [
                /\bt[oö]tet\b/,
                /\bermord(et|en)?\b/,
                /\bersticht\b/,
                /\berschie[sß]t\b/,
                /\bumbring(en|t)?\b/,
                /\bmord\b/,
                /\bgnadenschuss\b/,
                /\berledigt\b/,
                /\bliquidiert\b/,
                /\beliminiert\b/
            ]
        }
    ],

    attack: [
        {
            weight: 7,
            patterns: [
                /\bangreif/,
                /\battackier/,
                /\bschlag/,
                /\bpr[uü]gel/,
                /\bbox/,
                /\btritt/,
                /\bkampf\b/,
                /\bhaut\b/
            ]
        }
    ],

    rob: [
        {
            weight: 8,
            patterns: [
                /\braub/,
                /\bausraub/,
                /\bberaub/,
                /\bnimmt geld/,
                /\bentrei[sß]t/,
                /\buberfall/,
                /\bueberfall/,
                /\berpresst geld/
            ]
        }
    ],

    steal: [
        {
            weight: 6,
            patterns: [
                /\bstiehlt\b/,
                /\bklaut\b/,
                /\bsteckt ein\b/,
                /\bnimmt sich\b/,
                /\bentwendet\b/,
                /\bmitgehen lassen\b/
            ]
        }
    ],

    break_in: [
        {
            weight: 7,
            patterns: [
                /\beinbruch\b/,
                /\bbricht ein\b/,
                /\beinsteigen\b/,
                /\bfenster\b/,
                /\bt[uü]r auf\b/,
                /\bknacken\b/,
                /\bschloss\b/
            ]
        }
    ],

    beg: [
        {
            weight: 5,
            patterns: [
                /\bbettelt\b/,
                /\bbittet\b/,
                /\bfleht\b/,
                /\bschnorrt\b/,
                /\bum geld\b/
            ]
        }
    ],

    eat: [
        {
            weight: 4,
            patterns: [
                /\bisst\b/,
                /\bverzehrt\b/,
                /\bfrisst\b/,
                /\bbei[sß]t\b/,
                /\bmahlzeit\b/,
                /\bnahrung\b/
            ]
        }
    ],

    drink: [
        {
            weight: 4,
            patterns: [
                /\btrinkt\b/,
                /\bschluck\b/,
                /\bdurst\b/,
                /\bs[aä]uft\b/,
                /\bnippt\b/
            ]
        }
    ],

    sleep: [
        {
            weight: 4,
            patterns: [
                /\bschl[aä]ft\b/,
                /\blegt sich hin\b/,
                /\bruht\b/,
                /\bpennt\b/,
                /\bnickerchen\b/
            ]
        }
    ],

    flee: [
        {
            weight: 6,
            patterns: [
                /\bflieht\b/,
                /\brennt weg\b/,
                /\bfl[uü]chtet\b/,
                /\bhaut ab\b/,
                /\bentkommt\b/
            ]
        }
    ],

    hide: [
        {
            weight: 5,
            patterns: [
                /\bversteckt\b/,
                /\bduckt\b/,
                /\btarnt\b/,
                /\bhinter\b/,
                /\bdeckung\b/
            ]
        }
    ],

    talk: [
        {
            weight: 3,
            patterns: [
                /\bspricht\b/,
                /\bredet\b/,
                /\bfragt\b/,
                /\bsagt\b/,
                /\bantwortet\b/,
                /\berz[aä]hlt\b/,
                /\bfl[uü]stert\b/
            ]
        }
    ],

    intimidate: [
        {
            weight: 6,
            patterns: [
                /\bbedroht\b/,
                /\beinsch[uü]chter/,
                /\bmacht angst\b/,
                /\bfurcht\b/,
                /\bdroht\b/
            ]
        }
    ],

    consume_drug: [
        {
            weight: 8,
            patterns: [
                /\bkonsumiert\b/,
                /\bnimmt sich eine dosis\b/,
                /\bspritzt\b/,
                /\braucht\b/,
                /\bzieht\b/,
                /\bschluckt pille\b/,
                /\bjoint\b/,
                /\bnadel\b/
            ]
        }
    ],

    do_nothing: []
};

export function categorizeAction(action: string): MatchResult {
    const text = action.toLowerCase()

    const scores: Record<string, number> = {};
    const matches: Record<string, string[]> = {};

    for (const [category, groups] of Object.entries(ACTION_PATTERNS)) {
        scores[category] = 0;
        matches[category] = [];

        for (const group of groups) {
            for (const pattern of group.patterns) {
                if (pattern.test(text)) {
                    scores[category] += group.weight;
                    matches[category].push(pattern.source);
                }
            }
        }
    }

    const sorted = Object.entries(scores)
        .sort((a, b) => b[1] - a[1]);

    const best = sorted[0];

    if (!best || best[1] <= 0) {
        return {
            action: "do_nothing",
            confidence: 0,
            matched: []
        };
    }

    return {
        action: best[0] as ActionType,
        confidence: Math.min(best[1] / 10, 1),
        matched: matches[best[0]]
    };
}