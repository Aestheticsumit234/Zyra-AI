import { motion } from "framer-motion";
import { useState } from "react";
import {
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
} from "react-icons/hi";

const contactDetails = [
  {
    icon: <HiOutlineMail />,
    title: "Email Us",
    value: "support@hirely.in",
    link: "mailto:support@hirely.in",
  },
  {
    icon: <HiOutlinePhone />,
    title: "Call Us",
    value: "+91 91358 62748",
    link: "tel:+919135862748",
  },
  {
    icon: <HiOutlineLocationMarker />,
    title: "Visit Us",
    value: "Innovate Hub, Sector 62, Noida, India",
    link: "https://maps.app.goo.gl/YourMapLink",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");

    setTimeout(() => {
      console.log("Form Submitted:", formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus(""), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-20 px-6 font-sans antialiased selection:bg-amber-500/30">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6"
          >
            <span className="text-amber-200/80 text-[10px] font-bold tracking-[0.2em] uppercase">
              Get In Touch
            </span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">
            Connect with our{" "}
            <span className="italic text-amber-200/90 font-serif">
              Support Team.
            </span>
          </h1>
          <p className="text-neutral-500 text-sm font-light max-w-sm mx-auto leading-relaxed">
            Have questions about our platform or need technical assistance?
            We're here to help.
          </p>
        </header>

        <div className="grid md:grid-cols-[2fr,1.2fr] gap-12">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-neutral-900/10 border border-white/6 p-8 rounded-4xl space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your Name"
                  className="w-full bg-neutral-900/40 border border-white/8 text-white text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-amber-500/50 transition-colors placeholder-neutral-600"
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Your Email"
                  className="w-full bg-neutral-900/40 border border-white/8 text-white text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-amber-500/50 transition-colors placeholder-neutral-600"
                />
              </div>
            </div>
            <div className="relative">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="5"
                placeholder="How can we assist you?"
                className="w-full bg-neutral-900/40 border border-white/8 text-white text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-amber-500/50 transition-colors placeholder-neutral-600 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className={`w-full py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-500 ${
                status === "sending"
                  ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                  : "bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/10"
              }`}
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <p className="text-center text-green-400 text-xs mt-3">
                Message sent successfully!
              </p>
            )}
          </motion.form>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-video bg-neutral-900/20 border border-white/6 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5620102127264!2d77.36215577614488!3d28.61289138497676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce56193d39581%3A0xc3484f971b315266!2sNoida%20Sector%2062!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "grayscale(1) invert(0.9) contrast(1.2)",
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-60 group-hover:opacity-100 transition-opacity duration-700"
              ></iframe>
            </motion.div>

            <div className="space-y-5">
              {contactDetails.map((detail, i) => (
                <motion.a
                  key={i}
                  href={detail.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 bg-neutral-900/10 border border-white/6 p-4 rounded-xl hover:border-white/15 transition-all group"
                >
                  <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-neutral-500 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-all bg-neutral-950">
                    {detail.icon}
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium tracking-tight mb-0.5">
                      {detail.title}
                    </h4>
                    <p className="text-neutral-500 text-xs font-light">
                      {detail.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
