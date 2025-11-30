//src/client/app/api/lab1/ex2/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface SentenceData {
    chapter_number: number;
    sentence_number: number;
    sentence_text: string;
}

export interface CharacterPair {
    character1: string;
    character2: string;
    count: number;
}

export interface CharacterSentiment {
    character: string;
    avg_sentiment: number;
}

export interface CharacterChapterSentiment {
    character: string;
    chapter_number: number;
    avg_sentiment: number;
}

export interface Ex2Response {
    sentences: SentenceData[];
    pairs: CharacterPair[];
    characterSentiment: CharacterSentiment[];
    chapterSentiment: CharacterChapterSentiment[];
}

function readSparkNdjson<T>(folderPath: string): T[] {
    if (!fs.existsSync(folderPath)) return [];

    const files = fs
        .readdirSync(folderPath)
        .filter((file) => file.startsWith("part"));

    const results: T[] = [];

    for (const file of files) {
        const raw = fs.readFileSync(path.join(folderPath, file), "utf8");
        const lines = raw
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line) as T);
        results.push(...lines);
    }

    return results;
}

export async function GET() {
    try {
        const baseFolder = path.join(process.cwd(), "public/lab-output/lab1");

        const sentences = readSparkNdjson<SentenceData>(
            path.join(baseFolder, "ex2_sentences")
        );

        const pairs = readSparkNdjson<CharacterPair>(
            path.join(baseFolder, "ex2_pairs")
        );

        const characterSentiment = readSparkNdjson<CharacterSentiment>(
            path.join(baseFolder, "ex2_character_sentiment")
        );

        const chapterSentiment = readSparkNdjson<CharacterChapterSentiment>(
            path.join(baseFolder, "ex2_chapter_sentiment")
        );

        return NextResponse.json({
            sentences,
            pairs,
            characterSentiment,
            chapterSentiment,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Cannot load EX2" }, { status: 500 });
    }
}
