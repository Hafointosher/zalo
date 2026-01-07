/**
 * Inline String Decoder for obfuscator.io protected files
 * Evaluates the string decoder and replaces all calls with decoded literals
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SOURCE_DIR = "C:\\Users\\Hafointosher\\Desktop\\n8n-nodes-zalo-user-v3\\dist";
const OUTPUT_DIR = "C:\\Users\\Hafointosher\\Desktop\\n8n-zalo-deobfuscated";

function inlineStrings(filePath, outputPath) {
  console.log(`\n📄 Processing: ${path.basename(filePath)}`);
  
  let code = fs.readFileSync(filePath, "utf-8");
  
  // Extract the string array and decoder setup (everything before actual code)
  // Pattern: find the decoder functions and string array
  const decoderMatch = code.match(/^([\s\S]*?)(var\s+\w+\s*=\s*this\s*&&|Object\[|exports\[)/);
  
  if (!decoderMatch) {
    console.log("⚠️ Could not find decoder boundary");
    return false;
  }
  
  const decoderCode = decoderMatch[1];
  const restCode = code.slice(decoderMatch.index + decoderMatch[1].length);
  
  // Create sandbox and run decoder code
  const sandbox = {
    console,
    setTimeout: () => {},
    setInterval: () => {},
    clearTimeout: () => {},
    clearInterval: () => {},
  };
  
  try {
    // Run the decoder setup
    const context = vm.createContext(sandbox);
    const script = new vm.Script(decoderCode, { timeout: 5000 });
    script.runInContext(context);
    
    // Find decoder function names (pattern: a10_0x2fde, a10_0x4ea2)
    const decoderNames = [];
    const decoderPattern = /function\s+(a\d+_0x[a-f0-9]+)\s*\(/g;
    let match;
    while ((match = decoderPattern.exec(decoderCode)) !== null) {
      if (sandbox[match[1]] && typeof sandbox[match[1]] === 'function') {
        decoderNames.push(match[1]);
      }
    }
    
    // Also look for let/var assigned decoder aliases
    const aliasPattern = /let\s+(var\w+)\s*=\s*(a\d+_0x[a-f0-9]+)/g;
    while ((match = aliasPattern.exec(code)) !== null) {
      console.log(`  Found alias: ${match[1]} -> ${match[2]}`);
    }
    
    console.log(`  Decoder functions found: ${decoderNames.length}`);
    
    // Find all decoder calls and replace with decoded strings
    // Pattern: funcName(number) or funcName(number, 'key')
    let replacements = 0;
    let newCode = code;
    
    for (const funcName of decoderNames) {
      const decoder = sandbox[funcName];
      if (!decoder) continue;
      
      // Pattern 1: funcName(123)
      const pattern1 = new RegExp(`${funcName}\\s*\\(\\s*(\\d+)\\s*\\)`, 'g');
      newCode = newCode.replace(pattern1, (match, num) => {
        try {
          const decoded = decoder(parseInt(num));
          if (typeof decoded === 'string') {
            replacements++;
            return JSON.stringify(decoded);
          }
        } catch (e) {}
        return match;
      });
      
      // Pattern 2: funcName(123, 'key')
      const pattern2 = new RegExp(`${funcName}\\s*\\(\\s*(\\d+)\\s*,\\s*['"]([^'"]+)['"]\\s*\\)`, 'g');
      newCode = newCode.replace(pattern2, (match, num, key) => {
        try {
          const decoded = decoder(parseInt(num), key);
          if (typeof decoded === 'string') {
            replacements++;
            return JSON.stringify(decoded);
          }
        } catch (e) {}
        return match;
      });
    }
    
    console.log(`  ✅ Replaced ${replacements} string calls`);
    
    if (replacements > 0) {
      fs.writeFileSync(outputPath, newCode, "utf-8");
      return true;
    }
    
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
  }
  
  return false;
}

// Process all node files
const files = [
  "nodes/ZaloUser/ZaloApi.js",
  "nodes/ZaloUser/utils.js",
  "nodes/ZaloUser/error.js",
  "nodes/ZaloUser/ZaloUser.node.js",
  "nodes/ZaloUser/ZaloUserInteract.node.js",
  "nodes/ZaloUser/ZaloUserLogin.node.js",
  "nodes/ZaloUser/ZaloManager.node.js",
];

for (const file of files) {
  const inputPath = path.join(SOURCE_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, file);
  
  if (fs.existsSync(inputPath)) {
    inlineStrings(inputPath, outputPath);
  }
}

console.log("\n✨ Done!");
