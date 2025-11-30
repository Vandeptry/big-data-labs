//spark-runner.js
const { execSync } = require("child_process");
const path = require("path");
// Parse arguments
const args = process.argv.slice(2);

// Check if running on client
const isClient = args.includes("--client");
const scriptArg = args.find((a) => a.endsWith(".py"));

if (!scriptArg) {
    console.error(" No Python file provided.\nUsage:");
    console.error("   node spark-runner.js script.py");
    console.error("   node spark-runner.js --client script.py");
    process.exit(1);
}

// Resolve local full path
const localPath = path.resolve(process.cwd(), scriptArg);
const fileName = path.basename(scriptArg);

// Decide container
const targetContainer = isClient ? "spark-client" : "spark-worker-1";

// Decide run command
let submitCmd;
if (isClient) {
    submitCmd = `python3 /tmp/${fileName}`;
} else {
    submitCmd = `/spark/bin/spark-submit --master spark://spark-master:7077 --driver-memory 2g /tmp/${fileName}`;
}

console.log(`\n Copying script to ${targetContainer}...`);
execSync(`docker cp "${localPath}" ${targetContainer}:/tmp/${fileName}`, {
    stdio: "inherit",
});

console.log(` Running script in ${targetContainer}...\n`);
execSync(`docker exec -it ${targetContainer} ${submitCmd}`, {
    stdio: "inherit",
});
