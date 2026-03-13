import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SecondSection from "../components/SecondSection";
const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Hero />
      <SecondSection />
    </div>
  );
};

export default Home;
