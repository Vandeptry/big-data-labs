//src/client/app/api/lab3/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const filePath = path.join(
            process.cwd(),
            "public",
            "lab-output",
            "lab3",
            "result.json"
        );

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: "Result file not found", path: filePath },
                { status: 404 }
            );
        }

        const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return NextResponse.json({ data: json });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
