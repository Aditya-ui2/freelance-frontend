import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Briefcase, ThumbsUp } from "lucide-react";

const words = ["Gig", "Project", "Client", "Career"];

export default function HeroSection({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Users, value: "12K+", label: "New Freelancers", color: "bg-blue-50 text-[#1A56DB] border-blue-100" },
    { icon: Briefcase, value: "3K+", label: "Projects Posted", color: "bg-amber-50 text-[#F59E0B] border-amber-100" },
    { icon: ThumbsUp, value: "98%", label: "Satisfaction Rate", color: "bg-emerald-50 text-[#10B981] border-emerald-100" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-texture" style={{ backgroundColor: "#FAF8F5" }}>
      {/* Gradient mesh background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 pt-24 pb-16 text-center">
        {/* Tag pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#EBEBEB] rounded-full text-sm font-heading font-semibold text-[#1A56DB] shadow-sm mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>The platform built for new freelancers</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-display font-black text-[56px] sm:text-[72px] lg:text-[88px] leading-none tracking-tight text-[#1C1917] mb-6"
          style={{ letterSpacing: "-0.03em" }}
        >
          Your First{" "}
          <span
            className="inline-block min-w-[3ch] text-center"
            style={{
              transition: "opacity 0.3s ease, transform 0.3s ease",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-12px)",
            }}
          >
            <span className="gradient-text-blue">{words[wordIndex]}</span>
          </span>
          <br />
          <span className="text-[#1C1917]">Starts Here</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="font-body text-lg sm:text-xl text-[#6B7280] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          FreelanceUp levels the playing field for emerging freelancers. Get discovered by real clients, land meaningful projects, and build a career on your terms — no experience required.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={() => onNavigate?.("login")}
            className="group flex items-center gap-2 px-8 py-4 bg-[#1A56DB] text-white font-heading font-semibold text-base rounded-2xl hover:bg-[#1648C4] transition-all btn-press shadow-lg shadow-blue-200 hover:shadow-blue-300 animate-pulse-glow"
          >
            Find Talent
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate?.("login")}
            className="flex items-center gap-2 px-8 py-4 bg-white text-[#1C1917] font-heading font-semibold text-base rounded-2xl border border-[#EBEBEB] hover:border-[#1A56DB] hover:text-[#1A56DB] transition-all btn-press shadow-sm"
          >
            Start Freelancing
          </button>
        </motion.div>

        {/* Floating Stat Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              className={`flex items-center gap-3 px-5 py-3 bg-white border rounded-2xl shadow-sm ${stat.color}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-mono-stats font-bold text-base text-[#1C1917] leading-none">{stat.value}</div>
                <div className="font-body text-xs text-[#6B7280] mt-0.5">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-body text-[#9CA3AF]">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-6 bg-gradient-to-b from-[#EBEBEB] to-transparent rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
