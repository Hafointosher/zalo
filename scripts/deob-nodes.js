const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SOURCE_DIR = "C:\\Users\\Hafointosher\\Desktop\\n8n-nodes-zalo-user-v3\\dist";
const OUTPUT_DIR = "C:\\Users\\Hafointosher\\Desktop\\n8n-zalo-deobfuscated";

const nodeFiles = [
  "nodes/ZaloUser/ZaloApi.js",
  "nodes/ZaloUser/utils.js", 
  "nodes/ZaloUser/error.js",
  "nodes/ZaloUser/ZaloUser.node.js",
  "nodes/ZaloUser/ZaloUserInteract.node.js",
  "nodes/ZaloUser/ZaloUserLogin.node.js",
  "nodes/ZaloUser/ZaloManager.node.js",
];

for (const file of nodeFiles) {
  const inputPath = path.join(SOURCE_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, file);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️ Skip: ${file} (not found)`);
    continue;
  }
  
  console.log(`🔄 Deobfuscating: ${file}`);
  
  try {
    // Run synchrony directly on the original minified file
    const cmd = `npx synchrony "${inputPath}" -o "${outputPath}" --rename`;
    execSync(cmd, { stdio: "inherit" });
    console.log(`✅ Done: ${file}`);
  } catch (err) {
    console.log(`❌ Error: ${file} - ${err.message}`);
  }
}

console.log("\n✨ Deobfuscation complete!");
