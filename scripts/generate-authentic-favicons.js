const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

function makeIco(pngBuffers) {
  // ICONDIR header
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type (1 = icon)
  header.writeUInt16LE(pngBuffers.length, 4); // count of images

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

async function buildFavicons() {
  const logoMarkPath = path.join("public", "images", "logo-mark.png");
  if (!fs.existsSync(logoMarkPath)) {
    throw new Error("logo-mark.png not found at " + logoMarkPath);
  }

  const logoMarkBuffer = fs.readFileSync(logoMarkPath);

  // 1. Create the high-res 512x512 master tile
  // Fits logo nicely with slight breathing room
  const logoResized = await sharp(logoMarkBuffer)
    .resize(450, 450, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  // Luxury warm cream rounded background #FAF5EB with subtle border
  const roundedRectSvg = Buffer.from(
    `<svg width="512" height="512">
      <rect x="0" y="0" width="512" height="512" rx="112" fill="#FAF5EB"/>
      <rect x="2" y="2" width="508" height="508" rx="110" fill="none" stroke="#EADBBE" stroke-width="4" stroke-opacity="0.8"/>
    </svg>`
  );

  const master512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: roundedRectSvg },
      { input: logoResized, gravity: "center" },
    ])
    .png()
    .toBuffer();

  // 2. Generate standard multi-size PNGs
  const png16 = await sharp(master512).resize(16, 16, { kernel: "lanczos3" }).png().toBuffer();
  const png32 = await sharp(master512).resize(32, 32, { kernel: "lanczos3" }).png().toBuffer();
  const png48 = await sharp(master512).resize(48, 48, { kernel: "lanczos3" }).png().toBuffer();
  const png180 = await sharp(master512).resize(180, 180, { kernel: "lanczos3" }).png().toBuffer();
  const png192 = await sharp(master512).resize(192, 192, { kernel: "lanczos3" }).png().toBuffer();

  // 3. Write PNG files
  fs.writeFileSync(path.join("public", "icon.png"), png32);
  fs.writeFileSync(path.join("public", "icon-32x32.png"), png32);
  fs.writeFileSync(path.join("public", "icon-48x48.png"), png48);
  fs.writeFileSync(path.join("public", "icon-192x192.png"), png192);
  fs.writeFileSync(path.join("public", "apple-touch-icon.png"), png180);

  fs.writeFileSync(path.join("app", "icon.png"), png32);
  fs.writeFileSync(path.join("app", "apple-icon.png"), png180);

  // 4. Create standard multi-resolution ICO file
  const icoData = makeIco([
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 },
  ]);

  fs.writeFileSync(path.join("public", "favicon.ico"), icoData);
  fs.writeFileSync(path.join("app", "favicon.ico"), icoData);

  // 5. Create SVG favicon that embeds the exact master PNG
  const base64Png = master512.toString("base64");
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,${base64Png}" width="512" height="512"/>
</svg>`;

  fs.writeFileSync(path.join("public", "icon.svg"), svgFavicon);
  fs.writeFileSync(path.join("public", "favicon.svg"), svgFavicon);

  // Clean up any test files
  try { fs.unlinkSync("public/images/test-cream-favicon.png"); } catch (e) {}
  try { fs.unlinkSync("public/images/test-transparent-favicon.png"); } catch (e) {}

  console.log("Successfully created authentic GleamNest favicons across all resolutions!");
}

buildFavicons().catch((err) => {
  console.error("Error creating favicons:", err);
  process.exit(1);
});
