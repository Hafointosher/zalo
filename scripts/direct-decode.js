/**
 * Direct String Decoder - extracts and runs decoder without anti-debug
 */
const fs = require("fs");
const path = require("path");

const SOURCE_DIR = "C:\\Users\\Hafointosher\\Desktop\\n8n-nodes-zalo-user-v3\\dist";
const OUTPUT_DIR = "C:\\Users\\Hafointosher\\Desktop\\n8n-zalo-deobfuscated";

// RC4 decrypt (same as obfuscator.io uses)
function rc4Decrypt(str, key) {
  let s = [], j = 0, x, res = '';
  for (let i = 0; i < 256; i++) s[i] = i;
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
    x = s[i]; s[i] = s[j]; s[j] = x;
  }
  let i = 0; j = 0;
  for (let y = 0; y < str.length; y++) {
    i = (i + 1) % 256;
    j = (j + s[i]) % 256;
    x = s[i]; s[i] = s[j]; s[j] = x;
    res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
  }
  return res;
}

// Base64 decode
function base64Decode(str) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
  let output = '';
  let buffer = 0, bits = 0;
  for (let i = 0; i < str.length; i++) {
    const c = chars.indexOf(str[i]);
    if (c === -1) continue;
    buffer = (buffer << 6) | c;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buffer >> bits) & 0xFF);
    }
  }
  try {
    return decodeURIComponent(escape(output));
  } catch (e) {
    return output;
  }
}

function processFile(inputPath, outputPath) {
  console.log(`\n📄 Processing: ${path.basename(inputPath)}`);
  
  let code = fs.readFileSync(inputPath, "utf-8");
  
  // Extract string array - pattern: ["str1","str2",...]
  // Look for the array function definition
  const arrayFuncMatch = code.match(/function\s+(a\d+_0x[a-f0-9]+)\s*\(\)\s*\{[^}]*(\[[^\]]{1000,}\])/);
  
  if (!arrayFuncMatch) {
    // Try alternate pattern for inline array
    const inlineArrayMatch = code.match(/(a\d+_0x[a-f0-9]+)\s*=\s*(\[[^\]]{1000,}\])/);
    if (!inlineArrayMatch) {
      console.log("  ⚠️ Could not find string array");
      return false;
    }
  }
  
  // Find all encoded strings in array - pattern: "encoded_string"
  const stringArrayMatch = code.match(/\["[^"]{1,100}","[^"]{1,100}"[^\]]+\]/);
  
  if (stringArrayMatch) {
    try {
      const arr = JSON.parse(stringArrayMatch[0].replace(/'/g, '"'));
      console.log(`  Found ${arr.length} encoded strings`);
      
      // Decode first few
      for (let i = 0; i < Math.min(5, arr.length); i++) {
        const decoded = base64Decode(arr[i]);
        console.log(`  [${i}]: ${arr[i].substring(0,20)}... -> ${decoded.substring(0,30)}...`);
      }
    } catch (e) {
      console.log(`  Parse error: ${e.message}`);
    }
  }
  
  // Find decoder function calls in code and count them
  const callPattern = /(a\d+_0x[a-f0-9]+)\s*\(\s*(\d+)\s*(?:,\s*['"]([^'"]+)['"]\s*)?\)/g;
  let match;
  let calls = 0;
  while ((match = callPattern.exec(code)) !== null) {
    calls++;
  }
  console.log(`  Found ${calls} decoder calls in code`);
  
  return true;
}

// Process one file for testing
processFile(
  path.join(SOURCE_DIR, "nodes/ZaloUser/ZaloApi.js"),
  path.join(OUTPUT_DIR, "nodes/ZaloUser/ZaloApi.js")
);
