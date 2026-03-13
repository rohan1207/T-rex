import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Phone, Package, Factory, Award, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const SecondSection = () => {
  const features = [
    {
      Icon: Factory,
      title: "Advanced Manufacturing",
      subtitle: "State-of-the-art production facilities ensuring precision and quality in every container",
    },
    {
      Icon: Award,
      title: "Premium Quality",
      subtitle: "Industry-leading standards with rigorous quality control and testing processes",
    },
    {
      Icon: Shield,
      title: "Reliable Protection",
      subtitle: "Engineered containers that safeguard curd, paints and aquaculture products through robust performance",
    },
    {
      Icon: Package,
      title: "Custom Solutions",
      subtitle: "Tailored IML packaging designs to match your brand's unique requirements",
    },
  ];

  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  // Optimized spring config for smoother performance
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.01 };

  // Main image zoom effect - starts zoomed in, zooms out as you scroll
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 0.95]);
  const smoothScale = useSpring(scale, springConfig);

  // Floating decorative image - moves up (simplified)
  const yFloating1 = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const rotateFloating1 = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const smoothYFloating1 = useSpring(yFloating1, springConfig);
  const smoothRotateFloating1 = useSpring(rotateFloating1, springConfig);

  // Floating decorative image - moves down (simplified)
  const yFloating2 = useTransform(scrollYProgress, [0, 1], [-30, 50]);
  const rotateFloating2 = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const smoothYFloating2 = useSpring(yFloating2, springConfig);
  const smoothRotateFloating2 = useSpring(rotateFloating2, springConfig);

  return (
    <section
      ref={targetRef}
      className="relative bg-gradient-to-b from-[#FFF8F0] via-white to-[#F5EFE7] py-16 sm:py-20 px-4 sm:px-8 overflow-hidden min-h-screen"
    >
      {/* Background Text */}
      <motion.div
        className="absolute top-8 sm:top-0 left-0 right-0 text-center sm:text-[16vw] text-[13vw] font-bold text-[#C9A24D]/15 whitespace-nowrap z-0 leading-none select-none pointer-events-none"
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{ letterSpacing: "0.1em" }}
      >
        VISISHTA
      </motion.div>

      {/* Main Layout Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto pt-16 sm:pt-24 lg:pt-32 mt-20">
        {/* Left Side - Packaging Images (order-2 on mobile) */}
        <div className="w-full lg:w-1/2 relative flex justify-center items-center order-2 lg:order-1 mt-12 lg:mt-0">
          {/* Main packaging image in center */}
          <motion.div
            className="relative z-20 w-[80%] sm:w-[65%] lg:w-[90%] will-change-transform"
            style={{ scale: smoothScale }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="/image/ss2.png"
              alt="Premium IML Packaging Solutions"
              className="w-full h-full object-cover drop-shadow-2xl rounded-lg"
              loading="lazy"
              decoding="async"
              fetchPriority="high"
            />
          </motion.div>
        </div>

        {/* Right Side - Text Content (order-1 on mobile) */}
        <div className="w-full lg:w-1/2 lg:pl-16 order-1 lg:order-2 text-left lg:text-left">
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-5xl sm:text-6xl font-bold text-[#4A3530] leading-tight mb-6 z-40"
              style={{ letterSpacing: "0.02em", fontFamily: "'Playfair Display', serif" }}
            >
              CRAFTED WITH
              <br />
              <span className="text-[#C9A24D] drop-shadow-[0_2px_10px_rgba(201,162,77,0.3)]">EXCELLENCE</span>
            </h2>

            

            <div className="space-y-4 mb-8 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#C9A24D] rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-[#4A3530]/90 text-base font-semibold">
                  Precision-engineered IML containers for curd, paint, aquaculture, and fertilizer industries
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#C9A24D] rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-[#4A3530]/90 text-base font-semibold">
                  B2B-focused solutions with scalable production and bulk order capabilities
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#C9A24D] rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-[#4A3530]/90 text-base font-semibold">
                  Custom branding and design services to match your unique requirements
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-10">
              <Link
                to="/products"
                className="bg-[#4A3530] text-white px-8 py-4 text-sm font-semibold tracking-wide rounded-full hover:bg-[#5A4540] transition-all duration-500 w-full sm:w-auto shadow-lg hover:shadow-xl hover:shadow-[#C9A24D]/20 hover:scale-105 border-2 border-[#C9A24D]"
              >
                View Products
              </Link>

              <div className="flex items-center gap-4">
                <motion.div
                  className="w-12 h-12 bg-[#C9A24D]/20 rounded-full flex items-center justify-center shadow-lg shadow-[#C9A24D]/20"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Phone size={20} className="text-[#C9A24D]" />
                </motion.div>
                <span className="text-[#4A3530] font-medium text-base leading-tight">
                  Get Your<br />
                  <span className="text-[#C9A24D]">Custom Quote</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Decorative Images */}
      <motion.div
        className="absolute right-[0%] top-[10%] w-32 h-32 sm:w-48 sm:h-48 lg:w-60 lg:h-60 z-30 will-change-transform"
        style={{ y: smoothYFloating1, rotate: smoothRotateFloating1 }}
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <img
          src="/image/IML.webp"
          alt="IML Packaging Container"
          className="w-full h-full object-cover "
          loading="lazy"
          decoding="async"
        />
      </motion.div>

      <motion.div
        className="absolute left-[0%] sm:bottom-[25%] bottom-[15%] w-24 h-24 sm:w-40 sm:h-40 z-30 will-change-transform"
        style={{ y: smoothYFloating2, rotate: smoothRotateFloating2 }}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <img
          src="/image/ss.png"
          alt="IML Packaging Container"
          className="w-full h-full object-cover "
          loading="lazy"
          decoding="async"
        />
      </motion.div>

      {/* Features Ribbon */}
      <div className="relative z-20 mt-24 sm:mt-32 lg:mt-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 max-w-6xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 bg-[#5A4540] rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-xl hover:shadow-[#C9A24D]/20 border border-[#C9A24D]/20 hover:border-[#C9A24D] transition-all duration-500 group"
              whileHover={{ scale: 1.02, y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#C9A24D]/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9A24D]/30 transition-colors duration-500 shadow-lg shadow-[#C9A24D]/20">
                <feature.Icon className="text-[#C9A24D]" size={28} />
              </div>
              <div>
                <h3 className="font-bold text-[#C9A24D] tracking-wide text-sm sm:text-base mb-1">
                  {feature.title}
                </h3>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                  {feature.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SecondSection;
