import React from "react";
import Navbar from "../components/Navbar";

const Contact = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="pt-28 px-6 sm:px-10 lg:px-16 max-w-4xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-xs tracking-[0.32em] uppercase text-neutral-500 mb-3">
          Contact
        </p>
        <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 mb-6 leading-tight tracking-tight">
          We&apos;re here to{" "}
          <span className="font-semibold text-[#7A9A7C]">help.</span>
        </h1>
        <div className="grid gap-8 sm:grid-cols-2 mb-10">
          <div className="space-y-3 text-sm text-neutral-600">
            <p className="font-medium text-neutral-900">Support</p>
            <p>Questions about your order or product care?</p>
            <p className="text-neutral-900">support@trex.studio</p>
          </div>
          <div className="space-y-3 text-sm text-neutral-600">
            <p className="font-medium text-neutral-900">Wholesale</p>
            <p>For bulk, corporate, or custom color requests.</p>
            <p className="text-neutral-900">studio@trex.studio</p>
          </div>
        </div>
        <form className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs tracking-[0.22em] uppercase text-neutral-500 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs tracking-[0.22em] uppercase text-neutral-500 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs tracking-[0.22em] uppercase text-neutral-500 mb-1">
              Message
            </label>
            <textarea
              rows={4}
              className="w-full border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center px-6 py-2.5 text-xs tracking-[0.26em] uppercase bg-[#7A9A7C] text-white"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default Contact;

