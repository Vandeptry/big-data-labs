//src/tools/convert-lab3.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "lab3_results",
    "part-r-00000"
);

const outDir = path.join(
    __dirname,
    "..",
    "client",
    "public",
    "lab-output",
    "lab3"
);

console.log("Reading from:", inputPath);
console.log("Writing to:", outDir);

if (!fs.existsSync(inputPath)) {
    console.error("File không tồn tại:", inputPath);
    process.exit(1);
}

const lines = fs.readFileSync(inputPath, "utf-8").trim().split("\n");

const results = lines
    .map((line) => {
        const parts = line.split(",");
        if (parts.length < 3) return null;

        return {
            month: Number(parts[0]),
            avgArrDelay: Number(parts[1]),
            avgDepDelay: Number(parts[2]),
        };
    })
    .filter(Boolean);

fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "result.json");
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));

console.log("SUCCESS:", outPath);
console.log("Rows parsed:", results.length);
