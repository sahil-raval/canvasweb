/**
 * Preloader — "The Atelier"
 *
 * Ultra-premium entrance experience.
 *
 * Phases:
 *   enter  →  Background materialises, corner filaments draw in
 *   build  →  Progress ring fills 0→100, counter counts up, horizon lines extend
 *   exit   →  clip-path: circle(150% → 0%) — screen implodes to centre point
 *   done   →  unmounted
 *
 * Centering note: all absolutely-positioned Framer Motion elements that also
 * animate scale/opacity use `calc(50% - Npx)` for top/left so that Framer
 * Motion's own transform property is never conflicted by a CSS translate.
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import logoWhite from "@/assets/canvas/logo-white.png";

/* ─────────────────────────────────────────────────────────
   RING CONSTANTS  (all in px, relative to the SVG viewport)
───────────────────────────────────────────────────────── */
const R_OUTER  = 195;   // outermost decorative ring
const R_MID    = 172;   // middle accent ring
const R_PROG   = 152;   // progress arc ring
const R_INNER  = 112;   // inner subtle ring
const CX       = 220;   // SVG centre-x
const CY       = 220;   // SVG centre-y
const SVG_SIZE = 440;   // px — SVG viewport
const HALF_SVG = SVG_SIZE / 2; // 220  (used for calc() centering)

const circOf = (r: number) => 2 * Math.PI * r;

/* ─────────────────────────────────────────────────────────
   COUNT-UP HOOK
───────────────────────────────────────────────────────── */
function useCountUp(to: number, durationS: number, delayS: number) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let start: number | null = null;
      const tick = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / (durationS * 1000), 1);
        setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delayS * 1000);
    return () => clearTimeout(t);
  }, [to, durationS, delayS]);
  return val;
}

/* ─────────────────────────────────────────────────────────
   FILM GRAIN
───────────────────────────────────────────────────────── */
function Grain() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.032 }}
      aria-hidden
    >
      <filter id="atelier-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#atelier-grain)" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   CORNER FILAMENT  — thin L-bracket, luxury proportion
