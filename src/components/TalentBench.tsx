import { motion } from "framer-motion";
import { Users, UserPlus, Heart, MessageSquare, Briefcase, Zap, Star, Shield, ArrowRight, MoreVertical, ShieldCheck } from "lucide-react";

export default function TalentBench() {
  const favorites = [
    {
      id: 1,
      name: "Alex Chen",
      role: "UI/UX Designer",
      status: "Available",
      lastHired: "2 weeks ago",
      trustScore: 92,
      skills: ["Figma", "Design Systems"],
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
    },
    {
      id: 2,
      name: "Maya Patel",
      role: "React Specialist",
      status: "Busy",
      lastHired: "1 month ago",
      trustScore: 98,
      skills: ["React", "TypeScript"],
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya"
    },
    {
      id: 3,
      name: "Jordan Lee",
      role: "Brand Strategist",
      status: "Available",
      lastHired: "Yesterday",
      trustScore: 85,
      skills: ["Branding", "Copy"],
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                <Users className="w-6 h-6" />
             </div>
             <h1 className="font-display font-black text-3xl text-[#1C1917]">Talent Bench</h1>
          </div>
          <p className="font-body text-sm text-[#6B7280]">Your private list of vetted freelancers ready for instant collaboration.</p>
        </div>
        <button className="px-8 py-3 bg-[#1C1917] text-white rounded-2xl font-heading font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-[#1A56DB] transition-all">
          <UserPlus className="w-4 h-4" />
          Add to Bench
        </button>
      </div>

      <div className="space-y-4">
        {favorites.map((talent, i) => (
          <motion.div
            key={talent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white rounded-3xl border border-[#EBEBEB] p-6 hover:border-[#1A56DB] hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5">
               <div className="relative">
                  <img src={talent.avatar} alt={talent.name} className="w-16 h-16 rounded-2xl bg-[#FAF8F5]" />
                  <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${talent.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <h3 className="font-heading font-bold text-lg text-[#1C1917]">{talent.name}</h3>
                     <Shield className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                     <span className="text-xs font-body text-[#9CA3AF]">{talent.role}</span>
                     <span className="text-[10px] text-[#D1D5DB]">•</span>
                     <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span className="text-xs font-mono-stats font-bold">{talent.trustScore}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:gap-8">
               <div className="hidden lg:block">
                  <span className="text-[9px] font-heading font-black text-[#9CA3AF] uppercase tracking-widest block mb-1">Top Skills</span>
                  <div className="flex gap-1.5">
                     {talent.skills.map(s => (
                       <span key={s} className="px-2 py-0.5 bg-[#FAF8F5] border border-[#EBEBEB] rounded-md text-[9px] font-heading font-bold text-[#6B7280]">
                         {s}
                       </span>
                     ))}
                  </div>
               </div>
               <div className="hidden sm:block">
                  <span className="text-[9px] font-heading font-black text-[#9CA3AF] uppercase tracking-widest block mb-1">Last Hired</span>
                  <span className="text-xs font-body text-[#1C1917] font-semibold">{talent.lastHired}</span>
               </div>
               <div className="flex items-center gap-2">
                  <button className="px-5 py-2.5 bg-[#FAF8F5] border border-[#EBEBEB] text-[#1C1917] rounded-xl text-[10px] font-heading font-black uppercase tracking-widest hover:bg-[#1C1917] hover:text-white transition-all">
                     View Profile
                  </button>
                  <button className="px-7 py-2.5 bg-[#1A56DB] text-white rounded-xl text-[10px] font-heading font-black uppercase tracking-widest hover:bg-[#1C1917] transition-all flex items-center gap-2">
                     Invite <Zap className="w-3 h-3" />
                  </button>
                  <button className="p-2.5 text-[#EBEBEB] hover:text-[#1C1917] transition-colors">
                     <MoreVertical className="w-5 h-5" />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
               <Heart className="w-6 h-6" />
            </div>
            <div>
               <h3 className="font-heading font-bold text-[#064E3B]">Priority Hiring Enabled</h3>
               <p className="font-body text-xs text-[#065F46] mt-0.5">Bench members respond 40% faster on average.</p>
            </div>
         </div>
         <button className="flex items-center gap-2 text-xs font-heading font-black text-[#064E3B] uppercase tracking-[0.2em] group">
            Invite All for New Project <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
         </button>
      </div>
    </div>
  );
}
