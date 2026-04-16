import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Target, Lock, CheckCircle2, Award, Zap, AlertCircle, TrendingUp, Clock, Terminal } from "lucide-react";
import { challengeApi } from "../lib/api";
import { toast } from "sonner";
import ChallengeModal from "./ChallengeModal";

export default function ReputationVault({ user, onRefresh }: { user: any; onRefresh?: () => void }) {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [cooldown, setCooldown] = useState<{ active: boolean; nextAvailableAt: string } | null>(null);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<string>("");

  const trustScore = user?.trustScore || 0;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!cooldown?.active) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const next = new Date(cooldown.nextAvailableAt).getTime();
      const diff = next - now;

      if (diff <= 0) {
        setCooldown({ active: false, nextAvailableAt: "" });
        fetchData();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCooldownTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await challengeApi.getAll();
      if (data.cooldown) {
        setCooldown({ active: true, nextAvailableAt: data.nextAvailableAt });
      } else {
        setChallenges(data.challenges || []);
        setCooldown({ active: false, nextAvailableAt: "" });
      }
    } catch (err) {
      toast.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTask = (challenge: any) => {
    setSelectedChallenge(challenge);
  };
  
  const microTasks = Array.isArray(user?.microTasks) 
    ? user.microTasks 
    : (typeof user?.microTasks === 'string' ? JSON.parse(user.microTasks) : []);

  const isSuccessful = (status: string) => status === 'success' || status === 'complete';
  const completedCount = microTasks.filter((t: any) => isSuccessful(t.status)).length;

  const coreVerifications = [
    { 
      id: "identity", 
      title: "Identity Verified", 
      status: user?.isIdentityVerified ? "complete" : "in-progress", 
      desc: user?.isIdentityVerified ? "Government ID and social profiles linked" : "Verify identity to build foundational trust", 
      icon: Shield, 
      color: "text-[#10B981]",
      bg: "bg-green-50/50"
    },
    { 
      id: "technical", 
      title: "Skill Verification", 
      status: completedCount > 0 ? "complete" : "in-progress", 
      desc: `${completedCount} Challenges Completed`, 
      icon: Zap, 
      color: "text-[#6366F1]",
      bg: "bg-indigo-50/50"
    },
    { 
      id: "stake", 
      title: "Rep-Stake", 
      status: user?.repStakeStatus === "complete" ? "complete" : "in-progress", 
      desc: user?.repStakeStatus === "complete" ? "Verified stake security" : "Complete successful projects to unlock staking", 
      icon: Award, 
      color: "text-[#F59E0B]",
      bg: "bg-orange-50/50"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side: Trust Overview */}
        <div className="w-full lg:w-1/3 pt-0 lg:pt-0">
          <div className="sticky top-24 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1C1917] rounded-[2rem] p-8 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Shield className="w-32 h-32" />
              </div>
              
              <h2 className="font-display font-black text-2xl mb-2">Trust Score</h2>
              <p className="font-body text-sm text-[#9CA3AF] mb-8">Higher score = Lower commission and Higher visibility.</p>
              
              <div className="relative w-48 h-48 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96" cy="96" r="80"
                    fill="transparent"
                    stroke="#2D2A28"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx="96" cy="96" r="80"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="12"
                    strokeDasharray={502.4}
                    initial={{ strokeDashoffset: 502.4 }}
                    animate={{ strokeDashoffset: 502.4 * (1 - trustScore / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-mono-stats font-bold">{trustScore}</span>
                  <span className="text-[10px] font-heading font-bold text-[#10B981] uppercase tracking-widest">Growth Level</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-heading font-bold px-4">
                <span className="text-[#9CA3AF]">NEWBIE</span>
                <div className="flex items-center gap-1 text-[#10B981]">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12 this week</span>
                </div>
                <span className="text-white">PRO</span>
              </div>
            </motion.div>

            <div className="bg-white rounded-[2rem] border border-[#EBEBEB] p-6 space-y-4 shadow-sm">
              <h3 className="font-heading font-bold text-[#1C1917]">Why this matters?</h3>
              <p className="font-body text-xs text-[#6B7280] leading-relaxed">
                New freelancers without reviews use the **Reputation Vault** to prove they are reliable. A score above 70 bypasses many traditional "Expert Only" project filters.
              </p>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl">
                <Lock className="w-5 h-5 text-[#1A56DB]" />
                <p className="text-[10px] font-body text-[#1A56DB]">
                  Your vault data is encrypted and only shared as a verified trust signal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Verifications and Tasks */}
        <div className="flex-1 w-full space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-black text-2xl text-[#1C1917]">Proof of Talent</h2>
              <span className="text-[10px] font-heading font-black bg-[#EBEBEB] px-3 py-1 rounded-full uppercase tracking-widest">Verified Pillars</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coreVerifications.map((v) => (
                <motion.div
                  key={v.id}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-[2rem] border border-[#EBEBEB] hover:border-[#1A56DB] transition-all shadow-sm relative overflow-hidden group"
                >
                  <div className={`w-12 h-12 rounded-2xl ${v.bg} flex items-center justify-center mb-4 ${v.color}`}>
                    <v.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-sm text-[#1C1917] mb-1">{v.title}</h4>
                  <p className="font-body text-[11px] text-[#6B7280] mb-4 leading-normal">{v.desc}</p>
                  
                  <div className="flex items-center gap-2">
                    {v.status === "complete" ? (
                      <div className="flex items-center gap-1.5 text-[10px] font-heading font-black text-[#10B981]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        VERIFIED
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[10px] font-heading font-black text-[#F59E0B]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                        BUILDING TRUST
                      </div>
                    )}
                  </div>

                  {v.id === "technical" && microTasks.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-[#F5F3F0] space-y-2">
                      <p className="text-[9px] font-heading font-black text-[#9CA3AF] uppercase tracking-widest">Recent Success</p>
                      <div className="flex flex-wrap gap-1.5">
                        {microTasks.filter((t: any) => isSuccessful(t.status)).slice(0, 3).map((task: any, i: number) => (
                          <div key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-[9px] font-body font-bold border border-green-100">
                            {task.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-[#EBEBEB] overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-[#F5F3F0] flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-transparent">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#1C1917]">Vault Challenges</h3>
                <p className="text-xs font-body text-[#6B7280]">Complete these to instantly boost your trust score.</p>
              </div>
              <Target className="w-6 h-6 text-[#1A56DB]" />
            </div>
            
            <div className="divide-y divide-[#F5F3F0]">
              {loading ? (
                <div className="p-12 text-center text-[#6B7280] font-body text-sm">Loading challenges...</div>
              ) : cooldown?.active ? (
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 bg-orange-50/30">
                  <div className="p-4 bg-orange-100 rounded-full text-orange-600 animate-pulse">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-[#1C1917]">Challenge Cooldown Active</h4>
                    <p className="text-sm font-body text-[#6B7280] max-w-xs mx-auto mt-1">
                      You can attempt a new coding challenge once the timer expires. Use this time to sharpen your skills!
                    </p>
                  </div>
                  <div className="px-6 py-3 bg-[#1C1917] rounded-2xl text-white font-mono-stats text-xl tracking-widest shadow-lg">
                    {cooldownTimeLeft}
                  </div>
                </div>
              ) : challenges.map((task) => {
                const isCompleted = microTasks.find((t: any) => t.id === task.id && isSuccessful(t.status));
                const isFailed = microTasks.find((t: any) => t.id === task.id && t.status === 'fail');
                
                return (
                  <div key={task.id} className="p-6 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors group">
                    <div className="flex gap-4 items-center">
                      <div className={`w-10 h-10 rounded-xl bg-white border border-[#EBEBEB] flex items-center justify-center font-mono-stats font-bold transition-colors ${isCompleted ? 'bg-[#10B981] text-white' : isFailed ? 'bg-red-500 text-white' : 'text-[#1C1917] group-hover:bg-[#1A56DB] group-hover:text-white'}`}>
                        +{task.reward}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-[#1C1917]">{task.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] font-heading font-bold text-[#1A56DB] uppercase tracking-widest">{task.difficulty}</span>
                          <span className="text-[9px] text-[#9CA3AF]">•</span>
                          <span className="text-[9px] text-[#9CA3AF] font-body">{task.duration} mins</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => !isCompleted && !isFailed && handleStartTask(task)}
                      disabled={isCompleted || isFailed}
                      className={`px-6 py-2 rounded-xl text-[10px] font-heading font-black transition-all uppercase tracking-widest ${isCompleted || isFailed ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-default' : 'bg-[#FAF8F5] border border-[#EBEBEB] text-[#1C1917] hover:bg-[#1C1917] hover:text-white'}`}
                    >
                      {isCompleted ? "Completed" : isFailed ? "Attempted" : "Start Task"}
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="p-4 bg-[#FAF8F5] text-center border-t border-[#F5F3F0]">
              <div className="inline-flex items-center gap-2 text-xs font-body text-[#6B7280]">
                <AlertCircle className="w-3.5 h-3.5" />
                Next task becomes available 7 days after your last attempt.
              </div>
            </div>
          </section>

          {/* New Challenge History Section */}
          {microTasks.length > 0 && (
            <section className="bg-white rounded-[2rem] border border-[#EBEBEB] overflow-hidden shadow-sm">
              <div className="px-8 py-5 border-b border-[#F5F3F0] flex items-center justify-between bg-gray-50/50">
                <h3 className="font-heading font-bold text-sm text-[#1C1917]">Challenge History</h3>
                <span className="text-[10px] font-heading font-black text-[#9CA3AF] uppercase tracking-widest">{microTasks.length} Attempts</span>
              </div>
              <div className="divide-y divide-[#F5F3F0]">
                {microTasks.sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).map((task: any, i: number) => {
                  const success = isSuccessful(task.status);
                  return (
                    <div key={i} className="px-8 py-4 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-heading font-bold text-[#1C1917]">{task.title}</p>
                          <p className="text-[10px] font-body text-[#9CA3AF]">{new Date(task.completedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-heading font-black px-2 py-1 rounded-md uppercase tracking-widest ${success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {task.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedChallenge && (
          <ChallengeModal
            challenge={selectedChallenge}
            onClose={() => setSelectedChallenge(null)}
            onSuccess={(newScore) => {
              setSelectedChallenge(null);
              onRefresh?.();
              fetchData();
            }}
            onFail={() => {
              setSelectedChallenge(null);
              onRefresh?.();
              fetchData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
