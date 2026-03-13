import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Loading = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;
    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);
  };

  const handleEnded = () => {
    setProgress(100);
    navigate("/home");
  };

  // Safety: if video can't play or is very short, fall back after a few seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/home");
    }, 15000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6"
      style={{
        fontFamily:
          "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl flex flex-col items-center"
      >
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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-md mt-8 sm:mt-10"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-xs tracking-[0.32em] uppercase text-neutral-600">
              Loading experience
            </span>
            <span className="text-sm sm:text-base font-medium text-neutral-900 tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-full h-[3px] rounded-full bg-neutral-200 overflow-hidden">
            <motion.div
              className="h-full bg-neutral-900"
              style={{ width: `${progress}%` }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.18 }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] sm:text-xs text-neutral-500">
            <span>Preparing interface</span>
            <span className="h-[1px] w-8 bg-neutral-300" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Loading;

