//src/client/app/api/lab4/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface MailResult {
    text: string;
    label: string;
    prediction: string;
}

interface Stats {
    total: number;
    correct: number;
    accuracy: string;
    spamCount: number;
    hamCount: number;
}

export async function GET() {
    try {
        const possiblePaths = [
            path.join(
                process.cwd(),
                "public",
                "lab-output",
                "lab4",
                "ket_qua_lab4"
            ),
            path.join(process.cwd(), "public", "lab-output", "lab4"),
        ];

        const dirPath = possiblePaths.find((p) => fs.existsSync(p));

        if (!dirPath) {
            console.error("Directories checked:", possiblePaths);
            return NextResponse.json(
                {
                    error: "Output directory not found. Check server console for paths tried.",
                },
                { status: 404 }
            );
        }

        const files = fs.readdirSync(dirPath);
        const csvFile = files.find(
            (file) => file.startsWith("part-") && file.endsWith(".csv")
        );

        if (!csvFile) {
            return NextResponse.json(
                { error: "CSV file not found in directory", path: dirPath },
                { status: 404 }
            );
        }

        const filePath = path.join(dirPath, csvFile);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const lines = fileContent
            .split("\n")
            .filter((line) => line.trim() !== "");

        const dataRows = lines.filter(
            (line) =>
                !line.includes("prediction") && !line.includes("text,label")
        );

        const parsedData: MailResult[] = dataRows
            .map((line) => {
                const matches =
                    line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
                const cleanMatches = matches.map((m) =>
                    m.replace(/^"|"$/g, "").replace(/""/g, '"')
                );

                if (cleanMatches.length < 3) return null;

                return {
                    text: cleanMatches[0],
                    label: cleanMatches[1],
                    prediction: cleanMatches[2],
                };
            })
            .filter((item): item is MailResult => item !== null);

        const total = parsedData.length;
        let correct = 0;
        let spamCount = 0;
        let hamCount = 0;

        parsedData.forEach((item) => {
            const isSpamLabel = item.label.toLowerCase() === "spam";
            const isSpamPred = parseFloat(item.prediction) === 1.0;

            if (isSpamLabel === isSpamPred) correct++;

            if (isSpamPred) spamCount++;
            else hamCount++;
        });

        const accuracy = total > 0 ? (correct / total) * 100 : 0;

        const stats: Stats = {
            total,
            correct,
            accuracy: accuracy.toFixed(2),
            spamCount,
            hamCount,
        };

        return NextResponse.json({
            stats,
            rows: parsedData.slice(0, 100),
        });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
