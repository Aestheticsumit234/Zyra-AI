import CTA from "../components/CTA";
import Features from "../components/Features";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-300 font-sans overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      <Hero />
      <Marquee />
      <Features />
      <CTA />
    </div>
  );
};

export default HomePage;
