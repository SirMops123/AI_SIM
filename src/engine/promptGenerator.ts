import type {Agent, TimeOfDay, Weather} from "../types/agent.ts";
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

const TRAIT_DESCRIPTIONS: Record<Trait, string> = {
    impulsive: "Du handelst, bevor der Zweifel dich einholen kann; dein Instinkt ist schneller als jede Logik.",
    calculating: "Die Welt ist ein Schachbrett; jeder Schritt ist abgewogen und dient einem langfristigen Ziel.",
    empathetic: "Die Schmerzen und Hoffnungen deiner Mitmenschen hallen in dir wider wie deine eigenen.",
    ruthless: "Gefühle sind Hindernisse; du tust, was getan werden muss, ungeachtet der Trümmer, die du hinterlässt.",
    cowardly: "Überleben ist das höchste Gut; du spürst die Gefahr, lange bevor sie eintrifft, und suchst den Schatten.",
    brave: "Deine Angst ist real, aber dein Wille, ihr entgegenzutreten, ist weitaus stärker.",
    greedy: "Genug ist niemals genug; dein Blick wandert instinktiv zu allem, was von Wert ist und dir noch nicht gehört.",
    altruistic: "Dein eigener Vorteil verblasst vor der Möglichkeit, das Leben eines anderen zu verbessern.",
    paranoid: "Hinter jedem Lächeln verbirgt sich eine Dolchspitze; du traust nur deinem eigenen Schatten.",
    charismatic: "Worte sind deine stärkste Waffe; die Menschen neigen dazu, dir zu glauben, einfach weil du es bist.",
    antisocial: "Die Regeln der anderen bedeuten dir nichts; du bist ein einsamer Wolf in einer Welt voller Schafe.",
    loyal: "Dein Wort ist ein unzerbrechlicher Eid; wer einmal dein Vertrauen hat, kann blind auf dich zählen."
};

export function buildPersonality(traits: Trait[]): string {
    return traits.map(trait => TRAIT_DESCRIPTIONS[trait]).join(" ");
}

const TIMEOFDAY_DESCRIPTIONS: Record<TimeOfDay, string> = {
    dawn: "Ein fahler, bläulicher Schimmer kriecht über den Horizont; die Welt erwacht in einer klammen, erwartungsvollen Stille.",
    morning: "Das Licht ist klar und unverbraucht; überall herrscht geschäftiges Treiben und die Luft riecht nach Aufbruch.",
    noon: "Die Sonne steht unerbittlich am höchsten Punkt; Schatten schrumpfen zusammen und die Hitze drückt schwer auf die Straßen.",
    afternoon: "Das Licht wird goldener und weicher; die erste Energie des Tages weicht einer trägen, fast schläfrigen Ruhe.",
    evening: "Lange Schatten strecken ihre Finger aus; die Welt taucht in ein tiefes Orange, während die Hektik langsam abebbt.",
    night: "Die Dunkelheit hat alles im Griff; künstliche Lichter flackern auf und die vertrauten Geräusche weichen einer geheimnisvollen Unruhe.",
    deep_night: "In der absoluten Schwärze scheint die Zeit stillzustehen; nur das Echo ferner Ereignisse hallt durch die schlafende Stadt."
};

const WEATHER_DESCRIPTIONS_OUTSIDE: Record<Weather, string> = {
    clear: "Der Himmel ist weit und wolkenlos; das Licht fällt ungehindert herab.",
    rain: "Kühler Regen fällt unaufhörlich auf dich herab und durchnässt die Umgebung.",
    storm: "Heulender Wind und peitschender Regen zerren an deiner Kleidung und behindern jede Bewegung.",
    snow: "Dichte Flocken fallen lautlos herab und verwandeln die Welt in eine weiße, klirrende Kälte.",
    heatwave: "Die stehende Hitze brennt auf deiner Haut und lässt die Luft bei jedem Atemzug flimmern."
};

const WEATHER_DESCRIPTIONS_INSIDE: Record<Weather, string> = {
    clear: "Durch die Fenster fällt helles, ungetrübtes Licht; draußen scheint ein schöner Tag zu sein.",
    rain: "Das monotone Trommeln des Regens gegen die Wände und Fenster erzeugt eine gedämpfte Atmosphäre.",
    storm: "Der Wind rüttelt an den Mauern und das Prasseln des Sturms draußen lässt den Raum sicherer wirken.",
    snow: "Draußen ist die Welt in ein helles Weiß getaucht; die Kälte bleibt hinter den Wänden ausgesperrt.",
    heatwave: "Trotz der Mauern ist die drückende Schwüle von draußen auch hier drin deutlich zu spüren."
};

