import React from "react";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="pt-28 px-6 sm:px-10 lg:px-16 max-w-4xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-xs tracking-[0.32em] uppercase text-neutral-500 mb-3">
          About
        </p>
        <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 mb-6 leading-tight tracking-tight">
          Objects for everyday{" "}
          <span className="font-semibold text-[#7A9A7C]">rituals.</span>
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed mb-4">
          T-REX is a small studio obsessed with how everyday objects feel in the hand.
          We design tumblers that sit quietly on your desk, in your car, or beside
          your bed — simple forms, thoughtful proportions, and finishes that age well.
        </p>
        <p className="text-sm text-neutral-600 leading-relaxed mb-4">
          Every piece starts with food grade 304 stainless steel, double wall
          vacuum insulation, and a lid engineered for real life: 2-in-1 sip and flip
          options, straw friendly, and easy to clean.
        </p>
        <p className="text-sm text-neutral-600 leading-relaxed">
          As we grow the collection, we&apos;ll keep the same promise — fewer, better
          objects that make your daily rituals feel a little more considered.
        </p>
      </main>
    </div>
  );
};

export default About;

