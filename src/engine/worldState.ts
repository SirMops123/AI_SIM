import type {Agent, SimulationEnvironment} from "../types/agent.ts";

export class WorldState {
    agents: Map<string, Agent> = new Map();
    environment: SimulationEnvironment;
    tick: number = 0;

    constructor(initialAgents: Agent[], environment: SimulationEnvironment) {
        initialAgents.forEach(agent => this.agents.set(agent.id, agent));
        this.environment = environment;
    }

    getAgent(id: string): Agent | undefined {
        return this.agents.get(id)
    }

    updateAgent(agent: Agent): void {
        this.agents.set(agent.id, agent);
    }

    removeAgent(id: string): void {
        this.agents.delete(id);
    }

    getAllAgents(): Agent[] {
        return [...this.agents.values()];
    }

    incrementTick(): void {
        this.tick += 1
        this.environment.tick = this.tick
    }

    transferItem(fromId: string, toId: string, item: "food" | "water" | "valuables" | "money" | "weapon" | "tool" | "drug" | "cashOnHand", amount: number, itemName?: string): void {
        const from = this.getAgent(fromId);
        const to = this.getAgent(toId);

        if (!from || !to) return;

        if (item === "money") {
            if (from.economics.cash >= amount) {
                from.economics.cash -= amount;
                to.economics.cash += amount;
            }
            return;
        }

        const numericItems = ["food", "water", "valuables","cashOnHand"] as const;
        if ((numericItems as readonly string[]).includes(item)) {
            const key = item as typeof numericItems[number];
            if (from.inventory[key] >= amount) {
                from.inventory[key] -= amount;
                to.inventory[key] += amount;
            }
            return;
        }

        if (itemName) {
            const listKeyMap = {weapon: "weapons", tool: "tools", drug: "drugs"} as const;
            const listKey = listKeyMap[item as keyof typeof listKeyMap];

            if (listKey && from.inventory[listKey].includes(itemName)) {
                from.inventory[listKey] = from.inventory[listKey].filter(i => i !== itemName);
                to.inventory[listKey].push(itemName);
            }
        }
    }

    getNearbyAgentObject(): Agent[] {
        return this.environment.nearbyAgents
            .map(agent => agent.id ? this.getAgent(agent.id) : undefined)
            .filter((agent): agent is Agent => agent !== null && agent !== undefined);
    }
}