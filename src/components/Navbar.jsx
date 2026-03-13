import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Heart, ShoppingBag, Search } from "lucide-react";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Journal", href: "/journal" },
];

const overlayVariants = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    clipPath: "inset(0 0 100% 0)",
    opacity: 0,
    transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.2 + i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
  exit: (i) => ({
    opacity: 0,
    y: -20,
    transition: { duration: 0.25, delay: i * 0.03, ease: "easeIn" },
  }),
};

const inter = { fontFamily: "'Inter', sans-serif" };

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const LEFT_LINKS = NAV_LINKS.slice(0, 3);
  const RIGHT_LINKS = NAV_LINKS.slice(3);

  return (
    <>
      {/* Persistent bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div
          className={`pointer-events-auto mx-auto max-w-7xl px-4 sm:px-8 lg:px-10 flex items-center justify-between gap-4 sm:gap-8 transition-all duration-300 ${
            scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-4"
          }`}
          style={inter}
        >
          {/* Left desktop links */}
          <div className="hidden lg:flex flex-1 items-center justify-start gap-6 text-xs sm:text-sm tracking-[0.26em] uppercase text-neutral-800">
            {LEFT_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-black transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile: hamburger + small logo on left */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="w-9 h-9 flex items-center justify-center text-neutral-900 hover:opacity-60 transition-opacity duration-200"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <a href="/" className="flex items-center">
              <img
                src="/logo.jpg"
                alt="T-Rex"
                className="h-7 w-auto"
              />
            </a>
          </div>

          {/* Center logo (desktop) */}
          <a href="/" className="hidden lg:flex items-center justify-center flex-shrink-0">
            <img
              src="/logo.jpg"
              alt="T-Rex"
              className="h-14 sm:h-16 lg:h-20 w-auto"
            />
          </a>

          {/* Right side: links + icons */}
          <div className="flex items-center gap-4 sm:gap-6 justify-end lg:flex-1">
            {/* Desktop right links */}
            <div className="hidden lg:flex items-center gap-6 text-xs sm:text-sm tracking-[0.26em] uppercase text-neutral-800">
              {RIGHT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-black transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Icon cluster */}
            <div className="flex items-center gap-4 sm:gap-5 text-neutral-900">
              {[{ Icon: User, label: "Account" }, { Icon: Heart, label: "Wishlist" }].map(
                ({ Icon, label }) => (
                  <button
                    key={label}
                    aria-label={label}
                    className="hidden sm:flex items-center justify-center hover:opacity-60 transition-opacity"
                  >
                    <Icon size={18} strokeWidth={1.4} />
                  </button>
                )
              )}
              <button
                aria-label="Cart"
                className="flex items-center justify-center hover:opacity-60 transition-opacity"
              >
                <ShoppingBag size={18} strokeWidth={1.4} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen overlay (mobile only) */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] bg-white flex flex-col overflow-hidden lg:hidden"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-5 flex-shrink-0">
              <span
                className="text-[10px] tracking-[0.35em] uppercase text-neutral-400"
                style={inter}
              >
                Menu
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 flex items-center justify-center text-neutral-900 hover:opacity-60 transition-opacity duration-200"
              >
                <X size={20} strokeWidth={1.4} />
              </button>
            </div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className="h-px bg-neutral-100 mx-5 sm:mx-6 origin-left flex-shrink-0"
            />

            {/* Search */}
            <div className="px-5 sm:px-6 mt-6 flex-shrink-0">
              <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
                <Search size={15} strokeWidth={1.4} className="text-neutral-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="w-full text-sm text-neutral-900 placeholder-neutral-300 bg-transparent outline-none"
                  style={inter}
                />
              </div>
            </div>

            {/* Nav links */}
            <div className="flex-1 flex flex-col justify-center px-5 sm:px-6 gap-2 overflow-hidden">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-4 py-2.5"
                  style={inter}
                >
                  <span className="text-[10px] tracking-widest text-neutral-300 w-5 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-3xl sm:text-4xl font-light text-neutral-900 leading-tight tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Bottom bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="px-5 sm:px-6 py-6 flex items-center justify-between flex-shrink-0"
            >
              <div
                className="flex gap-4 text-[10px] tracking-[0.28em] uppercase text-neutral-400"
                style={inter}
              >
                <a href="/privacy" className="hover:text-neutral-700 transition-colors">
                  Privacy
                </a>
                <a href="/terms" className="hover:text-neutral-700 transition-colors">
                  Terms
                </a>
              </div>
              <div className="flex items-center gap-4 text-neutral-400">
                <User size={17} strokeWidth={1.4} />
                <Heart size={17} strokeWidth={1.4} />
                <ShoppingBag size={17} strokeWidth={1.4} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