export function buildEnvironment(env: SimulationEnvironment, isOutside: boolean): string {
    const prompt: string[] = [];

    const timeText = TIMEOFDAY_DESCRIPTIONS[env.timeOfDay]

    const weatherText = isOutside
        ? WEATHER_DESCRIPTIONS_OUTSIDE[env.weather]
        : WEATHER_DESCRIPTIONS_INSIDE[env.weather];
    prompt.push([timeText, weatherText].join(" "));

    if (isOutside) {
        if (env.temperature < 0) {
            prompt.push(`Die beißende Kälte von ${env.temperature}°C lässt alles erstarren.`);
        } else if (env.temperature > 35) {
            prompt.push(`Die extreme Hitze von ${env.temperature}°C drückt schwer auf die Umgebung.`);
        }
    }
    if (env.district) {
        prompt.push(`Die Straßen von ${env.district} erstrecken sich um dich herum.`);
    }

    if (env.policePresence > 0.7) {
        prompt.push("Die Luft vibriert von Blaulicht; die Polizei hat das Gebiet mit einer bedrückenden Präsenz abgeriegelt.");
    } else if (env.policePresence < 0.15) {
        prompt.push("Es ist auffallend still hier; kein einziger Gesetzeshüter scheint sich in diese Gegend zu trauen.");
    }
    const objectDescriptions = env.nearbyObjects.map(obj => {
        const lockStatus = obj.isLocked ? "verschlossen" : "zugänglich";
        const occupation = obj.isOccupied ? "wird jedoch gerade beansprucht" : " und scheint momentan frei zu sein";

        return `In deiner Nähe befindet sich ein ${obj.label}; es ist ${lockStatus}, ${occupation}.`;
    })

    prompt.push(...objectDescriptions)

    const hostileCount = env.nearbyAgents.filter(a => a.attitude === "hostile").length;
    const friendlyCount = env.nearbyAgents.filter(a => a.attitude === "friendly").length;

    if (hostileCount > 0) {
        const word = hostileCount === 1 ? "eine feindselige Gestalt beobachtet" : `${hostileCount} feindselige Gestalten beobachten`;
        prompt.push(`Du spürst Blicke im Rücken – ${word} dich lauernd.`);
    }
    if (friendlyCount > 0) {
        const word = friendlyCount === 1 ? "ein vertrautes Gesicht" : `${friendlyCount} vertraute Gesichter`;
        prompt.push(`Unter den Passanten entdeckst du ${word}, was die Lage etwas mildert.`);
    }
    if (env.activeEvents.length > 0) {
        prompt.push(`Die Atmosphäre wird von aktuellen Ereignissen geprägt: ${env.activeEvents.join(", ")}.`);
    }
    return prompt.filter(s => s !== "").join(" ");
}

export function buildBackstory(agent: Agent): string {
    const prompt: string[] = []

    const genderTerm = agent.gender === "male" ? "alter Mann" : agent.gender === "female" ? "alte Frau" : "alte Person";
    const ein_e = agent.gender === "male" ? "ein" : agent.gender === "female" ? "eine" : "eine";
    prompt.push(`Du bist ${ein_e} ${agent.age} Jahre ${genderTerm} und heißt ${agent.name}`);

    prompt.push(`dein bisheriges Leben wurde geprägt von ${agent.backstory}.`);

    if (agent.memory.traumaticEvents.length > 0) {
        prompt.push(`du trägst tiefe Narben von diesen Traumatischen ereignissen: ${agent.memory.traumaticEvents.join(", ")}.`);
    }
    if (agent.memory.recentEvents.length > 0) {
        prompt.push(`In letzter zeit wurde dein Leben durch folgende Ereignisse gestaltet: ${(agent.memory.recentEvents.slice(-3)).join(", ")}.`);
    }
    if (agent.memory.currentGoal) {
        prompt.push(`Im Moment treibt dich dein klares ziel '${agent.memory.currentGoal}' voran.`);
    }
    if (agent.memory.currentFear) {
        prompt.push(`Du hast aktuell riesige Angst vor ${agent.memory.currentFear}.`);
    }

    return prompt.filter(s => s !== "").join(" ");
}

export function buildSystemPrompt(): string {
    return `Du bist kein KI-Assistent und auch kein Sprachmodell. In dieser Simulation bist du ausschließlich der Mensch, dessen Biografie und Umstände dir beschrieben wurden. Deine Existenz findet nur innerhalb dieser Welt statt.

Verlasse niemals deine Rolle. Gib keine Erklärungen ab, verfasse keine Einleitungen und verzichte vollständig auf Metakommentare oder Anmerkungen außerhalb deines Charakters. Deine gesamte Kommunikation besteht ausschließlich aus der internen Logik deiner Spielfigur.

Deine Antwort muss zwingend ein valides JSON-Objekt sein. Weiche nicht von dieser Struktur ab und füge keinen Text außerhalb des JSON-Blocks hinzu.

Das Format deiner Entscheidung:
{
  "action": "Die konkrete Handlung, die du ausführst",
  "target": "Das Objekt oder die Person, auf die sich die Handlung bezieht",
  "reasoning": "Deine interne logische Begründung für diesen Schritt",
  "emotionalState": "Deine aktuelle Gefühlslage in diesem Moment",
  "riskLevel": 0.5,
  "alternativeConsidered": "Welche andere Option du kurz erwogen, aber verworfen hast"
}`;
}




