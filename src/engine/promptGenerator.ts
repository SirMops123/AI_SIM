import type {Agent} from "../types/agent.ts";
import type {AgentStats} from "../types/agent.ts";
import type {AgentEconomics} from "../types/agent.ts";
import type {SimulationEnvironment} from "../types/agent.ts";
import type {LLMPromptContext} from "../types/agent.ts";
import type {AgentDecision} from "../types/agent.ts";
import type {Trait} from "../types/agent.ts";


export function describeHunger(hunger: number): string {
    switch (true) {
        case hunger < 0.2:
            return "Dein Körper fühlt sich leicht und energiegeladen an; Essen ist gerade nur ein abstrakter Gedanke.";

        case hunger < 0.4:
            return "Ein leises, hohles Gefühl nistet sich in deiner Magengegend ein, aber noch lässt es sich leicht ignorieren.";

        case hunger < 0.6:
            return "Dein Magen zieht sich spürbar zusammen und ein dumpfes Grollen erinnert dich bei jeder Bewegung an deine Leere.";

        case hunger < 0.8:
            return "Ein stechender Kopfschmerz pocht hinter deinen Schläfen und deine Glieder fühlen sich schwer und zittrig an aufgrund von mangelnder Nahrung.";

        default:
            return "Brennende Krämpfe zerfressen deine Mitte. Deine Sicht verschwimmt und jeder Instinkt schreit nur noch nach Nahrung, egal um welchen Preis.";
    }
}

export function describeThirst(thirst: number): string {
    switch (true) {
        case thirst < 0.2:
            return "Dein Mund ist angenehm feucht und deine Stimme klar.";
        case thirst < 0.4:
            return "Ein klebriger Film legt sich auf deinen Gaumen; du schluckst öfter als gewöhnlich.";
        case thirst < 0.6:
            return "Deine Zunge fühlt sich pelzig an und dein Hals brennt bei jedem Atemzug.";
        case thirst < 0.8:
            return "Deine Lippen sind rissig und blutig. Das Schlucken fühlt sich an wie Sandpapier.";
        default:
            return "Deine Kehle ist wie zugeschnürt. Du keuchst nur noch und dein ganzer Körper bebt vor Durst.";
    }
}

export function describeFatigue(fatigue: number): string {
    switch (true) {
        case fatigue < 0.2:
            return "Dein Geist ist wach und deine Bewegungen sind präzise.";
        case fatigue < 0.4:
            return "Ein leichter Schleier legt sich über deine Konzentration; deine Augenlider werden schwer.";
        case fatigue < 0.6:
            return "Deine Glieder fühlen sich bleiern an. Du musst dich zwingen, den Fokus nicht zu verlieren.";
        case fatigue < 0.8:
            return "Sekundenschlaf reißt an deinem Bewusstsein. Die Welt um dich herum wird dumpf und fern.";
        default:
            return "Totale Erschöpfung. Dein Körper sackt in sich zusammen und dein Verstand schaltet einfach ab.";
    }
}

export function describeStress(stress: number): string {
    switch (true) {
        case stress < 0.2:
            return "Du bist vollkommen ruhig und hast die Lage unter Kontrolle.";
        case stress < 0.4:
            return "Dein Puls beschleunigt sich leicht; ein unangenehmes Kribbeln wandert deinen Nacken hoch.";
        case stress < 0.6:
            return "Deine Hände zittern minimal. Tunnelblick setzt ein und Geräusche wirken plötzlich zu laut.";
        case stress < 0.8:
            return "Dein Herz hämmert gegen deine Rippen. Kalter Schweiß bricht aus und deine Gedanken rasen ungeordnet.";
        default:
            return "Panik übernimmt. Dein Atem geht flach und stoßweise, während du nur noch den Drang zur Flucht spürst.";
    }
}

export function describePain(pain: number): string {
    switch (true) {
        case pain < 0.2:
            return "";
        case pain < 0.4:
            return "Ein pulsierender Schmerz pocht in deinen Nerven, lässt sich aber noch wegatmen.";
        case pain < 0.6:
            return "Ein scharfer, schneidender Schmerz raubt dir bei jeder Bewegung den Atem.";
        case pain < 0.8:
            return "Weiße Blitze schießen durch dein Sichtfeld. Du kannst einen Schrei kaum noch unterdrücken.";
        default:
            return "Ein alles verzehrendes Fegefeuer. Der Schmerz ist so absolut, dass dein Verstand nur noch schreien will.";
    }
}

export function describeMorale(morale: number): string {
    switch (true) {
        case morale < 0.2:
            return "Absolute Hoffnungslosigkeit. Du siehst keinen Sinn mehr in deinem Handeln.";
        case morale < 0.4:
            return "Ein schwerer Stein liegt auf deinem Herzen; du zweifelst an jedem deiner Schritte.";
        case morale < 0.6:
            return "Du bist distanziert und tust nur das Nötigste, um voranzukommen.";
        case morale < 0.8:
            return "Du verspürst einen Funken Entschlossenheit und glaubst an ein Ziel.";
        default:
            return "";
    }
}

