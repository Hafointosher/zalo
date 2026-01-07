/**
 * Full Runtime Deobfuscator
 * Runs the obfuscated code and captures all decoded strings
 */
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const SOURCE_DIR = "C:\\Users\\Hafointosher\\Desktop\\n8n-nodes-zalo-user-v3\\dist";
const OUTPUT_DIR = "C:\\Users\\Hafointosher\\Desktop\\n8n-zalo-deobfuscated\\nodes\\ZaloUser";

// Create comprehensive mock environment
function createMockEnv() {
  const stringCalls = [];
  
  return {
    exports: {},
    module: { exports: {} },
    require: (name) => {
      const mocks = {
        "n8n-workflow": {
          NodeOperationError: class extends Error {},
          NodeApiError: class extends Error {}
        },
        "zca-js": { 
          Zalo: class { static createInstance() { return new this(); } },
          ZaloApiError: class extends Error {},
          MessageType: {},
          ThreadType: {},
          Reaction: {}
        },
        "https-proxy-agent": { HttpsProxyAgent: class {} },
        "http-proxy-agent": { HttpProxyAgent: class {} },
        "socks-proxy-agent": { SocksProxyAgent: class {} },
        "http": {},
        "https": {},
        "url": { URL: global.URL },
        "path": path,
        "fs": fs
      };
      return mocks[name] || {};
    },
    console,
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    Buffer,
    process,
    __dirname: SOURCE_DIR,
    __filename: "",
    global: {},
    Object, Array, String, Number, Boolean, RegExp, Date, Math, JSON, Error,
    Map, Set, WeakMap, WeakSet, Promise, Symbol, Proxy, Reflect,
    parseInt, parseFloat, isNaN, isFinite, decodeURIComponent, encodeURIComponent,
    decodeURI, encodeURI, escape, unescape
  };
}

function deobfuscateFile(inputPath, outputPath) {
  console.log(`\n🔄 Processing: ${path.basename(inputPath)}`);
  
  const code = fs.readFileSync(inputPath, "utf-8");
  const env = createMockEnv();
  env.__filename = inputPath;
  
  const context = vm.createContext(env);
  
  try {
    // Wrap code to capture exports
    const wrappedCode = `
      (function(exports, require, module, __filename, __dirname) {
        ${code}
      })(exports, require, module, __filename, __dirname);
      module.exports;
    `;
    
    const script = new vm.Script(wrappedCode, { filename: inputPath });
    const result = script.runInContext(context, { timeout: 10000 });
    
    console.log(`✅ Executed successfully`);
    console.log(`   Exports: ${Object.keys(result || {}).join(", ") || "(none)"}`);
    
    // The module ran successfully - strings were decoded at runtime
    // Now extract them from the context
    
    return result;
  } catch (e) {
    console.log(`⚠️ Runtime error: ${e.message.substring(0, 100)}`);
    return null;
  }
}

// Test
const files = [
  "nodes/ZaloUser/ZaloApi.js",
];

for (const file of files) {
  const inputPath = path.join(SOURCE_DIR, file);
  if (fs.existsSync(inputPath)) {
    deobfuscateFile(inputPath, null);
  }
}