───────────────────────────────────────────────────────── */
function Filament({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const delay = { tl: 0.08, tr: 0.18, bl: 0.13, br: 0.23 }[pos];
  const base  = "absolute w-8 h-8 pointer-events-none";
  const cls   = {
    tl: "top-8 left-8 border-t border-l",
    tr: "top-8 right-8 border-t border-r",
    bl: "bottom-8 left-8 border-b border-l",
    br: "bottom-8 right-8 border-b border-r",
  }[pos];
  return (
    <motion.div
      className={`${base} ${cls} border-white/15`}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

/* ─────────────────────────────────────────────────────────
   HORIZON LINES — thin rules extending left & right of ring
───────────────────────────────────────────────────────── */
function HorizonLines({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="left"
            className="absolute pointer-events-none bg-white/10"
            style={{
              height: "1px",
              top: "50%",
              right: `calc(50% + ${R_OUTER + 18}px)`,
              left: 0,
            }}
            initial={{ scaleX: 0, originX: "right" }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0, originX: "right" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            key="right"
            className="absolute pointer-events-none bg-white/10"
            style={{
              height: "1px",
              top: "50%",
              left: `calc(50% + ${R_OUTER + 18}px)`,
              right: 0,
            }}
            initial={{ scaleX: 0, originX: "left" }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0, originX: "left" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   SVG RING ASSEMBLY
   KEY FIX: positioned with calc(50% - HALF_SVG px) so no
   `transform` is needed for centering — Framer Motion's
   own transform (scale/opacity) won't conflict.
───────────────────────────────────────────────────────── */
function RingAssembly({ progress, visible }: { progress: number; visible: boolean }) {
  const progCirc   = circOf(R_PROG);
  const dashOffset = progCirc * (1 - progress / 100);

  // 24 tick marks on outer ring — 4 cardinal marks larger
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const angle  = (i / 24) * 360;
    const rad    = (angle * Math.PI) / 180;
    const isCard = i % 6 === 0;
    const r1     = R_OUTER + 2;
    const r2     = R_OUTER + (isCard ? 12 : 7);
    return {
      x1: CX + r1 * Math.cos(rad - Math.PI / 2),
      y1: CY + r1 * Math.sin(rad - Math.PI / 2),
      x2: CX + r2 * Math.cos(rad - Math.PI / 2),
      y2: CY + r2 * Math.sin(rad - Math.PI / 2),
      isCard,
    };
  });

  // 4 cardinal dots outside ticks
  const cardinalDots = [0, 1, 2, 3].map(i => {
    const rad = (i / 4) * 2 * Math.PI - Math.PI / 2;
    const r   = R_OUTER + 18;
    return { cx: CX + r * Math.cos(rad), cy: CY + r * Math.sin(rad) };
  });

  // Leading edge glow dot
  const glowAngle = ((progress / 100) * 360 - 90) * (Math.PI / 180);
  const glowX     = CX + R_PROG * Math.cos(glowAngle);
  const glowY     = CY + R_PROG * Math.sin(glowAngle);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="ring"
          className="absolute pointer-events-none"
          style={{
            width:  SVG_SIZE,
            height: SVG_SIZE,
            /* calc() centering — no transform needed for positioning */
            top:  `calc(50% - ${HALF_SVG}px)`,
            left: `calc(50% - ${HALF_SVG}px)`,
          }}
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            overflow="visible"
          >
            {/* Outermost very faint ring */}
            <circle
              cx={CX} cy={CY} r={R_OUTER}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />

            {/* Cardinal dots — compass marks */}
            {cardinalDots.map((d, i) => (
              <circle
                key={i}
                cx={d.cx} cy={d.cy} r={1.5}
                fill="rgba(255,255,255,0.18)"
              />
            ))}

            {/* Tick marks */}
            {ticks.map((t, i) => (
              <line
                key={i}
                x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                stroke={t.isCard ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.07)"}
                strokeWidth={t.isCard ? 0.75 : 0.5}
              />
            ))}

            {/* Middle accent ring */}
            <circle
              cx={CX} cy={CY} r={R_MID}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.5"
            />

            {/* Progress track */}
            <circle
              cx={CX} cy={CY} r={R_PROG}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />

            {/* Progress arc — warm cream fill */}
            <circle
              cx={CX} cy={CY} r={R_PROG}
              fill="none"
              stroke="rgba(255,248,240,0.60)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray={progCirc}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${CX} ${CY})`}
              style={{ transition: "stroke-dashoffset 0.07s linear" }}
            />

            {/* Leading glow dot */}
            {progress > 2 && progress < 100 && (
              <>
                <circle cx={glowX} cy={glowY} r={5} fill="rgba(255,235,210,0.10)" />
                <circle cx={glowX} cy={glowY} r={2}   fill="rgba(255,248,240,0.95)" />
              </>
            )}

            {/* Inner breath ring */}
            <circle
              cx={CX} cy={CY} r={R_INNER}
              fill="none"
              stroke="rgba(255,255,255,0.035)"
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   GLOW — same centering technique as RingAssembly
───────────────────────────────────────────────────────── */
const GLOW_SIZE = 420;
const HALF_GLOW = GLOW_SIZE / 2;

function WineGlow() {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width:  GLOW_SIZE,
        height: GLOW_SIZE,
        top:  `calc(50% - ${HALF_GLOW}px)`,
        left: `calc(50% - ${HALF_GLOW}px)`,
        background:
          "radial-gradient(circle, rgba(120,34,72,0.50) 0%, rgba(80,20,48,0.22) 45%, transparent 72%)",
      }}
      initial={{ opacity: 0, scale: 0.55 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2.0, ease: "easeOut" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN PRELOADER
───────────────────────────────────────────────────────── */
interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<"enter" | "build" | "exit" | "done">("enter");
  const count = useCountUp(100, 2.2, 1.0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("build"), 850);
    const t2 = setTimeout(() => setPhase("exit"),  3400);
    const t3 = setTimeout(() => { setPhase("done"); onComplete(); }, 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  if (phase === "done") return null;

  const inBuild = phase === "build" || phase === "exit";

  return (
    <AnimatePresence>
      <motion.div
          key="atelier"
          className="fixed inset-0 z-[200] overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 85% 85% at 50% 50%, #1d0d17 0%, #0d0408 55%, #000000 100%)",
          }}
          initial={{ clipPath: "circle(150% at 50% 50%)" }}
          animate={
            phase === "exit"
              ? { clipPath: "circle(0% at 50% 50%)" }
              : { clipPath: "circle(150% at 50% 50%)" }
          }
          transition={
            phase === "exit"
              ? { duration: 1.1, ease: [0.76, 0, 0.24, 1] }
              : { duration: 0 }
          }
        >
          <Grain />

          {/* Corner filaments */}
          <Filament pos="tl" />
          <Filament pos="tr" />
          <Filament pos="bl" />
          <Filament pos="br" />

          {/* Horizon lines — appear in build phase */}
          <HorizonLines visible={inBuild} />

          {/* Wine glow — centered via calc(), no transform conflict */}
          <WineGlow />

          {/* Ring assembly — centered via calc(), no transform conflict */}
          <RingAssembly progress={count} visible={inBuild} />

          {/* ── CENTRE COMPOSITION ──
              The logo is the SOLE in-flow flex item → flex puts it at
              exactly 50% / 50%, matching the ring's calc() centre.
              Everything else is absolutely positioned around that point. */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

            {/* ── LOGO — anchored at viewport 50%/50% by flex ── */}
            <motion.img
              src={logoWhite}
              alt="Canvas Real Estate"
              style={{
                width: "clamp(160px, 20vw, 260px)",
                mixBlendMode: "screen",
                filter: "brightness(1.06) contrast(0.97)",
                position: "relative",
                zIndex: 1,
              }}
              initial={{ opacity: 0, scale: 0.80 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* ── ABSOLUTE ELEMENTS — all referenced to viewport 50% ── */}

            {/* Progress counter + bar */}
            <AnimatePresence>
              {inBuild && (
                <motion.div
                  key="counter"
                  className="absolute flex flex-col items-center gap-2.5"
                  style={{ top: "calc(50% + 170px)", left: "50%", x: "-50%" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Thin progress bar */}
                  <div className="relative w-24 h-px bg-white/8 overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-white/38"
                      animate={{ width: `${count}%` }}
                      transition={{ duration: 0.08, ease: "linear" }}
                    />
                  </div>

                  {/* Counter */}
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-white/45 font-serif tabular-nums"
                      style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.75rem)", lineHeight: 1, letterSpacing: "0.06em" }}
                    >
                      {String(count).padStart(3, "0")}
                    </span>
                    <span className="text-white/18 text-[9px] font-sans pb-0.5">%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Top-right label — Est. 2015 */}
            <motion.div
              className="absolute top-9 right-10 text-right"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <p className="text-white/18 text-[7.5px] uppercase tracking-[0.5em] font-sans">Est.</p>
              <p className="text-white/32 text-[9px] font-sans font-medium tracking-[0.3em] mt-0.5">2015</p>
            </motion.div>
          </div>

          {/* Deep vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 68% 68% at 50% 50%, transparent 30%, rgba(0,0,0,0.62) 100%)",
            }}
          />
      </motion.div>
    </AnimatePresence>
  );
}
