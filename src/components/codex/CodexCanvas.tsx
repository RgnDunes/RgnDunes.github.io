"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Landmark, Vec2 } from "./types";
import { LANDMARKS, READ_RADIUS, START, WORLD } from "./landmarks";
import { ISO, project } from "./iso";

interface Props {
  read: Set<string>;
  onNear: (id: string | null) => void;
  onEnter: (id: string) => void;
  reduced: boolean;
}

const PAPER = "#F6F0E7";
const PAPER_2 = "#F0E9DD";
const RULE = "#D2CABD";
const INK = "#141416";
const INK_2 = "#3C3A37";
const MUTED = "#7A746C";
const SAFFRON = "#E86A2B";
const SEAL = "#27584A";

/**
 * The world canvas. Draws:
 *   - A soft grid of isometric tiles (paper texture)
 *   - Six landmarks with per-kind illustrations
 *   - A reader avatar with a saffron footprint trail
 *   - Camera follows the reader
 *
 * Movement: WASD / arrow keys. Movement is continuous (velocity-based)
 * so it feels like walking, not stepping.
 */
export default function CodexCanvas({ read, onNear, onEnter, reduced }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readerRef = useRef<Vec2>({ ...START });
  const trailRef = useRef<{ x: number; y: number; age: number }[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const nearestRef = useRef<string | null>(null);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const [, forceRender] = useState(0);

  // Track viewport
  const [size, setSize] = useState({ w: 1024, h: 720 });
  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  // Keyboard input
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Ignore when typing in inputs (shouldn't happen here, but safe)
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      keysRef.current.add(e.code);
      if (e.code === "Enter" || e.code === "Space") {
        if (nearestRef.current) {
          e.preventDefault();
          onEnter(nearestRef.current);
        }
      }
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      keysRef.current.clear();
    };
  }, [onEnter]);

  // Tap-to-move on mobile (canvas click sets target)
  const targetRef = useRef<Vec2 | null>(null);
  const onClickCanvas = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // Screen coords relative to canvas center (camera offset)
      const cx = e.clientX - rect.left - rect.width / 2;
      const cy = e.clientY - rect.top - rect.height / 2;
      // Camera is centered on reader → screen origin = reader projected
      const reader = readerRef.current;
      const projReader = project(reader.x, reader.y);
      const targetScreenX = projReader.x + cx;
      const targetScreenY = projReader.y + cy;
      // Inverse project
      const tx =
        (targetScreenX / ISO.halfW + targetScreenY / ISO.halfH) / 2;
      const ty =
        (targetScreenY / ISO.halfH - targetScreenX / ISO.halfW) / 2;
      targetRef.current = {
        x: clamp(tx, 0, WORLD.w - 1),
        y: clamp(ty, 0, WORLD.h - 1),
      };
    },
    []
  );

  // Main loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle HiDPI
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const speed = 4.2; // tiles per second

    const step = (ts: number) => {
      const dt = Math.min(0.05, lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 0);
      lastTsRef.current = ts;

      // Read keys → velocity
      const k = keysRef.current;
      let vx = 0;
      let vy = 0;
      // Isometric-friendly mapping: W/↑ moves up-right (decrease y, increase x depth = up-screen)
      if (k.has("KeyW") || k.has("ArrowUp")) {
        vx -= 1;
        vy -= 1;
      }
      if (k.has("KeyS") || k.has("ArrowDown")) {
        vx += 1;
        vy += 1;
      }
      if (k.has("KeyA") || k.has("ArrowLeft")) {
        vx -= 1;
        vy += 1;
      }
      if (k.has("KeyD") || k.has("ArrowRight")) {
        vx += 1;
        vy -= 1;
      }

      // If tap target is set and no keys pressed, seek toward target
      if (vx === 0 && vy === 0 && targetRef.current) {
        const dx = targetRef.current.x - readerRef.current.x;
        const dy = targetRef.current.y - readerRef.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.15) {
          targetRef.current = null;
        } else {
          vx = dx / dist;
          vy = dy / dist;
        }
      } else if (vx !== 0 || vy !== 0) {
        // Any keyboard input cancels tap-to-move
        targetRef.current = null;
      }

      // Normalize + apply
      if (vx !== 0 || vy !== 0) {
        const mag = Math.hypot(vx, vy);
        vx /= mag;
        vy /= mag;
        readerRef.current.x = clamp(
          readerRef.current.x + vx * speed * dt,
          0.5,
          WORLD.w - 1.5
        );
        readerRef.current.y = clamp(
          readerRef.current.y + vy * speed * dt,
          0.5,
          WORLD.h - 1.5
        );

        // Trail — sample every ~120ms based on distance
        const last = trailRef.current[trailRef.current.length - 1];
        const dx = last ? readerRef.current.x - last.x : 999;
        const dy = last ? readerRef.current.y - last.y : 999;
        if (!last || Math.hypot(dx, dy) > 0.35) {
          trailRef.current.push({
            x: readerRef.current.x,
            y: readerRef.current.y,
            age: 0,
          });
          if (trailRef.current.length > 24) trailRef.current.shift();
        }
      }
      // Age trail dots
      for (const t of trailRef.current) t.age += dt;
      trailRef.current = trailRef.current.filter((t) => t.age < 2.4);

      // Nearest landmark check
      let nearest: Landmark | null = null;
      let bestDist = Infinity;
      for (const lm of LANDMARKS) {
        const d = Math.hypot(
          lm.tile.x - readerRef.current.x,
          lm.tile.y - readerRef.current.y
        );
        if (d < READ_RADIUS && d < bestDist) {
          bestDist = d;
          nearest = lm;
        }
      }
      const nearestId = nearest ? nearest.id : null;
      if (nearestId !== nearestRef.current) {
        nearestRef.current = nearestId;
        onNear(nearestId);
      }

      draw(ctx, size, readerRef.current, trailRef.current, read, nearestId, ts);

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w, size.h, read, onNear]);

  // Force a rerender when read set changes so the landmark ticks re-draw
  useEffect(() => {
    forceRender((n) => n + 1);
  }, [read]);

  return (
    <canvas
      ref={canvasRef}
      onClick={onClickCanvas}
      className="fixed inset-0 h-full w-full"
      style={{ background: PAPER, cursor: "crosshair" }}
    />
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/* ─── Drawing ────────────────────────────────────────────── */

function draw(
  ctx: CanvasRenderingContext2D,
  size: { w: number; h: number },
  reader: Vec2,
  trail: { x: number; y: number; age: number }[],
  read: Set<string>,
  nearestId: string | null,
  ts: number
) {
  const { w, h } = size;

  // Background — paper wash with a soft saffron halo top-left
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);

  const halo = ctx.createRadialGradient(w * 0.15, h * 0.15, 20, w * 0.15, h * 0.15, w * 0.6);
  halo.addColorStop(0, "rgba(232,106,43,0.10)");
  halo.addColorStop(1, "rgba(232,106,43,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);

  // Camera: center the reader
  const projReader = project(reader.x, reader.y);
  const camX = w / 2 - projReader.x;
  const camY = h / 2 - projReader.y - 40; // slight elevation

  ctx.save();
  ctx.translate(camX, camY);

  // Draw ground diamonds (a subtle patch of tiles around the reader)
  drawGround(ctx, reader);

  // Draw items (sorted by depth: y ascending). Reader is in this list.
  type Drawable = { y: number; render: () => void };
  const items: Drawable[] = [];

  for (const lm of LANDMARKS) {
    const p = project(lm.tile.x, lm.tile.y);
    items.push({
      y: p.y,
      render: () => drawLandmark(ctx, lm, read.has(lm.id), lm.id === nearestId, ts),
    });
  }

  // Reader
  const pR = project(reader.x, reader.y);
  items.push({
    y: pR.y,
    render: () => drawReader(ctx, reader, ts),
  });

  // Trail — draw before things so it sits underneath
  drawTrail(ctx, trail);

  items.sort((a, b) => a.y - b.y);
  for (const it of items) it.render();

  ctx.restore();
}

function drawGround(ctx: CanvasRenderingContext2D, reader: Vec2) {
  const R = 12;
  const cx = Math.floor(reader.x);
  const cy = Math.floor(reader.y);

  // Tile diamonds — subtle paper contrast, only tiles within R of reader
  for (let ty = cy - R; ty <= cy + R; ty++) {
    for (let tx = cx - R; tx <= cx + R; tx++) {
      if (tx < 0 || ty < 0 || tx >= WORLD.w || ty >= WORLD.h) continue;
      const dx = tx - reader.x;
      const dy = ty - reader.y;
      const d = Math.hypot(dx, dy);
      if (d > R) continue;

      const p = project(tx, ty);
      const fade = 1 - d / R;

      // Alternate paper tones for the "map linen" feel
      const light = (tx + ty) % 2 === 0;
      const base = light ? PAPER : PAPER_2;
      // Fill diamond
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - ISO.halfH);
      ctx.lineTo(p.x + ISO.halfW, p.y);
      ctx.lineTo(p.x, p.y + ISO.halfH);
      ctx.lineTo(p.x - ISO.halfW, p.y);
      ctx.closePath();
      ctx.fillStyle = base;
      ctx.globalAlpha = 0.85 * fade;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Rule
      ctx.strokeStyle = RULE;
      ctx.globalAlpha = 0.35 * fade;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
}

function drawTrail(ctx: CanvasRenderingContext2D, trail: { x: number; y: number; age: number }[]) {
  for (const t of trail) {
    const p = project(t.x, t.y);
    const alpha = Math.max(0, 0.32 * (1 - t.age / 2.4));
    ctx.beginPath();
    ctx.arc(p.x, p.y + 4, 3 + t.age * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232,106,43,${alpha.toFixed(3)})`;
    ctx.fill();
  }
}

function drawReader(ctx: CanvasRenderingContext2D, reader: Vec2, ts: number) {
  const p = project(reader.x, reader.y);
  const bob = Math.sin(ts / 180) * 1.5;

  // Shadow
  ctx.beginPath();
  ctx.ellipse(p.x, p.y + 4, 14, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(20,20,22,0.25)";
  ctx.fill();

  // Body — a paper dot with a saffron cap (a stylized "reader" figure)
  ctx.save();
  ctx.translate(p.x, p.y - 12 + bob);

  // Torso
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 12, 0, 0, Math.PI * 2);
  ctx.fillStyle = INK;
  ctx.fill();

  // Saffron collar / satchel strap
  ctx.beginPath();
  ctx.ellipse(0, 2, 8, 3.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = SAFFRON;
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(0, -12, 5.5, 0, Math.PI * 2);
  ctx.fillStyle = "#E7D6C1";
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Hair / cap
  ctx.beginPath();
  ctx.arc(0, -13, 5, Math.PI, 0);
  ctx.fillStyle = INK;
  ctx.fill();

  ctx.restore();
}

function drawLandmark(
  ctx: CanvasRenderingContext2D,
  lm: Landmark,
  isRead: boolean,
  isNearest: boolean,
  ts: number
) {
  const p = project(lm.tile.x, lm.tile.y);
  const accent = lm.accent || SAFFRON;

  // Base ring — glows on approach
  ctx.save();
  ctx.translate(p.x, p.y);

  // Ground shadow
  ctx.beginPath();
  ctx.ellipse(0, 8, 34, 12, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(20,20,22,0.20)";
  ctx.fill();

  // Ring
  const ringPulse = isNearest ? 0.6 + Math.sin(ts / 220) * 0.3 : 0.25;
  ctx.beginPath();
  ctx.ellipse(0, 8, 32, 10, 0, 0, Math.PI * 2);
  ctx.strokeStyle = accent;
  ctx.globalAlpha = ringPulse;
  ctx.lineWidth = isNearest ? 2.4 : 1.5;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Inner ring for read state
  if (isRead) {
    ctx.beginPath();
    ctx.ellipse(0, 8, 22, 7, 0, 0, Math.PI * 2);
    ctx.strokeStyle = SEAL;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Structure per kind
  switch (lm.kind) {
    case "monolith":
      drawMonolith(ctx, accent);
      break;
    case "arch":
      drawArch(ctx, accent);
      break;
    case "obelisk":
      drawObelisk(ctx, accent);
      break;
    case "library":
      drawLibrary(ctx, accent);
      break;
    case "gateway":
      drawGateway(ctx, accent);
      break;
    case "well":
      drawWell(ctx, accent);
      break;
  }

  ctx.restore();

  // Label plate (draw in screen coords, above the structure)
  drawLabel(ctx, p.x, p.y - 82, lm, isRead, isNearest);
}

/* ─── Illustrations ────────────────────────────────────── */

function drawMonolith(ctx: CanvasRenderingContext2D, accent: string) {
  // A tall slab with a hollowed center — Rippling
  ctx.fillStyle = INK;
  ctx.fillRect(-14, -60, 28, 66);
  ctx.fillStyle = accent;
  ctx.fillRect(-8, -50, 16, 30);
  ctx.fillStyle = INK;
  ctx.fillRect(-5, -44, 10, 18);
  // top cap
  ctx.fillStyle = PAPER;
  ctx.fillRect(-14, -60, 28, 3);
}

function drawArch(ctx: CanvasRenderingContext2D, accent: string) {
  // Two pillars + arch — Razorpay
  ctx.fillStyle = INK;
  ctx.fillRect(-20, -50, 8, 56);
  ctx.fillRect(12, -50, 8, 56);
  // arch top
  ctx.beginPath();
  ctx.moveTo(-20, -50);
  ctx.quadraticCurveTo(0, -76, 20, -50);
  ctx.lineTo(20, -46);
  ctx.quadraticCurveTo(0, -72, -20, -46);
  ctx.closePath();
  ctx.fill();
  // inner ring
  ctx.beginPath();
  ctx.arc(0, -46, 12, Math.PI, 0);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawObelisk(ctx: CanvasRenderingContext2D, accent: string) {
  // Slim pillar with a pyramid cap — i18nify
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.moveTo(-9, 6);
  ctx.lineTo(-6, -50);
  ctx.lineTo(6, -50);
  ctx.lineTo(9, 6);
  ctx.closePath();
  ctx.fill();
  // pyramid top
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(-6, -50);
  ctx.lineTo(0, -66);
  ctx.lineTo(6, -50);
  ctx.closePath();
  ctx.fill();
  // inscription
  ctx.fillStyle = accent;
  ctx.fillRect(-3, -30, 6, 1.5);
  ctx.fillRect(-3, -22, 6, 1.5);
  ctx.fillRect(-3, -14, 6, 1.5);
}

function drawLibrary(ctx: CanvasRenderingContext2D, accent: string) {
  // Domed hut with stacked books peeking through arched door — Blog
  // dome
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(0, -22, 26, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  // wall base
  ctx.fillRect(-26, -22, 52, 26);
  // door
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(-8, 4);
  ctx.lineTo(-8, -8);
  ctx.arc(0, -8, 8, Math.PI, 0);
  ctx.lineTo(8, 4);
  ctx.closePath();
  ctx.fill();
  // lamp
  ctx.fillStyle = "#F6E27A";
  ctx.beginPath();
  ctx.arc(15, -14, 3, 0, Math.PI * 2);
  ctx.fill();
  // books peeking
  ctx.fillStyle = PAPER_2;
  ctx.fillRect(-3, -3, 6, 6);
}

function drawGateway(ctx: CanvasRenderingContext2D, accent: string) {
  // Torii-style gate — Contact
  ctx.fillStyle = INK;
  // uprights
  ctx.fillRect(-22, -46, 6, 52);
  ctx.fillRect(16, -46, 6, 52);
  // lintel
  ctx.beginPath();
  ctx.moveTo(-30, -50);
  ctx.lineTo(30, -50);
  ctx.lineTo(26, -42);
  ctx.lineTo(-26, -42);
  ctx.closePath();
  ctx.fill();
  // saffron sash
  ctx.fillStyle = accent;
  ctx.fillRect(-30, -50, 60, 4);
  // inner rail
  ctx.fillStyle = INK;
  ctx.fillRect(-24, -36, 48, 3);
}

function drawWell(ctx: CanvasRenderingContext2D, accent: string) {
  // A stone well — About
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.ellipse(0, 4, 22, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PAPER_2;
  ctx.beginPath();
  ctx.ellipse(0, -2, 20, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // roof supports
  ctx.strokeStyle = INK;
  ctx.beginPath();
  ctx.moveTo(-18, -4);
  ctx.lineTo(-10, -30);
  ctx.moveTo(18, -4);
  ctx.lineTo(10, -30);
  ctx.stroke();
  // little roof
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(-16, -28);
  ctx.lineTo(0, -42);
  ctx.lineTo(16, -28);
  ctx.closePath();
  ctx.fill();
  // rope inside
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(0, -30);
  ctx.stroke();
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  lm: Landmark,
  isRead: boolean,
  isNearest: boolean
) {
  // Paper plate
  const label = lm.name;
  const chapter = lm.chapter;

  ctx.font = "500 11px 'JetBrains Mono', ui-monospace, monospace";
  const chW = ctx.measureText(chapter).width;
  ctx.font = "italic 500 15px 'Fraunces', Georgia, serif";
  const lbW = ctx.measureText(label).width;
  const padX = 12;
  const gap = 8;
  const totalW = padX * 2 + chW + gap + lbW;
  const totalH = 26;

  const rx = x - totalW / 2;
  const ry = y - totalH / 2;

  // Plate background
  ctx.fillStyle = PAPER;
  ctx.strokeStyle = isNearest ? SAFFRON : RULE;
  ctx.lineWidth = isNearest ? 1.5 : 1;
  roundRect(ctx, rx, ry, totalW, totalH, 12);
  ctx.fill();
  ctx.stroke();

  // Chapter numeral (italic saffron)
  ctx.font = "italic 500 12px 'Fraunces', Georgia, serif";
  ctx.fillStyle = SAFFRON;
  ctx.textBaseline = "middle";
  ctx.fillText(chapter, rx + padX, ry + totalH / 2 + 1);

  // Label
  ctx.font = "italic 500 14px 'Fraunces', Georgia, serif";
  ctx.fillStyle = INK;
  ctx.fillText(label, rx + padX + chW + gap, ry + totalH / 2 + 1);

  // Read tick
  if (isRead) {
    ctx.fillStyle = SEAL;
    ctx.beginPath();
    ctx.arc(rx + totalW + 6, ry + totalH / 2, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}
