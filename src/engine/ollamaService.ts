import type {Agent, AgentDecision, LLMPromptContext} from "../types/agent.ts";
import {buildSystemPrompt, buildUserPrompt, parseDecision, checkThresholds} from "./promptGenerator.ts";


const OLLAMA_BASE_URL = "http://localhost:11434"
const DEFAULT_MODEL = "dolphin-llama3"
const MAX_RETRIES = 3

async function callOllama(messages: {
    role: "system" | "user" | "assistant",
    content: string
}[], model: string = DEFAULT_MODEL): Promise<string> {
    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                stream: false,
                format: "json"
            })
        });
        if (!response.ok) {
            throw new Error(`Ollama API Fehler: ${response.status} ${response.statusText}`);
        }
        const data = await response.json() as { message: { content: string } };

        return data.message.content;
    } catch (err) {
        console.error("Fehler beim aufrufen von Ollama:", err)
        throw err;
    }
}

export async function requestDecision(ctx: LLMPromptContext): Promise<AgentDecision> {
    const messages = [{role: "system", content: buildSystemPrompt()}, {role: "user", content: buildUserPrompt(ctx)}]
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const rawResponse = await callOllama(messages);
            const decision = parseDecision(rawResponse)

            if (decision) {
                return decision
            }
            console.warn(`Versuch ${i + 1} fehlgeschlagen: Ungültiges JSON-Format.`)
        } catch (error) {
            console.error(`Fehler in requestDecision bei Versuch ${i + 1}:`, error);
        }
    }
    console.error("Maximale Versuche erreicht. Fallback auf 'idle' Entscheidung.");
    return {
        action: "idle",
        target: "nichts",
        reasoning: "Nach mehreren Fehlversuchen der KI wurde eine Ruhepause erzwungen, um die Simulation stabil zu halten.",
        emotionalState: "unbekannt",
        riskLevel: 0,
        alternativeConsidered: "weiterhin versuchen zu handeln"
    };
}

export async function checkOllamaConnection(): Promise<boolean> {
    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
            method: "GET",
        })

        return response.ok;
    } catch (err) {
        return false;
    }
}