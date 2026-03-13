import React from "react";
import Navbar from "../components/Navbar";

const Journal = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="pt-28 px-6 sm:px-10 lg:px-16 max-w-5xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-xs tracking-[0.32em] uppercase text-neutral-500 mb-3">
          Journal
        </p>
        <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 mb-8 leading-tight tracking-tight">
          Notes from the{" "}
          <span className="font-semibold text-[#7A9A7C]">studio.</span>
        </h1>
        <div className="space-y-8 text-sm text-neutral-600">
          <article>
            <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-400 mb-2">
              MATERIALS
            </p>
            <h2 className="text-xl font-medium text-neutral-900 mb-2">
              Why we chose 304 stainless steel.
            </h2>
            <p>
              Durable, food safe, and endlessly recyclable — 304 stainless is the
              quiet hero behind every T-REX tumbler. It resists flavour transfer,
              doesn&apos;t hold onto odours, and stands up to daily use.
            </p>
          </article>
          <article>
            <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-400 mb-2">
              DESIGN
            </p>
            <h2 className="text-xl font-medium text-neutral-900 mb-2">
              The thinking behind AllDay Partner.
            </h2>
            <p>
              A form that fits most hands and most cup holders, with a 2-in-1 lid
              that switches from sip to straw without extra parts. The idea is simple:
              one tumbler that can follow you from desk to commute to bedside.
            </p>
          </article>
        </div>
      </main>
    </div>
  );
};

export default Journal;

