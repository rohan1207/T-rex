import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// All assets that must be in the browser cache before /home renders.
// Images are fetched in parallel while the loading video plays.
const PRELOAD_IMAGES = [
  "/tumbler.png",   // hero stage 0 + overlay bottle
  "/sipper.png",    // hero stage 1
  "/drink.png",     // hero stage 2
  "/inner.png",     // hero stage 3
  "/stone.png",     // hero stone decoration
  "/product1.png",  // Top Sellers card 1
  "/product2.png",  // Top Sellers card 2
  "/middel1.avif",  // SecondSection feature image
  "/logo.png",      // Navbar logo
];

const Loading = () => {
  const navigate   = useNavigate();
  const videoRef   = useRef(null);

  // Progress: video contributes 60%, images 40%
  const [videoProgress,  setVideoProgress]  = useState(0);  // 0-100
  const [imagesProgress, setImagesProgress] = useState(0);  // 0-100
  const [videoEnded,  setVideoEnded]  = useState(false);
  const [imagesReady, setImagesReady] = useState(false);

  const combinedProgress = Math.round(videoProgress * 0.6 + imagesProgress * 0.4);

  // ── Navigate when BOTH gates are open (effect, never inside setState) ────
  useEffect(() => {
    if (videoEnded && imagesReady) navigate("/home");
  }, [videoEnded, imagesReady, navigate]);

  // ── Preload images in parallel ───────────────────────────────────────────
  useEffect(() => {
    let loaded = 0;
    let cancelled = false;
    const total = PRELOAD_IMAGES.length;

    PRELOAD_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        if (cancelled) return;
        loaded += 1;
        setImagesProgress(Math.round((loaded / total) * 100));
        if (loaded === total) setImagesReady(true);
      };
      img.src = src;
    });

    return () => { cancelled = true; };
  }, []);

  // ── Video handlers ───────────────────────────────────────────────────────
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;
    setVideoProgress((video.currentTime / video.duration) * 100);
  };

  const handleEnded = () => {
    setVideoProgress(100);
    setVideoEnded(true);
  };

  // ── Hard-cap fallback: never block the user for more than 14 s ───────────
  useEffect(() => {
    const id = setTimeout(() => navigate("/home"), 14000);
    return () => clearTimeout(id);
  }, [navigate]);

  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6"
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Text', sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl flex flex-col items-center"
      >
        {/* Loading video */}
        <div className="w-full max-w-lg mx-auto flex items-center justify-center overflow-hidden leading-none bg-white relative">
          <video
            ref={videoRef}
            className="block w-full h-auto max-h-[40vh] sm:max-h-[50vh] md:max-h-[55vh] object-cover scale-[1.04]"
            autoPlay
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          >
            <source src="/loading1.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-white" />
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-md mt-8 sm:mt-10"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-xs tracking-[0.32em] uppercase text-neutral-600">
              {imagesReady ? "Ready" : "Loading assets"}
            </span>
            <span className="text-sm sm:text-base font-medium text-neutral-900 tabular-nums">
              {combinedProgress}%
            </span>
          </div>

          <div className="w-full h-[3px] rounded-full bg-neutral-200 overflow-hidden">
            <motion.div
              className="h-full bg-neutral-900"
              animate={{ width: `${combinedProgress}%` }}
              transition={{ ease: "easeOut", duration: 0.18 }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] sm:text-xs text-neutral-500">
            <span>
              {imagesReady
                ? `${PRELOAD_IMAGES.length} assets cached`
                : "Preparing experience"}
            </span>
            <span className="h-[1px] w-8 bg-neutral-300" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Loading;
