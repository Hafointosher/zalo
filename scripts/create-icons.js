const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'extension', 'assets', 'icons');

// Base64 encoded minimal PNG (blue square)
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAIElEQVQ4T2NkYGD4z0ABYBw1YDQMRjQMRjQMBnUYAABdNAIBU9P5qQAAAABJRU5ErkJggg==';

const sizes = ['icon-16.png', 'icon-48.png', 'icon-128.png'];

for (const name of sizes) {
  const filePath = path.join(iconsDir, name);
  fs.writeFileSync(filePath, Buffer.from(pngBase64, 'base64'));
  console.log('Created:', filePath);
}
