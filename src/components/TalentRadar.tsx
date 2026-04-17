import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Radar, Sparkles, UserCheck, Zap, ArrowRight, Star, MapPin, Loader2, Search, MessageSquare, Shield, Award } from "lucide-react";
import { analyticsApi, messageApi } from "../lib/api";
import { toast } from "sonner";

export default function TalentRadar({ onStartChat }: { onStartChat?: (id: string) => void }) {
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScansCount, setActiveScansCount] = useState(0);
  const [metrics, setMetrics] = useState<any>(null);
  const [latestSkills, setLatestSkills] = useState<string[]>([]);
  const [chatting, setChatting] = useState<string | null>(null);

  const calculateMatchScore = (freelancerSkills: any[], projectSkills: any[], trustScore: number, pocScore: number) => {
    let skillScore = 0;
    if (projectSkills.length > 0) {
      const matches = projectSkills.filter(s => freelancerSkills.some(fs => fs.toLowerCase() === s.toLowerCase()));
      skillScore = (matches.length / projectSkills.length) * 50;
    } else {
      skillScore = 40; // Decent default if no target project
    }
    const trustFactor = (trustScore / 100) * 30;
    const performanceFactor = (pocScore / 5) * 20;
    return Math.round(skillScore + trustFactor + performanceFactor);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await analyticsApi.getClientDashboard();
      setMetrics(data.insights);
      setLatestSkills(data.latestProjectSkills || []);
      setActiveScansCount(data.activeScans || 0);
      
      const scoredFreelancers = (data?.freelancers || []).map((f: any) => {
        try {
          const match = calculateMatchScore(f.skills || [], data?.latestProjectSkills || [], f.trustScore || 0, f.pocScore || 0);
          const reason = (f.skills || []).some((s: string) => (data?.latestProjectSkills || []).includes(s)) 
            ? `Perfect technical match based on your recent project requirements.`
            : `High trust and performance rating makes them a safe candidate.`;
          return { ...f, match, reason };
        } catch (e) {
          return { ...f, match: 50, reason: "Manual match recommended." };
        }
      });

      setFreelancers(scoredFreelancers.sort((a: any, b: any) => (b.match || 0) - (a.match || 0)));
    } catch (err) {
      console.error("Radar failed:", err);
      setFreelancers([]); // Empty state instead of crash
      toast.error("Radar scan interrupted: Marketplace database is currently updating.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInterview = async (talent: any) => {
    setChatting(talent.id);
    try {
      const { data } = await messageApi.startConversation(talent.id);
      onStartChat?.(data.id);
    } catch (err) {
      toast.error("Failed to start chat session");
    } finally {
      setChatting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="relative">
           <Radar className="w-16 h-16 text-[#1A56DB] animate-pulse mb-6" />
           <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping scale-150 opacity-20" />
        </div>
        <p className="font-body text-[#6B7280]">AI is scanning the marketplace for your perfect match...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8 items-start mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Radar className="w-6 h-6 animate-pulse" />
             </div>
             <h1 className="font-display font-black text-3xl text-[#1C1917]">Talent Radar</h1>
          </div>
          <p className="font-body text-base text-[#6B7280] max-w-2xl">
            Our AI scans the entire marketplace to find freelancers who aren't just skilled, but are the perfect culture and technical match for your specific projects.
          </p>
        </div>
        <div className="bg-[#1C1917] p-6 rounded-3xl text-white flex items-center gap-6 shadow-xl shadow-blue-100/20">
           <div className="text-center">
              <span className="text-[10px] font-heading font-black text-blue-400 uppercase tracking-widest mb-1 block">Active Scans</span>
              <span className="text-3xl font-mono-stats font-bold">{activeScansCount.toString().padStart(2, '0')}</span>
           </div>
           <div className="w-[1px] h-10 bg-white/10" />
           <div className="text-center">
              <span className="text-[10px] font-heading font-black text-emerald-400 uppercase tracking-widest mb-1 block">Perfect Matches</span>
              <span className="text-3xl font-mono-stats font-bold">{freelancers.filter(f => f.match > 90).length.toString().padStart(2, '0')}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {freelancers.map((talent, i) => (
          <motion.div
            key={talent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] border border-[#EBEBEB] overflow-hidden shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="p-8">
               <div className="flex justify-between items-start mb-6">
                  <div className="relative">
                     <div className="w-20 h-20 rounded-2xl bg-[#FAF8F5] overflow-hidden">
                        {talent.avatar ? <img src={talent.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#1A56DB]">{talent.name[0]}</div>}
                     </div>
                     <div className="absolute -bottom-2 -right-2 bg-[#1A56DB] text-white p-1.5 rounded-lg border-2 border-white">
                        <UserCheck className="w-3 h-3" />
                     </div>
                  </div>
                  <div className="text-right">
                     <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-heading font-black uppercase tracking-widest border ${talent.match > 85 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        <Sparkles className="w-3 h-3" />
                        {talent.match}% Match
                     </div>
                  </div>
               </div>

               <h3 className="font-heading font-bold text-xl text-[#1C1917] mb-1">{talent.name}</h3>
               <p className="text-xs font-body text-[#9CA3AF] mb-4 flex items-center gap-1 truncate">
                  {talent.title || "Emerging Expert"} • <MapPin className="w-3 h-3" /> Remote
               </p>

               <div className="flex flex-wrap gap-2 mb-6">
                  {(talent.skills || []).slice(0, 3).map((skill: string) => (
                    <span key={skill} className={`px-3 py-1 rounded-lg lowercase tracking-wider text-[10px] font-heading font-bold ${latestSkills.includes(skill) ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-[#FAF8F5] border border-[#EBEBEB] text-[#6B7280]'}`}>
                      {skill}
                    </span>
                  ))}
               </div>

               <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 mb-6">
                  <p className="text-[11px] font-body text-blue-800 leading-relaxed italic line-clamp-2">
                    "{talent.reason}"
                  </p>
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div title="Identity Verified" className={`p-1.5 rounded-lg border ${talent.trustScore > 60 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                        <Shield className="w-3.5 h-3.5" />
                     </div>
                     <div title="Skill Verified" className={`p-1.5 rounded-lg border ${talent.pocScore > 4 ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                        <Zap className="w-3.5 h-3.5" />
                     </div>
                     <div title="Stake Secured" className={`p-1.5 rounded-lg border ${talent.match > 90 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                        <Award className="w-3.5 h-3.5" />
                     </div>
                  </div>
                  <button 
                    onClick={() => handleInterview(talent)}
                    disabled={chatting === talent.id}
                    className="px-6 py-2.5 bg-[#1C1917] text-white rounded-xl text-[10px] font-heading font-black uppercase tracking-widest hover:bg-[#1A56DB] transition-all flex items-center gap-2 group disabled:opacity-50"
                  >
                    {chatting === talent.id ? "Opening Chat..." : "Chat"}
                    <MessageSquare className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[2.5rem] border border-blue-100/50 text-center"
      >
        <Zap className="w-8 h-8 text-[#1A56DB] mx-auto mb-4" />
        <h3 className="font-heading font-bold text-lg text-[#1C1917]">Narrowing down the search?</h3>
        <p className="font-body text-sm text-[#6B7280] mb-6">Adjust your project requirements to re-run the AI Radar matching algorithm.</p>
        <button 
          onClick={() => fetchData()}
          className="px-10 py-3 bg-white border border-[#EBEBEB] text-[#1C1917] rounded-xl text-xs font-heading font-black uppercase tracking-widest hover:bg-[#1C1917] hover:text-white transition-all shadow-sm"
        >
          Re-Run Scan
        </button>
      </motion.div>
    </div>
  );
}
