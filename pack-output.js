import fs from "fs";
import path from "path";

const SOURCE = path.join(process.cwd(), "data/output/lab1");
const DEST = path.join(process.cwd(), "src/client/public/lab-output/lab1");

function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;

    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);
    for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);

        if (fs.lstatSync(srcPath).isDirectory()) {
            copyRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log("Copying Spark output...");
copyRecursive(SOURCE, DEST);
console.log("DONE — Copied to src/client/public/lab-output/lab1/");
