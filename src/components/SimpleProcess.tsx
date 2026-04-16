import { motion } from "framer-motion";
import { UserPlus, Search, DollarSign, ArrowRight } from "lucide-react";

export default function SimpleProcess({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      desc: "Sign up in minutes. Add your skills, set your rate, and showcase your best work.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: Search,
      title: "Browse & Apply",
      desc: "Explore hundreds of projects. Filter by budget, category, and deadline. Submit targeted proposals.",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: DollarSign,
      title: "Get Hired & Earn",
      desc: "Win projects, deliver great work, collect reviews, and build your reputation fast.",
      color: "text-amber-600",
      bg: "bg-amber-50"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <div className="text-center mb-20">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-heading font-black text-[#1A56DB] uppercase tracking-[0.2em] mb-4 block"
        >
          Simple Process
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-black text-5xl md:text-6xl text-[#1C1917] mb-6"
        >
          From Zero to <br /><span className="text-[#1A56DB]">First Client</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-body text-lg text-[#6B7280] max-w-2xl mx-auto"
        >
          Everything you need to launch your freelance career, simplified into three powerful steps.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        {/* Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-[#EBEBEB] to-transparent -z-10" />

        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 + 0.3 }}
            className="flex flex-col items-center text-center group"
          >
            <div className={`w-20 h-20 rounded-3xl ${step.bg} ${step.color} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 relative`}>
               <step.icon className="w-10 h-10" />
               <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#1C1917] text-white rounded-full flex items-center justify-center font-mono-stats font-bold text-xs">
                 {i + 1}
               </div>
            </div>
            <h3 className="font-heading font-bold text-xl text-[#1C1917] mb-4">{step.title}</h3>
            <p className="font-body text-sm text-[#6B7280] leading-relaxed mb-8 px-4">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 p-12 bg-[#1C1917] rounded-[3rem] text-white overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="max-w-md">
              <h2 className="font-display font-black text-3xl mb-4">Ready to start earning?</h2>
              <p className="font-body text-[#9CA3AF] text-sm">Join thousands of freelancers who found their first client this week on FreelanceUp.</p>
           </div>
           <button 
             onClick={() => onNavigate?.("login")}
             className="px-10 py-5 bg-[#1A56DB] text-white rounded-2xl font-heading font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#1C1917] transition-all flex items-center gap-3 group"
           >
             Get Started Now
             <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
           </button>
        </div>
      </motion.div>
    </div>
  );
}