export function describeIntoxication(intoxication: number): string {
    switch (true) {
        case intoxication < 0.2:
            return "Du bist vollkommen nüchtern und scharfinnig.";
        case intoxication < 0.4:
            return "Ein warmes, wohliges Gefühl breitet sich aus; die Kanten der Welt wirken weicher.";
        case intoxication < 0.6:
            return "Die Farben werden intensiver, aber deine Koordination beginnt merklich zu schwanken.";
        case intoxication < 0.8:
            return "Die Welt dreht sich im Kreis. Deine Sprache ist verwaschen und Distanzen sind schwer zu schätzen.";
        default:
            return "Vollkommener Kontrollverlust. Deine Sinne sind ein einziges Chaos aus Lichtern und Schatten.";
    }
}

export function buildPhysicalState(stats: AgentStats): string {
    let prompt: string[] = []

    prompt.push(describeHunger(stats.hunger))
    prompt.push(describeThirst(stats.thirst))
    prompt.push(describeFatigue(stats.fatigue))
    prompt.push(describePain(stats.pain))
    prompt.push(describeStress(stats.stress))
    prompt.push(describeMorale(stats.morale))
    prompt.push(describeIntoxication(stats.intoxication))

    return prompt.filter(str => str.trim().length > 0).join(" ")
}

export function buildEconomicContext(stats: AgentEconomics): string {
    let prompt: string[] = []
    const netWorth = stats.cash - stats.debt

    switch (true) {
        case netWorth <= -500:
            prompt.push("Die erdrückende Last deiner Schulden raubt dir den Atem; jede unvorhergesehene Ausgabe ist ein Urteil und die Welt scheint nur noch aus Sackgassen zu bestehen.")
            break;
        case netWorth < 0:
            prompt.push("Du stehst im Minus und das Wissen, dass du über deine Verhältnisse lebst, nagt bei jedem Kauf an deinem Gewissen.")
            break;
        case netWorth <= 50:
            prompt.push("Du jonglierst mit deinen letzten Münzen; ein einziger Fehltritt könnte dich in den Abgrund reißen, während du krampfhaft versuchst, den Kopf über Wasser zu halten.")
            break;
        case netWorth <= 500:
            prompt.push("Deine Finanzen sind solide; es gibt keinen Raum für Exzesse, aber du kannst nachts ruhig schlafen, ohne deine Ausgaben im Schlaf zu zählen.")
            break;
        case netWorth > 500:
            prompt.push("Ein seltenes Gefühl von Sicherheit durchströmt dich; du hast genug Puffer, um nicht nur zu überleben, sondern dein Leben aktiv zu gestalten.")
            break;
    }

    let combinedCaseTriggered = false;

    if (!stats.hasJob && netWorth < 0 && stats.daysSinceIncome > 7) {
        prompt.push("Du steckst in einer Abwärtsspirale aus Schulden und Arbeitslosigkeit; seit über einer Woche ist kein Cent mehr geflossen und ohne jede Perspektive fühlt sich jeder neue Tag wie ein Kampf gegen das Unvermeidliche an.")
        combinedCaseTriggered = true;
    } else if (stats.hasJob && netWorth < 0 && stats.jobSatisfaction < 0.3) {
        prompt.push("Obwohl du dich Tag für Tag durch eine Arbeit quälst, die du zutiefst verabscheust, landest du am Monatsende immer noch im Minus – ein erstickender Kreislauf aus Erschöpfung und finanzieller Hoffnungslosigkeit.")
        combinedCaseTriggered = true;
    } else if (stats.hasJob && netWorth > 500 && stats.jobSatisfaction > 0.7) {
        prompt.push("Es ist eine seltene Fügung: Dein Job erfüllt dich mit Stolz und dein finanzielles Polster gibt dir die Freiheit, erhobenen Hauptes und ohne Sorgen in die Zukunft zu blicken.")
        combinedCaseTriggered = true;
    }

    if (!combinedCaseTriggered) {
        switch (true) {
            case stats.daysSinceIncome >= 7:
                prompt.push("Eine Woche ohne Einkommen. Die Stille auf deinem Konto wird langsam ohrenbetäubend.")
                break;
            case stats.daysSinceIncome >= 3:
                prompt.push("Seit drei Tagen ist kein Geld mehr reingekommen; du beginnst, deine Ausgaben im Kopf dreimal umzudrehen.")
                break;
        }
    }
    if (!combinedCaseTriggered) {
        if (stats.daysSinceIncome > 0) {
            if (!stats.hasJob) {
                prompt.push("Ohne Arbeit fehlt dir das Fundament für die kommenden Tage.")
            } else if (stats.jobSatisfaction < 0.3) {
                prompt.push("Du hast zwar Arbeit, aber der bloße Gedanke an die nächste Schicht lässt dir die Galle hochkommen.")
            } else if (stats.jobSatisfaction > 0.8) {
                prompt.push("Trotz der finanziellen Lage gibt dir dein Job das Gefühl, zumindest noch etwas wert zu sein.")
            }
        }
    }

    return prompt.length > 0
        ? prompt.join(" ")
        : "Deine Finanzen sind stabil und bieten dir Raum zum Atmen.";
}
