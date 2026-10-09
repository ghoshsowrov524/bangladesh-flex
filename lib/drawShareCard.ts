import type { Result } from "@/data/scoring";

const W = 1080;
const H = 1920;

const ink = "#0b2a20";
const forest = "#006a4e";
const cream = "#f6f1e7";
const sun = "#f42a41";
const marigold = "#ffc94a";

type Pt = [number, number];

// Stylised outline of Bangladesh as [longitude, latitude] points.
// It is only used to place the dots, so it is simplified on purpose.
const OUTLINE: Pt[] = [
  [88.55, 26.62], [88.95, 26.45], [89.25, 26.3], [89.55, 26.2], [89.85, 26.05],
  [89.85, 25.6], [90.0, 25.2], [90.4, 25.15], [90.8, 25.15], [91.2, 25.15],
  [91.6, 25.2], [91.9, 25.15], [92.15, 25.0], [92.2, 24.85], [92.05, 24.6],
  [92.0, 24.4], [91.85, 24.2], [91.55, 24.1], [91.2, 23.95], [91.15, 23.6],
  [91.35, 23.3], [91.5, 23.1], [91.8, 23.35], [92.05, 23.65], [92.3, 23.65],
  [92.35, 23.2], [92.55, 22.9], [92.6, 22.7], [92.55, 22.35], [92.5, 22.1],
  [92.45, 21.75], [92.35, 21.45], [92.2, 21.2], [92.3, 20.85], [92.33, 20.6],
  [92.2, 20.85], [92.0, 21.2], [91.98, 21.45], [91.85, 21.85], [91.8, 22.35],
  [91.6, 22.5], [91.4, 22.6], [91.1, 22.4], [90.85, 22.2], [90.6, 21.95],
  [90.3, 21.85], [90.1, 21.8], [89.8, 21.8], [89.5, 21.75], [89.2, 21.75],
  [89.05, 21.8], [89.0, 22.1], [88.95, 22.4], [88.9, 22.8], [88.88, 23.05],
  [88.7, 23.3], [88.7, 23.6], [88.7, 23.9], [88.65, 24.15], [88.45, 24.35],
  [88.3, 24.55], [88.05, 24.7], [88.0, 25.0], [88.2, 25.3], [88.4, 25.75],
  [88.15, 25.9], [88.1, 26.3], [88.35, 26.5],
];

// Map placement on the 1080 x 1920 image
const LON0 = 87.9;
const LAT0 = 20.5;
const LAT1 = 26.7;
const LON1 = 92.8;
const KX = Math.cos((23.5 * Math.PI) / 180);
const MAP_H = 840;
const SCALE = MAP_H / (LAT1 - LAT0);
const MAP_W = (LON1 - LON0) * KX * SCALE;
const MAP_X = (W - MAP_W) / 2;
const MAP_Y = 690;

function project(lon: number, lat: number): Pt {
  return [MAP_X + (lon - LON0) * KX * SCALE, MAP_Y + (LAT1 - lat) * SCALE];
}

const OUTLINE_PX: Pt[] = OUTLINE.map(([lo, la]) => project(lo, la));

