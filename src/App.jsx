import { useEffect, useState } from "react";
import Hero from "./components/hero";
import Navbar from "./components/navbar";
import OurMission from "./components/OurMission";
import Learn from "./components/Learn";
import GlobalLearners from "./components/GlobalLearners";
import Footer from "./components/Footer";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const SECTIONS = [
  { id: "section-hero", label: "Home" },
  { id: "section-learn", label: "Learn" },
  { id: "section-countries", label: "Countries" },
  { id: "section-mission", label: "Mission" },
  { id: "section-cta", label: "Start" },
];

export default function App() {
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [activeSection, setActiveSection] = useState("section-hero");

  useEffect(() => {
    const onScroll = () => {
      setShowBottomNav(window.scrollY > 120);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section with IntersectionObserver
  useEffect(() => {
    const observers = [];
    
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { threshold: 0.01, rootMargin: "-10% 0px -60% 0px" }
      );
      
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1d29] text-white relative overflow-hidden">
      {/* Soft warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#252a3a] via-[#1e2230] to-[#1a1d29]" />
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />
      
      {/* Soft ambient glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-amber-500/5 via-transparent to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-blue-500/5 via-transparent to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <Navbar activeSection={activeSection} />
        <Hero />
        <Learn />
        <GlobalLearners />
        <OurMission />
        <Footer />
      </div>

      <div
        className="fixed bottom-8 left-1/2 z-50 flex gap-2 bg-white/10 backdrop-blur-xl rounded-full p-2 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-[92vw] overflow-x-auto"
        style={{
          opacity: showBottomNav ? 1 : 0,
          transform: showBottomNav
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(16px)",
          pointerEvents: showBottomNav ? "auto" : "none",
          transition: "opacity 220ms ease, transform 220ms ease",
        }}
      >
        {SECTIONS.map(({ id, label }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => scrollToId(id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-lime-400 text-black"
                  : "text-white hover:text-lime-400"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}