import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/4 max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="text-lg font-light tracking-widest text-white uppercase">
        Hirely<span className="text-amber-200">.</span>
      </div>
      <div className="text-neutral-600 text-sm font-light">
        &copy; {new Date().getFullYear()} Hirely Inc. All rights reserved.
      </div>
      <div className="flex space-x-8 text-neutral-500">
        <FaGithub
          size={20}
          className="hover:text-white cursor-pointer transition-colors duration-300"
        />
        <FaLinkedin
          size={20}
          className="hover:text-white cursor-pointer transition-colors duration-300"
        />
      </div>
    </footer>
  );
};

export default Footer;
