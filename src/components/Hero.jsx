import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const SAGE_DARK = "#7A9A7C";
const STEP_COOLDOWN   = 820;  // ms between steps — keeps story scrolls deliberate
const DELTA_THRESHOLD = 120;  // px of accumulated wheel delta required per step
const MAX_STORY_STAGE = 3; // 0-3 are story stages
const STAGE_REVEAL = 4;    // bottle in center, no text
const STAGE_FLY = 5;       // bottle flying to card

const inter = {
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Text', sans-serif",
};

const floatTransition = {
  duration: 5,
  repeat: Infinity,
  repeatType: "mirror",
  ease: [0.45, 0, 0.55, 1],
};

const IMAGES = ["/tumbler.png", "/sipper.png", "/drink.png", "/inner.png"];

// ─── Top Sellers data ────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    image: "./",
    name: "AllDay Partner Tumbler - Green",
    subtitle: "Trendy color block insulated tumbler · 304 stainless steel · Hot/cold 6–12 hrs · 2-in-1 lid, sip & flip straw · Car cup holder friendly.",
    price: "₹2,249.25",
    originalPrice: "₹2,999.00",
    savePercent: 25,
    rating: 4.9,
    reviews: 320,
    tag: "Best Seller",
  },
  {
    id: 2,
    image: "/product1.png",
    name: "AllDay Partner Tumbler - Bubblegum Pink",
    subtitle: "Trendy color block insulated tumbler · 304 stainless steel · Hot/cold 6–12 hrs · 2-in-1 lid, sip & flip straw · Car cup holder friendly.",
    price: "₹2,249.25",
    originalPrice: "₹2,999.00",
    savePercent: 25,
    rating: 4.9,
    reviews: 184,
    tag: "New Arrival",
  },
];

// ─── State machine ────────────────────────────────────────────────────────────
//
//  STORY(0-3) ──scroll down──> REVEAL(4) ──scroll down──> FLY(5) ──settled──> SETTLED(5)
//  STORY(0-3) <──scroll up──   REVEAL(4) <──reverse fly── FLY/SETTLED(5)
//
// Single source of truth: one `phase` object — no parallel booleans that can drift.

const PHASE = {
  STORY:    "story",    // stages 0-3, hero bottle visible, text visible
  REVEAL:   "reveal",  // stage 4, hero bottle fades out, fixed bottle appears at center
  FLYING:   "flying",  // fixed bottle flying to card
  SETTLED:  "settled", // bottle has landed in card
  REVERSE:  "reverse", // bottle flying back from card to center
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const StarRow = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width="14" height="14" viewBox="0 0 12 12"
        fill={s <= Math.round(rating) ? SAGE_DARK : "#e5e7eb"}>
        <path d="M6 1l1.4 2.8 3.1.4-2.25 2.2.53 3.1L6 8.1l-2.78 1.4.53-3.1L1.5 4.2l3.1-.4z" />
      </svg>
    ))}
    <span className="text-sm text-neutral-500 ml-1">{rating}</span>
  </div>
);

