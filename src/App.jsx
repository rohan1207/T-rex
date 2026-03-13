import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Loading from "./pages/Loading.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Collections from "./pages/Collections.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Journal from "./pages/Journal.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Account from "./pages/Account.jsx";

// ── Mobile gate — shown only on small screens ─────────────────────────────
const MobileGate = () => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 9999,
    background: "#fff",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "2rem",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  }}>
    <img src="/logo.png" alt="T-Rex" style={{ width: 56, marginBottom: "2rem", opacity: 0.85 }} />
    <p style={{
      fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase",
      color: "#9ca3af", marginBottom: "1.25rem",
    }}>
      T‑Rex Collection · 2025
    </p>
    <h1 style={{
      fontSize: "1.75rem", fontWeight: 300, color: "#171717",
      lineHeight: 1.15, letterSpacing: "-0.02em",
      textAlign: "center", marginBottom: "1rem",
    }}>
      Best viewed on<br />a desktop.
    </h1>
    <p style={{
      fontSize: "0.9rem", color: "#737373", fontWeight: 300,
      lineHeight: 1.65, textAlign: "center", maxWidth: 280,
      marginBottom: "2rem",
    }}>
      Our mobile experience is on its way. For now, open this page on a laptop or desktop for the full T‑Rex story.
    </p>
    <span style={{
      fontSize: "0.65rem", letterSpacing: "0.24em", textTransform: "uppercase",
      color: "#7A9A7C", fontWeight: 500,
    }}>
      Coming to mobile soon
    </span>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      {/* Show gate on phones/tablets (< 1024 px); hidden on desktop via CSS */}
      <div className="block lg:hidden">
        <MobileGate />
      </div>

      <div className="hidden lg:block">
        <Routes>
          <Route path="/" element={<Loading />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account/*" element={<Account />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
