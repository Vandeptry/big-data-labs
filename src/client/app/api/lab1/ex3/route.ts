//src/client/app/api/lab1/ex3/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface CharacterSentiment {
    character: string;
    avg_sentiment: number;
}

export interface ChapterSentiment {
    character: string;
    chapter_number: number;
    avg_sentiment: number;
}

export interface Ex3Response {
    characters: CharacterSentiment[];
    chapters: ChapterSentiment[];
}

function readNdjsonFolder<T>(folderPath: string): T[] {
    if (!fs.existsSync(folderPath)) return [];

    const files = fs
        .readdirSync(folderPath)
        .filter((f) => f.startsWith("part"));

    const rows: T[] = [];

    for (const file of files) {
        const raw = fs.readFileSync(path.join(folderPath, file), "utf8").trim();
        const lines = raw.split("\n").map((line) => JSON.parse(line) as T);
        rows.push(...lines);
    }

    return rows;
}

export async function GET() {
    try {
        const base = path.join(process.cwd(), "public/lab-output/lab1");

        const characters = readNdjsonFolder<CharacterSentiment>(
            path.join(base, "ex2_character_sentiment")
        );

        const chapters = readNdjsonFolder<ChapterSentiment>(
            path.join(base, "ex2_chapter_sentiment")
        );

        return NextResponse.json({
            characters,
            chapters,
        });
    } catch (err) {
        console.error("EX3 Route error:", err);
        return NextResponse.json(
            { error: "Failed loading EX3 data" },
            { status: 500 }
        );
    }
}
