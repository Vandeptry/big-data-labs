//src/client/app/api/lab1/ex1/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface WordCount {
    word: string;
    count: number;
}

export interface Ex1Response {
    words: WordCount[];
    characters: WordCount[];
}

function readWordCounts(folder: string): WordCount[] {
    if (!fs.existsSync(folder)) return [];

    const files = fs
        .readdirSync(folder)
        .filter(
            (file) =>
                file.includes("part-") && !file.toLowerCase().endsWith(".crc")
        );

    const results: WordCount[] = [];

    for (const file of files) {
        const raw = fs.readFileSync(path.join(folder, file), "utf8").trim();
        if (!raw) continue;

        const lines = raw.split("\n");
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            const obj = JSON.parse(trimmed) as WordCount;
            results.push(obj);
        }
    }

    results.sort((a, b) => b.count - a.count);
    return results;
}

export async function GET() {
    try {
        const folder = path.join(process.cwd(), "public/lab-output/lab1");
        const words = readWordCounts(folder);

        const charNames = [
            "harry",
            "ron",
            "hermione",
            "malfoy",
            "snape",
            "dumbledore",
        ];
        const charSet = new Set(charNames);

        const characters = words
            .filter((w) => charSet.has(w.word.toLowerCase()))
            .sort((a, b) => b.count - a.count);

        const payload: Ex1Response = {
            words,
            characters,
        };

        return NextResponse.json(payload);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Cannot load lab1 results" },
            { status: 500 }
        );
    }
}
