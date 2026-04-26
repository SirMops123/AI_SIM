import type { Agent, AgentDecision, LLMPromptContext } from "../types/agent.ts";
import { buildSystemPrompt, buildUserPrompt, parseDecision, checkThresholds } from "./promptGenerator.ts";


const OLLAMA_BASE_URL = "http://localhost:11434"
const DEFAULT_MODEL = "dolphin-llama3"
const MAX_RETRIES = 3

async function callOllama(messages:{role: "system" | "user" | "assistant", content: string}[], model:string = DEFAULT_MODEL):Promise<string> {
    try{
        const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                stream:false,
                format: "json"
            })
        });
        if(!response.ok){
            throw new Error(`Ollama API Fehler: ${response.status} ${response.statusText}`);
        }
        const data = await response.json() as {message: {content: string}};

        return data.message.content;
    }catch(err){
        console.error("Fehler beim aufrufen von Ollama:",err)
        throw err;
    }
}
export async function requestDecision(promptContext:LLMPromptContext): Promise<AgentDecision> {}