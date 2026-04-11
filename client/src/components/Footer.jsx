import { motion } from "motion/react";
import { FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    { icon: <FaLinkedinIn />, link: "#", name: "LinkedIn" },
    { icon: <FaGithub />, link: "#", name: "GitHub" },
    { icon: <FaTwitter />, link: "#", name: "Twitter" },
  ];
  return (
    <footer className="w-full py-12 border-t  border-white/4 max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="text-lg font-light tracking-widest text-white uppercase">
        Hirely<span className="text-amber-200">.</span>
      </div>
      <div className="text-neutral-600 text-sm font-light">
        &copy; {new Date().getFullYear()} Hirely Inc. All rights reserved.
      </div>
      <div className="flex space-x-8 text-neutral-500">
        {socialLinks.map((social, i) => (
          <motion.a
            key={i}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, color: "#FBBF24" }}
            className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-neutral-600 transition-colors bg-neutral-950"
            title={social.name}
          >
            {social.icon}
          </motion.a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