// ─── ProductCard ──────────────────────────────────────────────────────────────
const ProductCard = React.memo(({ product, index, imgRef, showHeroImage }) => {
  const [wishlisted, setWishlisted] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group flex flex-col bg-white rounded-none border border-neutral-100 hover:border-neutral-200 transition-all duration-500"
      style={inter}
    >
      <div ref={imgRef} className="relative overflow-hidden bg-neutral-50 aspect-[4/5]">
        <div
          className="absolute top-4 left-4 z-10 text-white text-xs tracking-[0.22em] uppercase px-3 py-1.5 rounded-full"
          style={{ backgroundColor: SAGE_DARK }}
        >
          {product.tag}
        </div>
        <button
          onClick={() => setWishlisted((p) => !p)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200"
        >
          <Heart
            size={15} strokeWidth={1.5}
            className={wishlisted ? "fill-red-400 stroke-red-400" : "stroke-neutral-400"}
          />
        </button>

        {/* Image: hidden on card 0 until settled, then show tumbler.png */}
        <AnimatePresence>
          {(index !== 0 || showHeroImage) && (
            <motion.img
              key={showHeroImage ? "hero" : product.image}
              src={showHeroImage ? "/tumbler.png" : product.image}
              alt={product.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <StarRow rating={product.rating} />
        <div>
          <h3 className="text-base sm:text-lg font-medium text-neutral-900 leading-snug tracking-tight">
            {product.name}
          </h3>
          <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed">{product.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-lg sm:text-xl font-semibold text-neutral-900">{product.price}</span>
          <span className="text-sm text-neutral-400 line-through">{product.originalPrice}</span>
          <span className="text-xs sm:text-sm ml-auto font-medium tracking-wide uppercase" style={{ color: SAGE_DARK }}>
            Save {product.savePercent}%
          </span>
        </div>
        <p className="text-xs text-neutral-400">Unit · Tax excluded</p>
        <div className="h-px w-full bg-neutral-100" />
        <motion.button
          whileHover={{ backgroundColor: SAGE_DARK, borderColor: SAGE_DARK, color: "#fff" }}
          transition={{ duration: 0.2 }}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 text-sm tracking-[0.2em] uppercase border text-neutral-800 bg-white transition-colors duration-200 rounded-full"
          style={{ borderColor: "#d4d4d4" }}
        >
          <ShoppingCart size={16} strokeWidth={1.5} />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
});

// ─── Story content ────────────────────────────────────────────────────────────
const STORY = [
  {
    eyebrow: "T‑Rex Collection · 2025",
    title: "Meet the T‑Rex Tumbler.",
    highlight: "Built for the unstoppable.",
    body: "Double‑wall insulated, sleek, and savage. Keeps cold drinks icy and hot drinks steaming for hours — a tumbler that refuses to let your drink go extinct.",
    bullets: [
      "Double‑Wall Vacuum Insulation — Keeps drinks cold up to 24 hrs & hot up to 12 hrs",
      "Leak‑Proof Flip Lid — Secure push‑button closure for on‑the‑go confidence",
      "18/8 Food‑Grade Stainless Steel — BPA‑free, rust‑resistant, and built to last",
      "Iconic T‑Rex Design — A bold statement piece that stands out anywhere",
    ],
  },
  {
    eyebrow: "Engineered for real life",
    title: "Flip, lock, and go.",
    highlight: "Control every sip.",
    body: "A precision‑engineered flip‑top sipper lid with a dual‑latch lock. Snaps open with one thumb and seals shut with a satisfying click — no mess, no fuss.",
    bullets: [
      "One‑Click Flip Lid — Effortless one‑handed open & close on the move",
      "Dual‑Latch Lock System — Double‑secured closure for zero accidental spills",
      "Ergonomic Sipper Spout — Smooth, comfortable sip every time — no straw needed",
      "Easy‑Clean Design — Lid fully disassembles for a deep, hygienic rinse",
    ],
  },
  {
    eyebrow: "Two ways to drink",
    title: "Sip slow or flow fast.",
    highlight: "Zero compromises.",
    body: "Flip the lid back and drink straight from the wide‑mouth spout for big, satisfying gulps. From commute to workout, it moves as fast as you do.",
    bullets: [
      "Wide‑Mouth Open Spout — Flip back for a fast, free‑flow drinking experience",
      "2‑in‑1 Drinking Modes — Switch between sipper spout & open‑mouth pour",
      "Gym & Adventure Ready — Built for high‑intensity, always‑moving moments",
      "Soft‑Touch Matte Finish — Non‑slip grip that feels as good as it looks",
    ],
  },
  {
    eyebrow: "Inside the T‑Rex core",
    title: "The science of staying power.",
    highlight: "Hot stays hot. Cold stays cold.",
    body: "A gleaming 18/8 stainless steel interior and double‑wall vacuum construction create an air‑tight barrier. Temperature locked in for hours.",
    bullets: [
      "Stays Cold 24 Hrs / Hot 12 Hrs — Vacuum insulation that actually delivers",
      "Mirror‑Polish Steel Interior — No rust, no odour, no taste transfer",
      "Double‑Wall Construction — Zero condensation, no wet hands or desks",
      "18/8 Food‑Grade Stainless Steel — Premium, toxin‑free, and long‑lasting",
    ],
  },
];

// ─── Session key ──────────────────────────────────────────────────────────────
// Persists across reloads within the same browser session so the hero story is
// not replayed every time the user reloads /home after already completing it.
const SESSION_KEY = "trex_hero_done";

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const heroRef  = useRef(null);
  const card0Ref = useRef(null);

  // If the user already completed the hero this session, skip straight to SETTLED
  const alreadyDone = typeof sessionStorage !== "undefined"
    && sessionStorage.getItem(SESSION_KEY) === "1";

  // ── Single phase object — single source of truth ──
  const phaseRef   = useRef(alreadyDone ? PHASE.SETTLED : PHASE.STORY);
  const [phase, _setPhase] = useState(alreadyDone ? PHASE.SETTLED : PHASE.STORY);
  const setPhase = useCallback((p) => { phaseRef.current = p; _setPhase(p); }, []);

  // Story stage: only meaningful while phase === PHASE.STORY
  const storyStageRef = useRef(0);
  const [storyStage, _setStoryStage] = useState(0);
  const setStoryStage = useCallback((s) => { storyStageRef.current = s; _setStoryStage(s); }, []);

  // Fly target: computed once when we first fly, stored immutably
  const flyTargetRef = useRef(null);
  const [flyTarget, setFlyTarget] = useState(null);

  // True aspect ratio (w/h) of tumbler.png — loaded once on mount
  const tumblerAspectRef = useRef(null);

  // Ref to the stage-0 tumbler img element rendered inside the hero section
  const heroTumblerRef = useRef(null);

  // Viewport center of that tumbler, measured just before the fly starts,
  // so the fixed overlay begins at the exact same pixel position
  const flyStartRef = useRef(null);

  // Scroll lock — start unlocked if the hero was already completed this session
  const [scrollLocked, setScrollLocked] = useState(!alreadyDone);

  // Throttle guard — shared across wheel + touch
  const lastInputTime = useRef(0);

  // Accumulated wheel delta — must reach DELTA_THRESHOLD before a step fires
  const deltaAccum = useRef(0);

  // Touch tracking
  const touchStartY = useRef(null);

  // Pending timers — cancel on fast re-trigger
  const pendingTimers = useRef([]);

  const scheduleTimer = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    pendingTimers.current.push(id);
    return id;
  }, []);

  const cancelAllTimers = useCallback(() => {
    pendingTimers.current.forEach(clearTimeout);
    pendingTimers.current = [];
  }, []);

  // ── Scroll lock ──────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = scrollLocked ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [scrollLocked]);

  // ── Compute fly target ───────────────────────────────────────────────────
  //
  // Returns the CENTER of where the settled bottle image will visually appear,
  // in viewport pixel coordinates (after the page has scrolled to heroH).
  //
  // Coordinate system: top:0 left:0 fixed anchor.
  // x = viewport left edge → right  (bottle center X)
  // y = viewport top  edge → bottom (bottle center Y)
  //
  // The card image wrapper has aspect-ratio 4/5 with p-6 (24px) padding.
  // tumbler.png is portrait. object-contain centers it inside the padded area.
  const computeFlyTarget = useCallback(() => {
    const heroEl = heroRef.current;
    const cardEl = card0Ref.current;
    if (!heroEl || !cardEl) return null;

    const heroH = heroEl.offsetHeight;
    const rect  = cardEl.getBoundingClientRect();

    // After scrollTo(heroH), card's viewport top = (rect.top + scrollY) - heroH
    const cardAbsTop    = rect.top + window.scrollY;
    const landedViewTop = cardAbsTop - heroH;

    // Inner drawable area (card has p-6 = 24px padding on each side)
    const PAD    = 24;
    const innerW = rect.width  - PAD * 2;
    const innerH = rect.height - PAD * 2;

    // Use the image's actual natural aspect ratio (w/h) so the computed size
    // exactly matches what object-contain renders in the card.
    // Falls back to 0.55 until the preload completes (first RAF).
    const IMG_ASPECT      = tumblerAspectRef.current ?? 0.55;
    const containerAspect = innerW / innerH;

    let imgW, imgH;
    if (IMG_ASPECT < containerAspect) {
      imgH = innerH;
      imgW = innerH * IMG_ASPECT;
    } else {
      imgW = innerW;
      imgH = innerW / IMG_ASPECT;
    }

    // Exact pixel center of where tumbler.png will visually sit in the card
    const imgCenterX = rect.left + PAD + (innerW - imgW) / 2 + imgW / 2;
    const imgCenterY = landedViewTop + PAD + (innerH - imgH) / 2 + imgH / 2;

    // Subtle diagonal tilt proportional to horizontal offset
    const tilt = Math.max(-18, Math.min(18, (imgCenterX - window.innerWidth * 0.5) / 16));

    // imgW drives the CSS width of the fixed overlay img — no framer scale needed
    return { x: imgCenterX, y: imgCenterY, imgW, imgH, tilt, heroH };
  }, []);

  // ── Initiate forward fly: REVEAL → FLYING → SETTLED ─────────────────────
  const startFly = useCallback(() => {
    // Recompute for fresh coordinates (layout may have shifted since REVEAL entry)
    const fresh = computeFlyTarget();
    const target = fresh ?? flyTargetRef.current;
    if (!target) return;

    flyTargetRef.current = target;
    setFlyTarget(target);
    setPhase(PHASE.FLYING);
    setScrollLocked(false);

    window.scrollTo({ top: target.heroH, behavior: "smooth" });

    scheduleTimer(() => {
      setPhase(PHASE.SETTLED);
      // Remember completion so a page reload doesn't re-lock scroll
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 1050);
  }, [computeFlyTarget, scheduleTimer, setPhase]);

  // ── Initiate reverse fly: SETTLED → REVERSE → REVEAL ────────────────────
  const startReverse = useCallback(() => {
    if (phaseRef.current !== PHASE.SETTLED) return;

    cancelAllTimers();
    setPhase(PHASE.REVERSE);
    window.scrollTo({ top: 0, behavior: "smooth" });

    scheduleTimer(() => {
      setPhase(PHASE.REVEAL);
      setScrollLocked(true);
      // Hero is back — clear the session flag so a reload replays the story
      sessionStorage.removeItem(SESSION_KEY);
    }, 900);
  }, [cancelAllTimers, scheduleTimer, setPhase]);

  // ── Step the story forward / backward ───────────────────────────────────
  const step = useCallback((dir) => {
    const now = Date.now();
    if (now - lastInputTime.current < STEP_COOLDOWN) return;
    lastInputTime.current = now;

    const p = phaseRef.current;

    if (dir > 0) {
      // Scrolling DOWN
      if (p === PHASE.STORY) {
        const next = storyStageRef.current + 1;
        if (next <= MAX_STORY_STAGE) {
          setStoryStage(next);
        } else {
          // End of story → reveal; pre-compute target so bottle is already card-sized
          const preTarget = computeFlyTarget();
          if (preTarget) { flyTargetRef.current = preTarget; setFlyTarget(preTarget); }
          setPhase(PHASE.REVEAL);
        }
      } else if (p === PHASE.REVEAL) {
        // Reveal → fly
        startFly();
      } else if (p === PHASE.SETTLED) {
        // Already settled, re-allow scrolling further down
        setScrollLocked(false);
      }
    } else {
      // Scrolling UP
      if (p === PHASE.STORY) {
        const prev = storyStageRef.current - 1;
        if (prev >= 0) setStoryStage(prev);
      } else if (p === PHASE.REVEAL) {
        // Reveal → back to last story step
        setPhase(PHASE.STORY);
        setStoryStage(MAX_STORY_STAGE);
      }
      // UP from FLYING/SETTLED handled by the scroll listener below
    }
  }, [setStoryStage, setPhase, startFly, computeFlyTarget]);

  // ── Wheel handler ────────────────────────────────────────────────────────
  const handleWheel = useCallback((e) => {
    const p = phaseRef.current;
    if (p === PHASE.SETTLED || p === PHASE.FLYING || p === PHASE.REVERSE) return;

    e.preventDefault();
    if (Math.abs(e.deltaY) < 3) return;

    // Accumulate delta — direction flip resets the counter
    const incoming = e.deltaY;
    if (
      (incoming > 0 && deltaAccum.current < 0) ||
      (incoming < 0 && deltaAccum.current > 0)
    ) {
      deltaAccum.current = 0; // user reversed direction mid-scroll
    }
    deltaAccum.current += incoming;

    // Only fire a step once we've crossed the threshold
    if (Math.abs(deltaAccum.current) < DELTA_THRESHOLD) return;

    deltaAccum.current = 0; // consume the accumulated delta
    step(incoming > 0 ? 1 : -1);
  }, [step]);

  // Attach wheel with { passive: false } so preventDefault works
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // ── Touch handlers ───────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const p = phaseRef.current;
    if (p === PHASE.SETTLED || p === PHASE.FLYING || p === PHASE.REVERSE) return;
    if (touchStartY.current == null) return;

    const diff = touchStartY.current - e.touches[0].clientY;
    if (Math.abs(diff) < 28) return;

    e.preventDefault();
    const now = Date.now();
    if (now - lastInputTime.current < STEP_COOLDOWN) return;

    step(diff > 0 ? 1 : -1);
    touchStartY.current = e.touches[0].clientY;
  }, [step]);

  // ── Scroll listener to trigger reverse when user scrolls up post-fly ────
  useEffect(() => {
    if (scrollLocked) return;
    let prevY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const p = phaseRef.current;

      if (y < prevY) {
        // Scrolling up
        if (p === PHASE.SETTLED) {
          const heroH = heroRef.current?.offsetHeight ?? window.innerHeight;
          // Only trigger reverse when near top of TopSellers section
          if (y <= heroH + 40) startReverse();
        }
      }
      prevY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollLocked, startReverse]);

  // ── Preload all hero images + measure tumbler aspect for flyTarget ───────────
  // sipper.png / drink.png / inner.png are kicked off in parallel so they're
  // in the browser cache before the user even starts scrolling.
  useEffect(() => {
    let cancelled = false;

    // Kick off parallel fetches for the non-tumbler images (fire-and-forget)
    ["/sipper.png", "/drink.png", "/inner.png"].forEach((src) => {
      const i = new window.Image();
      i.src = src;
    });

    // Tumbler needs onload to read its natural aspect ratio
    const img = new window.Image();
    img.onload = () => {
      if (cancelled) return;
      tumblerAspectRef.current = img.naturalWidth / img.naturalHeight;
      requestAnimationFrame(() => {
        if (cancelled) return;
        const t = computeFlyTarget();
        if (t) { flyTargetRef.current = t; setFlyTarget(t); }
      });
    };
    img.src = "/tumbler.png";
    return () => { cancelled = true; };
  }, [computeFlyTarget]);

  // ── Block user scroll during FLYING so the page can't scroll past heroH ────
  // window.scrollTo (programmatic) is unaffected; only wheel/touch is blocked.
  useEffect(() => {
    if (phase !== PHASE.FLYING) return;
    const block = (e) => e.preventDefault();
    window.addEventListener("wheel",     block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    return () => {
      window.removeEventListener("wheel",     block);
      window.removeEventListener("touchmove", block);
    };
  }, [phase]);

  // ── Cleanup timers on unmount ────────────────────────────────────────────
  useEffect(() => () => cancelAllTimers(), [cancelAllTimers]);

  // ── Derived display values ───────────────────────────────────────────────
  const showText        = phase === PHASE.STORY || phase === PHASE.REVEAL;
  const showHeroBottle  = phase === PHASE.STORY;
  // Hero bottle fades at REVEAL stage (fixed overlay takes over)

  // Fixed overlay: show during REVEAL, FLYING, REVERSE. Hide during STORY and SETTLED.
  const showFixedBottle = phase === PHASE.REVEAL || phase === PHASE.FLYING || phase === PHASE.REVERSE;

  // Card 0 shows tumbler only once SETTLED
  const bottleSettled = phase === PHASE.SETTLED;

  // ── Fixed bottle animation config ───────────────────────────────────────
  //
  // CSS anchor: position:fixed top:0 left:0.
  // motion x/y = direct viewport pixel coordinates of the bottle CENTER.
  // The img uses translate(-50%,-50%) so its center sits exactly at (x, y).
  //
  // Hero center: bottle floats here during REVEAL
  // Landing center: flyTarget.x / flyTarget.y (computed as viewport px after scroll)

  const heroCenterX = typeof window !== "undefined" ? window.innerWidth  * 0.5  : 0;
  const heroCenterY = typeof window !== "undefined" ? window.innerHeight * 0.45 : 0;
  const tilt = flyTarget?.tilt ?? 0;

  // No framer scale — bottle size is driven by the img CSS width alone.
  // At REVEAL: img is already at card-image width (flyTarget.imgW).
  // At FLYING: only x/y/rotate animate; size stays constant.
  // At REVERSE: starts at card position, animates back to hero center.
  const getFixedBottleInitial = () => {
    if (phase === PHASE.REVERSE && flyTarget) {
      return { opacity: 1, x: flyTarget.x, y: flyTarget.y, rotate: 0 };
    }
    return { opacity: 0, x: heroCenterX, y: heroCenterY, rotate: 0 };
  };

  const getFixedBottleAnimate = () => {
    if (phase === PHASE.REVERSE) {
      return { opacity: 1, x: heroCenterX, y: heroCenterY, rotate: [0, -tilt * 0.5, 0] };
    }
    if (phase === PHASE.REVEAL) {
      return { opacity: 1, x: heroCenterX, y: heroCenterY, rotate: 0 };
    }
    if (phase === PHASE.FLYING && flyTarget) {
      return { opacity: 1, x: flyTarget.x, y: flyTarget.y, rotate: [0, tilt * 0.5, 0] };
    }
    return { opacity: 0, x: heroCenterX, y: heroCenterY, rotate: 0 };
  };

  const fixedBottleTransition = {
    duration: 0.95,
    ease: [0.22, 1, 0.36, 1],
    rotate: { duration: 0.95, ease: "easeInOut" },
    opacity: { duration: 0.22, ease: "easeOut" },
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Fixed overlay bottle — anchor top:0 left:0, x/y are viewport px ── */}
      <AnimatePresence>
        {showFixedBottle && (
          <motion.div
            key="fixed-bottle"
            style={{ position: "fixed", top: 0, left: 0, zIndex: 200, pointerEvents: "none" }}
            initial={getFixedBottleInitial()}
            animate={getFixedBottleAnimate()}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={fixedBottleTransition}
          >
            <img
              src="/tumbler.png"
              alt="Tumbler"
              style={{
                // Width matches the exact pixel width tumbler.png occupies in the card.
                // This is computed at REVEAL entry so the bottle is already the right
                // size before it flies — no scale animation needed.
                width: flyTarget?.imgW ?? 420,
                height: "auto",
                display: "block",
                objectFit: "contain",
                transform: "translate(-50%, -50%)",
                filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.18))",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero section ── */}
      <section
        ref={heroRef}
        className="relative h-screen w-full bg-white overflow-hidden"
        style={inter}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Desktop layout */}
        <div className="hidden lg:block relative h-full">

          {/* Left text panel */}
          <AnimatePresence mode="wait">
            {showText && (
              <motion.div
                key={phase === PHASE.REVEAL ? "panel-reveal" : `panel-${storyStage}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 flex items-center px-16 pointer-events-none z-10"
                style={{ justifyContent: "flex-start" }}
              >
                {phase === PHASE.REVEAL ? (
                  /* ── Reveal panel — shown while tumbler sits center-stage ── */
                  <div className="pointer-events-auto flex flex-col gap-5 max-w-[360px]">
                    <p className="text-[10px] tracking-[0.38em] uppercase text-neutral-400">
                      T‑Rex Collection · 2025
                    </p>
                    <div className="space-y-2">
                      <h1 className="text-4xl xl:text-5xl font-light text-neutral-900 leading-[1.08] tracking-tight">
                        Yours to keep.
                      </h1>
                      <p className="text-sm font-medium" style={{ color: SAGE_DARK }}>
                        Ready to own the story.
                      </p>
                    </div>
                    <p className="text-[15px] text-neutral-500 leading-relaxed max-w-[340px]">
                      Every detail you've seen — the vacuum core, the precision lid, the stainless interior — lives in this single vessel. Grab yours before it sells out.
                    </p>
                    <ul className="space-y-1.5 text-[13px] text-neutral-500">
                      {[
                        "Available in 4 exclusive matte finishes",
                        "Ships within 48 hrs — free on orders above ₹999",
                        "30-day no-questions return policy",
                      ].map((item, i) => (
                        <li key={i} className="flex gap-2 leading-relaxed">
                          <span className="mt-[5px] h-[6px] w-[6px] shrink-0 rounded-full border border-neutral-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  /* ── Story panels (stages 0-3) ── */
                  <div className="pointer-events-auto flex flex-col gap-5 max-w-[360px]">
                    <p className="text-[10px] tracking-[0.38em] uppercase text-neutral-400">
                      {STORY[storyStage].eyebrow}
                    </p>
                    <div className="space-y-2">
                      <h1 className="text-4xl xl:text-5xl font-light text-neutral-900 leading-[1.08] tracking-tight">
                        {STORY[storyStage].title}
                      </h1>
                      <p className="text-sm font-medium" style={{ color: SAGE_DARK }}>
                        {STORY[storyStage].highlight}
                      </p>
                    </div>
                    <p className="text-[15px] text-neutral-500 leading-relaxed max-w-[340px]">
                      {STORY[storyStage].body}
                    </p>
                    <ul className="space-y-1.5 text-[13px] text-neutral-500">
                      {STORY[storyStage].bullets.map((item, i) => (
                        <li key={i} className="flex gap-2 leading-relaxed">
                          <span className="mt-[5px] h-[6px] w-[6px] shrink-0 rounded-full border border-neutral-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right CTA buttons */}
          <AnimatePresence>
            {showText && (
              <motion.div
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 28 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 flex items-center justify-end px-16 z-10 pointer-events-none"
              >
                <div className="pointer-events-auto flex flex-col items-end gap-4 max-w-[320px]">
                  <div className="flex items-center gap-3 flex-wrap justify-end min-w-[280px]">
                    <motion.button
                      whileHover={{ backgroundColor: "#5f7c62", borderColor: "#5f7c62" }}
                      transition={{ duration: 0.22 }}
                      className="flex-1 text-white text-[11px] tracking-[0.26em] uppercase px-9 py-3 rounded-full flex items-center justify-center gap-3 min-w-[200px]"
                      style={{ backgroundColor: SAGE_DARK, border: `1px solid ${SAGE_DARK}` }}
                    >
                      Shop Now <span className="text-white/60">→</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "#f5f5f5" }}
                      transition={{ duration: 0.22 }}
                      className="flex-1 text-neutral-700 text-[11px] tracking-[0.26em] uppercase px-9 py-3 rounded-full border border-neutral-300 flex items-center justify-center gap-3 bg-transparent min-w-[150px]"
                    >
                      Specifications
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero bottle + stone */}
          <motion.div
            className="absolute bottom-[-50%] left-1/2 -translate-x-1/2 flex flex-col items-center z-0"
            animate={{ opacity: showHeroBottle ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              className="flex flex-col items-center"
              animate={{ y: [0, -12, 0] }}
              transition={floatTransition}
            >
              {/*
               * All 4 images live in the DOM at all times — the browser fetches
               * them all on first render so scrolling never hits a loading lag.
               * Crossfade via animate={{ opacity }} with no AnimatePresence so
               * the active image fades IN while the previous fades OUT simultaneously,
               * eliminating the white-flash gap that mode="wait" caused.
               */}
              <div
                className="relative w-[340px] lg:w-[420px] xl:w-[480px]"
                style={{ marginBottom: "-60px", height: "560px" }}
              >
                {IMAGES.map((src, i) => (
                  <motion.img
                    key={src}
                    ref={i === 0 ? heroTumblerRef : null}
                    src={src}
                    alt="Premium Tumbler"
                    initial={{ opacity: i === storyStage ? 1 : 0 }}
                    animate={{ opacity: storyStage === i ? 1 : 0 }}
                    transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-auto object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.14)]"
                    style={{
                      maxWidth: i === 0 ? (flyTarget?.imgW ?? 270) : "100%",
                      pointerEvents: storyStage === i ? "auto" : "none",
                    }}
                  />
                ))}
              </div>
              <img
                src="/stone.png"
                alt=""
                className="w-[580px] lg:w-[720px] xl:w-[860px] object-contain"
              />
            </motion.div>
          </motion.div>

          {/* Scroll hint */}
          <AnimatePresence>
            {storyStage <= 1 && phase === PHASE.STORY && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20"
              >
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="h-px w-10 bg-neutral-300"
                />
                <span className="text-[9px] tracking-[0.35em] uppercase text-neutral-400">
                  Scroll to explore
                </span>
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="h-px w-10 bg-neutral-300"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden flex flex-col h-full px-6 pt-20 pb-6 space-y-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {showText && (
              <motion.div
                key={`mob-${storyStage}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-3"
              >
                <p className="text-[10px] tracking-[0.38em] uppercase text-neutral-400">
                  {STORY[storyStage].eyebrow}
                </p>
                <div className="space-y-1">
                  <h1 className="text-2xl font-light text-neutral-900 leading-tight tracking-tight">
                    {STORY[storyStage].title}
                  </h1>
                  <p className="text-[13px] font-medium" style={{ color: SAGE_DARK }}>
                    {STORY[storyStage].highlight}
                  </p>
                </div>
                <p className="text-[14px] text-neutral-500 leading-relaxed">
                  {STORY[storyStage].body}
                </p>
                <ul className="space-y-1.5 text-[12px] text-neutral-500">
                  {STORY[storyStage].bullets.map((item, i) => (
                    <li key={i} className="flex gap-2 leading-relaxed">
                      <span className="mt-[4px] h-[5px] w-[5px] shrink-0 rounded-full border border-neutral-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {showText && (
            <div className="flex gap-3">
              <button
                className="flex-1 text-white text-[11px] tracking-[0.26em] uppercase px-6 py-3.5 rounded-full"
                style={{ backgroundColor: SAGE_DARK }}
              >
                Shop Now →
              </button>
              <button className="flex-1 text-neutral-700 text-[11px] tracking-[0.26em] uppercase px-6 py-3.5 rounded-full border border-neutral-300 bg-white">
                Read More
              </button>
            </div>
          )}

          <motion.div
            className="mt-auto flex flex-col items-center"
            animate={{ opacity: showHeroBottle ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            style={{ transform: "translateY(-20px)" }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={`mob-img-${storyStage}`}
                src={IMAGES[Math.min(storyStage, MAX_STORY_STAGE)]}
                alt="Tumbler"
                initial={{ opacity: 0 }}
                animate={{ y: [2, -8, 2], opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.25 },
                  y: { ...floatTransition, duration: 5.5 },
                }}
                className="w-[75vw] max-w-[340px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] relative z-10"
                style={{ marginBottom: "-10px" }}
              />
            </AnimatePresence>
            <motion.img
              src="/stone.png"
              alt=""
              animate={{ y: [0, -6, 0] }}
              transition={{ ...floatTransition, duration: 6 }}
              className="w-[115vw] max-w-[520px] object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Top Sellers ── */}
      <section
        className="w-full bg-white pt-0 pb-20 sm:pb-28 px-6 sm:px-10 lg:px-16"
        style={inter}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-12 sm:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div>
              <p className="text-xs tracking-[0.32em] uppercase text-neutral-500 mb-3">
                Curated picks
              </p>
              <h2 className="text-3xl sm:text-4xl font-light text-neutral-900 leading-tight tracking-tight">
                Our Top{" "}
                <span className="font-semibold" style={{ color: SAGE_DARK }}>
                  Sellers.
                </span>
              </h2>
            </div>
            <a
              href="/shop"
              className="text-sm tracking-[0.22em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              View all products <span className="text-neutral-300">→</span>
            </a>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {PRODUCTS.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                imgRef={i === 0 ? card0Ref : undefined}
                showHeroImage={bottleSettled && i === 0}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;