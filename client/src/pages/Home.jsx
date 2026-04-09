import CTA from "../components/CTA";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-300 font-sans overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default HomePage;
