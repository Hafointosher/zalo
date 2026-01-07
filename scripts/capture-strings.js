/**
 * Runtime String Capture for obfuscator.io protected files
 * Runs the code and captures all decoded strings by hooking into global scope
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SOURCE_DIR = "C:\\Users\\Hafointosher\\Desktop\\n8n-nodes-zalo-user-v3\\dist";
const OUTPUT_DIR = "C:\\Users\\Hafointosher\\Desktop\\n8n-zalo-deobfuscated";

function processFile(filePath, outputPath) {
  console.log(`\n📄 Processing: ${path.basename(filePath)}`);
  
  let code = fs.readFileSync(filePath, "utf-8");
  
  // Captured strings: key -> decoded value
  const capturedStrings = new Map();
  
  // Create a proxy handler that captures all property accesses
  const handler = {
    get(target, prop) {
      if (prop in target) return target[prop];
      return undefined;
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    }
  };
  
  // Create sandbox with all needed globals
  const sandbox = {
    console: {
      log: () => {},
      error: () => {},
      warn: () => {},
    },
    setTimeout: (fn) => { try { fn(); } catch(e) {} },
    setInterval: () => 0,
    clearTimeout: () => {},
    clearInterval: () => {},
    Buffer,
    process: { env: {} },
    global: {},
    Object, Array, String, Number, Boolean, RegExp, Date, Math, JSON, Error,
    Map, Set, WeakMap, WeakSet, Promise, Symbol, Proxy, Reflect,
    parseInt, parseFloat, isNaN, isFinite, 
    decodeURIComponent, encodeURIComponent,
    decodeURI, encodeURI, escape, unescape,
    Function,
    exports: {},
    module: { exports: {} },
    require: (name) => {
      // Return mock modules
      const mocks = {
        "n8n-workflow": {
          NodeOperationError: class extends Error {},
          NodeApiError: class extends Error {}
        },
        "zca-js": { 
          Zalo: class {},
          ZaloApiError: class extends Error {},
          MessageType: { DirectMessage: 0, GroupMessage: 1 },
          ThreadType: { User: 0, Group: 1 },
          Reaction: {}
        },
        "https-proxy-agent": { HttpsProxyAgent: class {} },
        "http-proxy-agent": { HttpProxyAgent: class {} },
        "socks-proxy-agent": { SocksProxyAgent: class {} }
      };
      return mocks[name] || {};
    },
    __dirname: path.dirname(filePath),
    __filename: filePath,
  };
  
  // Add window/this reference
  sandbox.window = sandbox;
  sandbox.this = sandbox;
  
  try {
    const context = vm.createContext(sandbox);
    
    // Run the code
    const script = new vm.Script(code, { filename: filePath });
    script.runInContext(context, { timeout: 10000 });
    
    console.log("  ✅ Code executed successfully");
    
    // Now find all decoder functions in the context
    const decoderFuncs = [];
    for (const key in context) {
      if (/^a\d+_0x[a-f0-9]+$/.test(key) && typeof context[key] === 'function') {
        decoderFuncs.push(key);
      }
    }
    console.log(`  Found ${decoderFuncs.length} decoder functions: ${decoderFuncs.join(', ')}`);
    
    // Try to decode some sample calls
    if (decoderFuncs.length > 0) {
      for (const funcName of decoderFuncs) {
        const decoder = context[funcName];
        // Test decode
        try {
          const testResult = decoder(100);
          console.log(`  ${funcName}(100) = "${testResult}"`);
        } catch (e) {
          console.log(`  ${funcName}(100) failed: ${e.message}`);
        }
      }
    }
    
    // Export the decoder functions info
    return { context, decoderFuncs };
    
  } catch (e) {
    console.log(`  ❌ Execution error: ${e.message.substring(0, 100)}`);
    return null;
  }
}

// Test with one file
const testFile = path.join(SOURCE_DIR, "nodes/ZaloUser/ZaloApi.js");
const result = processFile(testFile, null);

if (result && result.decoderFuncs.length > 0) {
  console.log("\n🔍 Decoder functions available - can now decode strings!");
}
