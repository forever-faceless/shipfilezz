import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Nav from "./components/Navbar";
import { Toaster } from "sonner";
import Home from "./pages/home";
import Contact from "./pages/contact";
import About from "./pages/about";
import NearBy from "./pages/nearby";
import Privacy from "./pages/privacy";
import Receiver from "./pages/receiver";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      <Nav />
      <Outlet />
      <Toaster />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Wrap all routes inside Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="nearBy" element={<NearBy />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="receiver" element={<Receiver />} />

        <Route
          path="*"
          element={<h1 className="text-center text-xl">404 Not Found</h1>}
        />
      </Route>
    </Routes>
  );
};

export default App;