function insideOutline(x: number, y: number): boolean {
  let inside = false;
  const n = OUTLINE_PX.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = OUTLINE_PX[i];
    const [xj, yj] = OUTLINE_PX[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// The places on the map and which experiences light them up
type Place = {
  name: string;
  lon: number;
  lat: number;
  side: "l" | "r"; // which side the label sits on
  ids: string[];
};

const PLACES: Place[] = [
  { name: "Sylhet", lon: 91.87, lat: 24.9, side: "r", ids: ["t2"] },
  { name: "Sreemangal", lon: 91.73, lat: 24.31, side: "r", ids: ["f10"] },
  { name: "Sajek", lon: 92.29, lat: 23.38, side: "r", ids: ["t4"] },
  { name: "Rangamati", lon: 92.17, lat: 22.65, side: "r", ids: ["t5"] },
  { name: "Bandarban", lon: 92.22, lat: 22.19, side: "r", ids: ["t3"] },
  { name: "Cox's Bazar", lon: 91.97, lat: 21.45, side: "r", ids: ["t1"] },
  { name: "Saint Martin", lon: 92.32, lat: 20.63, side: "r", ids: ["t7"] },
  { name: "Kuakata", lon: 90.12, lat: 21.82, side: "r", ids: ["t6"] },
  { name: "Sundarbans", lon: 89.5, lat: 22.0, side: "l", ids: ["t8"] },
  {
    name: "Dhaka",
    lon: 90.41,
    lat: 23.81,
    side: "l",
    ids: ["f1", "c1", "c2", "c3", "c4", "c7", "c8", "c9", "c10", "u7", "u8", "u10"],
  },
];

// Splits a long sentence into lines that fit inside maxWidth pixels
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Soft coloured glow
function glowAt(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  rgb: string,
  alpha: number
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${alpha})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

export async function drawShareCard(result: Result): Promise<Blob> {
  // Re-use the same fonts the website already loaded
  const root = getComputedStyle(document.documentElement);
  const display =
    root.getPropertyValue("--font-bricolage").trim() || "sans-serif";
  const sans = root.getPropertyValue("--font-dm-sans").trim() || "sans-serif";

  try {
    await Promise.all([
      document.fonts.load(`800 100px ${display}`),
      document.fonts.load(`600 100px ${sans}`),
      document.fonts.load(`700 100px ${sans}`),
    ]);
  } catch {
    // if fonts fail to load we simply fall back to the default font
  }

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");

  const picked = new Set(result.selectedIds ?? []);
  const lit = PLACES.filter((p) => p.ids.some((id) => picked.has(id)));
  const litPx = lit.map((p) => project(p.lon, p.lat));

  // ---------- Background ----------
  ctx.fillStyle = ink;
  ctx.fillRect(0, 0, W, H);
  glowAt(ctx, 540, 800, 1000, "0,106,78", 0.9);
  glowAt(ctx, 1040, 60, 800, "244,42,65", 0.7);
  glowAt(ctx, 30, 1900, 800, "255,201,74", 0.35);

  // Glass card
  ctx.fillStyle = "rgba(11,42,32,0.5)";
  ctx.beginPath();
  ctx.roundRect(48, 48, 984, 1824, 64);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // ---------- Header ----------
  ctx.fillStyle = forest;
  ctx.beginPath();
  ctx.roundRect(112, 100, 110, 66, 10);
  ctx.fill();
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(161, 133, 21, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = "left";
  ctx.fillStyle = cream;
  ctx.font = `800 36px ${display}`;
  ctx.fillText("BANGLADESH FLEX", 250, 147);

  // ---------- Score ----------
  const scoreText = String(result.score);
  ctx.font = `800 320px ${display}`;
  const scoreW = ctx.measureText(scoreText).width;
  ctx.fillStyle = cream;
  ctx.fillText(scoreText, 112, 440);
  ctx.fillStyle = "rgba(246,241,231,0.6)";
  ctx.font = `700 64px ${sans}`;
  ctx.fillText("/ 100", 112 + scoreW + 20, 440);

  // Level pill
  const levelText = `${result.level.emoji}  ${result.level.name.toUpperCase()}`;
  ctx.font = `800 40px ${display}`;
  const pillW = ctx.measureText(levelText).width + 72;
  ctx.fillStyle = marigold;
  ctx.beginPath();
  ctx.roundRect(112, 486, pillW, 82, 41);
  ctx.fill();
  ctx.fillStyle = ink;
  ctx.fillText(levelText, 148, 541);

  // Level blurb
  ctx.fillStyle = "rgba(246,241,231,0.8)";
  ctx.font = `italic 600 32px ${sans}`;
  wrapText(ctx, `“${result.level.blurb}”`, 856)
    .slice(0, 2)
    .forEach((line, i) => ctx.fillText(line, 112, 618 + i * 40));

  // ---------- The map ----------
  // Soft glow behind every place you've lit up
  litPx.forEach(([x, y]) => glowAt(ctx, x, y, 150, "255,201,74", 0.28));

  // Dots
  const spacing = 14;
  const glowRadius = 170;
  const rows = Math.ceil(MAP_H / spacing);
  const cols = Math.ceil(MAP_W / spacing);
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const x = MAP_X + c * spacing + (r % 2 ? spacing / 2 : 0);
      const y = MAP_Y + r * spacing;
      if (!insideOutline(x, y)) continue;

      let nearest = Infinity;
      for (const [px, py] of litPx) {
        const d = Math.hypot(x - px, y - py);
        if (d < nearest) nearest = d;
      }

      if (nearest < glowRadius) {
        const t = 1 - nearest / glowRadius;
        ctx.fillStyle = `rgba(255,201,74,${0.3 + 0.7 * t * t})`;
        ctx.beginPath();
        ctx.arc(x, y, 3.2 + 2.2 * t, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "rgba(246,241,231,0.17)";
        ctx.beginPath();
        ctx.arc(x, y, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Faint sea label
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(246,241,231,0.22)";
  ctx.font = `700 22px ${sans}`;
  ctx.fillText("BAY OF BENGAL", 300, 1500);

  // Pins: empty rings for places not yet lit
  PLACES.forEach((p) => {
    if (lit.includes(p)) return;
    const [x, y] = project(p.lon, p.lat);
    ctx.strokeStyle = "rgba(246,241,231,0.35)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Pins: lit places with a glowing label
  lit.forEach((p) => {
    const [x, y] = project(p.lon, p.lat);

    ctx.strokeStyle = marigold;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = `700 28px ${sans}`;
    const tw = ctx.measureText(p.name).width;
    const pad = 16;
    const boxW = tw + pad * 2;
    const boxH = 48;
    const bx = p.side === "r" ? x + 28 : x - 28 - boxW;
    const by = y - boxH / 2;

    ctx.fillStyle = "rgba(11,42,32,0.88)";
    ctx.beginPath();
    ctx.roundRect(bx, by, boxW, boxH, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,201,74,0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = cream;
    ctx.fillText(p.name, bx + pad, by + 33);
  });

  // ---------- Stats ----------
  const tileY = 1590;
  const tileH = 112;
  const tileW = 266;
  const tileGap = 21;
  const top = result.topCategory;

  const stats: { value: string; label: string; emoji?: boolean }[] = [
    { value: String(result.count), label: "EXPERIENCES" },
    { value: `${lit.length}/${PLACES.length}`, label: "PLACES LIT" },
    top
      ? { value: top.icon, label: top.label.toUpperCase(), emoji: true }
      : { value: "–", label: "NO ROUND YET" },
  ];

  stats.forEach((s, i) => {
    const x = 112 + i * (tileW + tileGap);
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    ctx.roundRect(x, tileY, tileW, tileH, 28);
    ctx.fill();

    ctx.fillStyle = cream;
    ctx.font = s.emoji ? `50px ${sans}` : `800 54px ${display}`;
    ctx.fillText(s.value, x + 24, tileY + 66);

    ctx.fillStyle = "rgba(246,241,231,0.65)";
    ctx.font = `700 20px ${sans}`;
    ctx.fillText(s.label, x + 24, tileY + 96);
  });

  // ---------- Fun line + footer ----------
  ctx.fillStyle = cream;
  ctx.font = `italic 600 34px ${sans}`;
  wrapText(ctx, `“${result.funLine}”`, 856)
    .slice(0, 2)
    .forEach((line, i) => ctx.fillText(line, 112, 1752 + i * 42));

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(246,241,231,0.55)";
  ctx.font = `700 24px ${sans}`;
  ctx.fillText("BANGLADESH FLEX · WHAT'S YOUR NUMBER?", W / 2, 1848);

  // Turn the drawing into a PNG file
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not create the image")),
      "image/png"
    );
  });
}