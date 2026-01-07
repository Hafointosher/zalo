/**
 * Runtime String Extractor for obfuscator.io protected files
 * This script runs the obfuscated code and extracts decoded strings
 */
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const SOURCE_DIR = "C:\\Users\\Hafointosher\\Desktop\\n8n-nodes-zalo-user-v3\\dist";

// Mock Node.js environment
const mockRequire = (moduleName) => {
  const mocks = {
    "n8n-workflow": {
      NodeOperationError: class NodeOperationError extends Error {
        constructor(node, msg) { super(msg); this.node = node; }
      }
    },
    "zca-js": {
      Zalo: class {},
      Agent: class {}
    },
    "https-proxy-agent": { HttpsProxyAgent: class {} },
    "http-proxy-agent": { HttpProxyAgent: class {} },
    "socks-proxy-agent": { SocksProxyAgent: class {} }
  };
  return mocks[moduleName] || {};
};

function extractStrings(filePath) {
  const code = fs.readFileSync(filePath, "utf-8");
  
  // Find string array - could be function declaration or arrow/expression
  // Pattern: a10_0x4afd() returns array of encoded strings
  const arrayMatch = code.match(/(a\d+_0x[a-f0-9]+)\s*=\s*function\s*\(\)\s*\{[^}]*\[/) ||
                     code.match(/function\s+(a\d+_0x[a-f0-9]+)\s*\(\)\s*\{/);
  
  if (!arrayMatch) {
    // Try alternate pattern - look for array definition
    const altMatch = code.match(/(a\d+_0x[a-f0-9]+)\(\)/);
    if (altMatch) {
      console.log(`Found array call: ${altMatch[1]}`);
    }
    console.log("❌ Could not find string array function");
    return null;
  }
  
  const arrayFuncName = arrayMatch[1];
  console.log(`Found string array: ${arrayFuncName}`);
  
  // Extract the string array portion
  const arrayStartIdx = code.indexOf(`function ${arrayFuncName}`);
  const arrayEndPattern = new RegExp(`return\\s+${arrayFuncName};?\\s*\\}`);
  const afterStart = code.slice(arrayStartIdx);
  const arrayEndMatch = afterStart.match(arrayEndPattern);
  
  if (!arrayEndMatch) {
    console.log("❌ Could not find end of string array");
    return null;
  }
  
  const arrayCode = afterStart.slice(0, arrayEndMatch.index + arrayEndMatch[0].length);
  
  // Run just the array function
  const sandbox = {};
  const script = new vm.Script(arrayCode + `; ${arrayFuncName}();`);
  const context = vm.createContext(sandbox);
  
  try {
    const strings = script.runInContext(context);
    console.log(`✅ Extracted ${strings.length} strings`);
    return strings;
  } catch (e) {
    console.log(`❌ Error: ${e.message}`);
    return null;
  }
}

// Test with ZaloApi.js
const testFile = path.join(SOURCE_DIR, "nodes/ZaloUser/ZaloApi.js");
console.log(`\n📄 Analyzing: ${testFile}\n`);

const strings = extractStrings(testFile);
if (strings) {
  console.log("\n📝 Sample strings (first 30):");
  strings.slice(0, 30).forEach((s, i) => {
    console.log(`  [${i}]: ${s.substring(0, 60)}${s.length > 60 ? "..." : ""}`);
  });
}
