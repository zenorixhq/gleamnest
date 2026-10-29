const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// Helper to calculate CRC32 for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makePngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, "ascii");
  const crcPayload = Buffer.concat([typeBuf, data]);

  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcPayload), 0);

  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, pixelFn) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8 bits per channel
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // Deflate
  ihdr.writeUInt8(0, 11); // Filter 0
  ihdr.writeUInt8(0, 12); // No interlace
  const ihdrChunk = makePngChunk("IHDR", ihdr);

  // Scanlines with filter byte 0
  const scanlineSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineSize;
    rawData.writeUInt8(0, rowOffset); // Filter type 0: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = pixelFn(x, y, width, height);
      rawData.writeUInt8(r, pxOffset);
      rawData.writeUInt8(g, pxOffset + 1);
      rawData.writeUInt8(b, pxOffset + 2);
      rawData.writeUInt8(a, pxOffset + 3);
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makePngChunk("IDAT", compressed);
  const iendChunk = makePngChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate pixels for a luxury GleamNest icon
function gleamNestPixel(x, y, w, h) {
  // Normalize coordinates to 0..1
  const nx = x / w;
  const ny = y / h;
  const cx = 0.5;
  const cy = 0.5;

  // Background rounded rectangle
  const rx = Math.abs(nx - cx);
  const ry = Math.abs(ny - cy);
  const cornerR = 0.22;
  const isOutside =
    rx > 0.5 - cornerR &&
    ry > 0.5 - cornerR &&
    Math.hypot(rx - (0.5 - cornerR), ry - (0.5 - cornerR)) > cornerR;

  if (isOutside || rx > 0.48 || ry > 0.48) {
    return [0, 0, 0, 0]; // Transparent outside
  }

  // Base background: Deep Luxury Obsidian #1C1917
  let r = 28;
  let g = 25;
  let b = 23;
  let a = 255;

  // Gold border
  if (rx > 0.44 || ry > 0.44) {
    return [197, 160, 89, 200]; // #C5A059
  }

  // Sparkling star at top right (nx: 0.72..0.88, ny: 0.16..0.32)
  const starDist = Math.hypot(nx - 0.76, ny - 0.24);
  const starCross = Math.min(Math.abs(nx - 0.76), Math.abs(ny - 0.24));
  if (starDist < 0.12 && (starCross < 0.02 || starDist < 0.04)) {
    return [251, 247, 238, 255]; // Pure bright diamond sparkle
  }

  // "G" and "N" stylized geometry
  // Left side: "G"
  // Arc for G
  const gDist = Math.hypot(nx - 0.36, ny - 0.54);
  if (gDist >= 0.14 && gDist <= 0.22 && !(nx > 0.36 && ny < 0.50)) {
    return [212, 175, 55, 255]; // Rich gold
  }
  // G inner bar
  if (nx >= 0.34 && nx <= 0.44 && Math.abs(ny - 0.54) <= 0.04) {
    return [212, 175, 55, 255];
  }

  // Right side: "N"
  // Left stem of N
  if (Math.abs(nx - 0.56) <= 0.035 && ny >= 0.34 && ny <= 0.74) {
    return [212, 175, 55, 255];
  }
  // Right stem of N
  if (Math.abs(nx - 0.74) <= 0.035 && ny >= 0.34 && ny <= 0.74) {
    return [212, 175, 55, 255];
  }
  // Diagonal of N
  const diagX = 0.56 + (ny - 0.34) * (0.18 / 0.40);
  if (Math.abs(nx - diagX) <= 0.045 && ny >= 0.34 && ny <= 0.74) {
    return [212, 175, 55, 255];
  }

  return [r, g, b, a];
}

function makeIco(pngBuffers) {
  // ICONDIR header
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(pngBuffers.length, 4); // image count

  let currentOffset = 6 + pngBuffers.length * 16;
  const entries = [];
  const payloads = [];

  for (const { width, height, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // image size
    entry.writeUInt32LE(currentOffset, 12); // offset

    entries.push(entry);
    payloads.push(buffer);
    currentOffset += buffer.length;
  }

  return Buffer.concat([header, ...entries, ...payloads]);
}

// 1. Create SVG Favicon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="gnGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EADBBE"/>
      <stop offset="35%" stop-color="#D4AF37"/>
      <stop offset="70%" stop-color="#C5A059"/>
      <stop offset="100%" stop-color="#9A7B38"/>
    </linearGradient>
    <linearGradient id="gnBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#24211D"/>
      <stop offset="100%" stop-color="#141210"/>
    </linearGradient>
  </defs>
  <!-- Rounded Luxury Tile -->
  <rect width="64" height="64" rx="14" fill="url(#gnBg)"/>
  <rect width="62" height="62" x="1" y="1" rx="13" fill="none" stroke="url(#gnGold)" stroke-width="1.2" stroke-opacity="0.45"/>
  <!-- Classic Monogram GN -->
  <text x="31" y="44" font-family="'Playfair Display', Didot, 'Cinzel', Georgia, serif" font-size="31" font-weight="700" fill="url(#gnGold)" text-anchor="middle" letter-spacing="-1">GN</text>
  <!-- Brilliant 4-Point Diamond Sparkle -->
  <path d="M49 13 C49 17.5 53.5 17.5 53.5 17.5 C53.5 17.5 49 17.5 49 22 C49 17.5 44.5 17.5 44.5 17.5 C44.5 17.5 49 17.5 49 13 Z" fill="#FFFDF9"/>
</svg>`;

// Write SVG
fs.writeFileSync(path.join("public", "icon.svg"), svgContent);
fs.writeFileSync(path.join("public", "favicon.svg"), svgContent);

// 2. Generate PNGs
const png16 = createPng(16, 16, gleamNestPixel);
const png32 = createPng(32, 32, gleamNestPixel);
const png48 = createPng(48, 48, gleamNestPixel); // Perfect 48x48 for Google Search Favicon Guidelines
const png192 = createPng(192, 192, gleamNestPixel);

fs.writeFileSync(path.join("public", "icon.png"), png32);
fs.writeFileSync(path.join("public", "icon-32x32.png"), png32);
fs.writeFileSync(path.join("public", "icon-48x48.png"), png48);
fs.writeFileSync(path.join("public", "icon-192x192.png"), png192);
fs.writeFileSync(path.join("public", "apple-touch-icon.png"), png192);

fs.writeFileSync(path.join("app", "icon.png"), png32);
fs.writeFileSync(path.join("app", "apple-icon.png"), png192);

// 3. Create Valid Multi-Resolution ICO File (16x16, 32x32, 48x48)
const ico = makeIco([
  { width: 16, height: 16, buffer: png16 },
  { width: 32, height: 32, buffer: png32 },
  { width: 48, height: 48, buffer: png48 },
]);

fs.writeFileSync(path.join("public", "favicon.ico"), ico);
fs.writeFileSync(path.join("app", "favicon.ico"), ico);

console.log("Successfully generated all favicons: SVG, PNGs, and ICO!");
