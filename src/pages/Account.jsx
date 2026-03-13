import React from "react";
import Navbar from "../components/Navbar";
import { Routes, Route, Link, Navigate } from "react-router-dom";

const AccountLayout = ({ children }) => {
  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <main className="pt-28 px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-[220px,1fr]">
          <aside className="space-y-4 text-sm text-neutral-600">
            <p className="text-xs tracking-[0.32em] uppercase text-neutral-500">
              Account
            </p>
            <nav className="space-y-2">
              <Link to="overview" className="block hover:text-neutral-900">
                Overview
              </Link>
              <Link to="orders" className="block hover:text-neutral-900">
                Orders
              </Link>
              <Link to="addresses" className="block hover:text-neutral-900">
                Addresses
              </Link>
              <Link to="details" className="block hover:text-neutral-900">
                Details
              </Link>
            </nav>
          </aside>
          <section>{children}</section>
        </div>
      </main>
    </div>
  );
};

const Overview = () => (
  <div>
    <h1 className="text-2xl sm:text-3xl font-light text-neutral-900 mb-4">
      Welcome back.
    </h1>
    <p className="text-sm text-neutral-500">
      Once authentication and orders are connected, this page will show a quick
      snapshot of your recent activity.
    </p>
  </div>
);

const Orders = () => (
  <div>
    <h2 className="text-xl font-medium text-neutral-900 mb-3">Orders</h2>
    <p className="text-sm text-neutral-500">
      Your order history and tracking will appear here.
    </p>
  </div>
);

const Addresses = () => (
  <div>
    <h2 className="text-xl font-medium text-neutral-900 mb-3">Addresses</h2>
    <p className="text-sm text-neutral-500">
      Saved addresses and default shipping address will be managed here.
    </p>
  </div>
);

const Details = () => (
  <div>
    <h2 className="text-xl font-medium text-neutral-900 mb-3">Account details</h2>
    <p className="text-sm text-neutral-500">
      Name, email, and password settings will be available here after we wire
      up authentication.
    </p>
  </div>
);

const Account = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AccountLayout>
            <Overview />
          </AccountLayout>
        }
      />
      <Route
        path="overview"
        element={
          <AccountLayout>
            <Overview />
          </AccountLayout>
        }
      />
      <Route
        path="orders"
        element={
          <AccountLayout>
            <Orders />
          </AccountLayout>
        }
      />
      <Route
        path="addresses"
        element={
          <AccountLayout>
            <Addresses />
          </AccountLayout>
        }
      />
      <Route
        path="details"
        element={
          <AccountLayout>
            <Details />
          </AccountLayout>
        }
      />
      <Route path="*" element={<Navigate to="overview" replace />} />
    </Routes>
  );
};

export default Account;

