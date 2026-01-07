const Synchrony = require("synchrony");
const fs = require("fs");
const path = require("path");

const SOURCE_DIR = "C:\\Users\\Hafointosher\\Desktop\\n8n-nodes-zalo-user-v3\\dist";
const OUTPUT_DIR = "C:\\Users\\Hafointosher\\Desktop\\n8n-zalo-deobfuscated";

const files = [
  // Credentials
  { src: "credentials/ZaloUserCredentialsApi.credentials.js", out: "credentials/ZaloUserCredentialsApi.credentials.js" },
  { src: "credentials/ZaloBotApi.credentials.js", out: "credentials/ZaloBotApi.credentials.js" },
  { src: "credentials/ZaloOACredentialsApi.credentials.js", out: "credentials/ZaloOACredentialsApi.credentials.js" },
  // ZaloUser nodes
  { src: "nodes/ZaloUser/ZaloUser.node.js", out: "nodes/ZaloUser/ZaloUser.node.js" },
  { src: "nodes/ZaloUser/ZaloUserInteract.node.js", out: "nodes/ZaloUser/ZaloUserInteract.node.js" },
  { src: "nodes/ZaloUser/ZaloUserLogin.node.js", out: "nodes/ZaloUser/ZaloUserLogin.node.js" },
  { src: "nodes/ZaloUser/ZaloManager.node.js", out: "nodes/ZaloUser/ZaloManager.node.js" },
  { src: "nodes/ZaloUser/ZaloApi.js", out: "nodes/ZaloUser/ZaloApi.js" },
  { src: "nodes/ZaloUser/utils.js", out: "nodes/ZaloUser/utils.js" },
  { src: "nodes/ZaloUser/error.js", out: "nodes/ZaloUser/error.js" },
  // ZaloBot nodes
  { src: "nodes/ZaloBot/ZaloBot.node.js", out: "nodes/ZaloBot/ZaloBot.node.js" },
  { src: "nodes/ZaloBot/ZaloBotTrigger.node.js", out: "nodes/ZaloBot/ZaloBotTrigger.node.js" },
  { src: "nodes/ZaloBot/GenericFunctions.js", out: "nodes/ZaloBot/GenericFunctions.js" },
  { src: "nodes/ZaloBot/IEvent.js", out: "nodes/ZaloBot/IEvent.js" },
  // ZaloOA nodes
  { src: "nodes/ZaloOA/ZaloOA.node.js", out: "nodes/ZaloOA/ZaloOA.node.js" },
  { src: "nodes/ZaloOA/ZaloOATrigger.node.js", out: "nodes/ZaloOA/ZaloOATrigger.node.js" },
];

function processFile(file) {
  const inputPath = path.join(SOURCE_DIR, file.src);
  const outputPath = path.join(OUTPUT_DIR, file.out);

  try {
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skip (not found): ${file.src}`);
      return;
    }

    const code = fs.readFileSync(inputPath, "utf-8");
    console.log(`🔄 Processing: ${file.src} (${Math.round(code.length / 1024)}KB)`);

    // Use Synchrony to deobfuscate
    const result = Synchrony.deobfuscate(code);

    // Ensure output directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, result, "utf-8");

    console.log(`✅ Done: ${file.out}`);
  } catch (error) {
    console.log(`❌ Error ${file.src}: ${error.message}`);
    
    // Fallback: just copy original
    try {
      const code = fs.readFileSync(inputPath, "utf-8");
      fs.writeFileSync(outputPath, code, "utf-8");
      console.log(`📋 Copied original: ${file.out}`);
    } catch (e) {
      console.log(`❌ Failed to copy: ${e.message}`);
    }
  }
}

console.log("🚀 Starting deobfuscation with Synchrony...\n");

for (const file of files) {
  processFile(file);
}

console.log("\n✨ Deobfuscation complete!");
