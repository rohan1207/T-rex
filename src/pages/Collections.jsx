import React from "react";
import Navbar from "../components/Navbar";

const Collections = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="pt-28 px-6 sm:px-10 lg:px-16 max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.32em] uppercase text-neutral-500 mb-3">
          Collections
        </p>
        <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 mb-4">
          AllDay Partner Tumblers
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl leading-relaxed">
          A focused curation of our everyday tumblers. We’re starting with two
          essentials — Sage Green and Bubblegum Pink — and will keep expanding
          this shelf as the family grows.
        </p>
      </main>
    </div>
  );
};

export default Collections;

