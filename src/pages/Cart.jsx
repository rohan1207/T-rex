import React from "react";
import Navbar from "../components/Navbar";

const Cart = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="pt-28 px-6 sm:px-10 lg:px-16 max-w-5xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
        <h1 className="text-2xl sm:text-3xl font-light text-neutral-900 mb-6">
          Cart
        </h1>
        <p className="text-sm text-neutral-500">
          Cart functionality will be wired to backend and Razorpay checkout in the next step.
        </p>
      </main>
    </div>
  );
};

export default Cart;

