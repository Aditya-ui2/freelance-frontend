import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Award, BookOpen, Star, CheckCircle, Clock, Zap, Target, X, AlertCircle, ShieldCheck, Sparkles, TrendingUp, Lock } from "lucide-react";
import { toast } from "sonner";
import { userApi } from "../lib/api";
import { quizData, Question } from "../data/quizData";

export default function Academy({ user, onRefresh }: { user: any, onRefresh?: () => void }) {
  const [training, setTraining] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  
  // Local Cooldown State (Secondary layer of protection)
  const [localLastAttempt, setLocalLastAttempt] = useState<number | null>(null);

  // Quiz States
  const [activeQuiz, setActiveQuiz] = useState<{ title: string; questions: Question[]; currentProgress: number } | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTimer, setQuizTimer] = useState(40); 
  const [quizFinished, setQuizFinished] = useState(false);

  // Timer Effect
  useEffect(() => {
    let timer: any;
    if (activeQuiz && quizTimer > 0 && !quizFinished) {
      timer = setInterval(() => {
        setQuizTimer(prev => {
          if (prev <= 1) {
            setQuizFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuiz, quizTimer, quizFinished]);

  // Skill-based Personalization & Sorting
  const userSkills = (user?.skills || []).map((s: string) => s.toLowerCase());
  
  const defaultCerts = [
    { title: "React Architecture Pro", level: "Advanced", status: "In Progress", progress: 0 },
    { title: "UI/UX Design Masterclass", level: "Expert", status: "In Progress", progress: 0 },
    { title: "Freelance Client Management", level: "Essential", status: "In Progress", progress: 0 },
  ];

  // GLOBAL LOCKOUT CALCULATION (Robust parsing)
  const allBackendCerts = user?.certifications || [];
  let globalLockoutRemaining = 0;
  let latestAttemptTime = localLastAttempt || 0;

  allBackendCerts.forEach((c: any) => {
    if (c.lastAttemptAt) {
      const attemptTime = new Date(c.lastAttemptAt).getTime();
      if (!isNaN(attemptTime) && attemptTime > latestAttemptTime) {
        latestAttemptTime = attemptTime;
      }
    }
  });

  if (latestAttemptTime > 0) {
    const hoursSince = (new Date().getTime() - latestAttemptTime) / (1000 * 60 * 60);
    if (hoursSince < 30) {
      globalLockoutRemaining = Math.max(0, Math.ceil(30 - hoursSince));
    }
  }

  const processedCerts = defaultCerts.map((def) => {
    const backendCert = allBackendCerts.find((c: any) => c.title === def.title);
    const cert = backendCert || def;
    const isMatched = userSkills.some((s: string) => cert.title.toLowerCase().includes(s));

    // Force Locked status if global lockout is active
    return {
      ...cert,
      icon: cert.title?.includes("React") ? Zap : cert.title?.includes("UI") ? Award : BookOpen,
      color: cert.title?.includes("React") ? "text-[#6366F1]" : cert.title?.includes("UI") ? "text-[#F59E0B]" : "text-[#10B981]",
      status: globalLockoutRemaining > 0 ? "Locked" : (cert.progress >= 100 ? "Earned" : (cert.status || "In Progress")),
      progress: cert.progress || 0,
      isMatched,
      rawStatus: cert.status // Preserve original for badge display
    };
  });

  const sortedCertifications = [...processedCerts].sort((a, b) => {
    if (a.isMatched && !b.isMatched) return -1;
    if (!a.isMatched && b.isMatched) return 1;
    if (a.progress >= 100 && b.progress < 100) return -1;
    return 0;
  });

  const handleStartTraining = (cert: any) => {
    if (globalLockoutRemaining > 0) {
       toast.error(`Access Revoked: Cooldown in progress (${globalLockoutRemaining}h).`);
       return;
    }

    if (cert.progress >= 100) {
      toast.success(`Viewing certificate for ${cert.title}`);
      return;
    }

    // FISHER-YATES SHUFFLE
    const pool = [...(quizData[cert.title] || [])];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const selected = pool.slice(0, 10);

    setActiveQuiz({ title: cert.title, questions: selected, currentProgress: cert.progress });
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizTimer(40);
    setQuizFinished(false);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === activeQuiz?.questions[currentQuestionIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }

    if (currentQuestionIndex < (activeQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleCompleteQuiz = async (resultStatus: 'Passed' | 'Failed') => {
    const finishTime = Date.now();
    setLocalLastAttempt(finishTime); 

    try {
      const nextProgress = resultStatus === 'Passed' ? Math.min(100, (activeQuiz?.currentProgress || 0) + 4) : (activeQuiz?.currentProgress || 0);
      
      await userApi.updateAcademyProgress({
        title: activeQuiz!.title,
        progress: nextProgress,
        status: resultStatus === 'Passed' ? (nextProgress >= 100 ? 'Earned' : 'In Progress') : 'Failed'
      });
      
      if (resultStatus === 'Passed') {
        toast.success(`Mastery Updated. Global Lockout Start.`);
      } else {
        toast.warning("Assessment Failed. Global Lockout Start.");
      }
      
      onRefresh?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Sync Error: Local lockout enforced.");
    } finally {
      setActiveQuiz(null);
    }
  };

  // Rising Star Tasks
  const risingStarMilestones = [
    { id: 1, label: `Verify 3 POCs (${(user?.pocs?.length || 0)}/3)`, done: (user?.pocs?.length || 0) >= 3 },
    { id: 2, label: `Reach Trust Score 75 (${(user?.trustScore || 0)}/75)`, done: (user?.trustScore || 0) >= 75 },
    { id: 3, label: "Identity Verification Complete", done: !!(user?.bio && user?.title) },
    { id: 4, label: "Master 1 Academy Topic", done: processedCerts.some((c: any) => (c.progress || 0) >= 100) },
  ];

  const handleClaimBoost = async () => {
    const isReady = risingStarMilestones.every(m => m.done);
    if (!isReady) {
      toast.error("Complete all milestones first!");
      return;
    }

    setClaiming(true);
    try {
      await userApi.claimAcademyBoost();
      toast.success("Rising Star Boost Applied!");
      onRefresh?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to claim boost");
    } finally {
      setClaiming(false);
    }
  };

  // REAL SKILL BREAKDOWN DATA
  const skillsWithScores = (user?.skills || []).map((skill: string, idx: number) => ({
    label: skill,
    // Distribute scores creatively based on trustScore
    score: Math.min(100, (user.trustScore || 0) + 10 - (idx * 5)),
    color: idx === 0 ? 'bg-[#6366F1]' : idx === 1 ? 'bg-pink-500' : 'bg-[#F59E0B]'
  })).slice(0, 3); // Take top 3 for UI consistency

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Quiz Overlay */}
      <AnimatePresence>
        {activeQuiz && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/10 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-[#EBEBEB] overflow-hidden"
            >
              {!quizFinished ? (
                <>
                  <div className="p-8 border-b border-[#F5F5F5] flex items-center justify-between">
                    <div>
                      <h2 className="font-display font-black text-2xl text-[#1C1917]">{activeQuiz.title}</h2>
                      <p className="font-body text-xs text-[#6B7280]">Blitz Test: 40s Limit • Rewarding +4% Progress</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${quizTimer <= 10 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                        <Clock className={`w-4 h-4 ${quizTimer <= 10 ? 'animate-pulse' : ''}`} />
                        <span className="font-mono-stats font-bold">{quizTimer}s</span>
                      </div>
                      <button onClick={() => setActiveQuiz(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                        <X className="w-5 h-5 text-[#6B7280]" />
                      </button>
                    </div>
                  </div>

                  <div className="p-10">
                    <div className="mb-8">
                       <h3 className="font-heading font-bold text-xl text-[#1C1917] leading-relaxed">
                         {activeQuiz.questions[currentQuestionIndex].text}
                       </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                       {activeQuiz.questions[currentQuestionIndex].options.map((opt, idx) => (
                         <button
                           key={idx}
                           onClick={() => setSelectedAnswer(idx)}
                           className={`w-full p-5 rounded-2xl text-left font-body text-sm transition-all border-2 ${selectedAnswer === idx ? 'border-[#1A56DB] bg-blue-50 text-[#1A56DB] shadow-sm' : 'border-[#F5F5F5] hover:border-[#EBEBEB] text-[#6B7280]'}`}
                         >
                           <div className="flex items-center gap-4">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${selectedAnswer === idx ? 'bg-[#1A56DB] text-white' : 'bg-[#FAF8F5] text-[#9CA3AF]'}`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              {opt}
                           </div>
                         </button>
                       ))}
                    </div>

                    <div className="mt-10 flex items-center justify-between">
                      <div className="h-2 flex-1 bg-[#FAF8F5] rounded-full mr-8 overflow-hidden">
                        <motion.div 
                          className="h-full bg-[#1A56DB]"
                          animate={{ width: `${((currentQuestionIndex + 1) / 10) * 100}%` }}
                        />
                      </div>
                      <button
                        onClick={handleAnswerSubmit}
                        disabled={selectedAnswer === null}
                        className="px-10 py-4 bg-[#1C1917] text-white rounded-2xl font-heading font-bold text-sm hover:bg-[#1C1917]/90 transition-all disabled:opacity-50"
                      >
                        {currentQuestionIndex === 9 ? "Finish Blitz" : "Next Question"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-8 ${quizScore >= 7 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {quizScore >= 7 ? <ShieldCheck className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                  </div>
                  <h2 className="font-display font-black text-4xl text-[#1C1917] mb-2">{quizScore >= 7 ? "Blitz Passed!" : "Blitz Failed"}</h2>
                  <p className="font-body text-[#6B7280] mb-8">You scored <span className="font-black text-[#1C1917]">{quizScore}/10</span></p>
                  
                  <div className="space-y-4">
                    {quizScore >= 7 ? (
                      <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 mb-8 inline-block">
                         <p className="text-emerald-700 text-sm font-heading font-black">+4% REPUTATION BOOST EARNED</p>
                      </div>
                    ) : (
                      <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 mb-8">
                         <p className="text-rose-700 text-sm font-heading font-bold">Global Cooldown Triggered: 30 Hours.</p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      {quizScore >= 7 ? (
                        <button 
                          onClick={() => handleCompleteQuiz('Passed')}
                          className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-heading font-bold text-sm hover:bg-emerald-700"
                        >
                          Claim Progress
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleCompleteQuiz('Failed')}
                          className="flex-1 py-4 bg-[#1C1917] text-white rounded-2xl font-heading font-bold text-sm hover:bg-black"
                        >
                          Acknowledge Cooldown
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content: Paths */}
        <div className="flex-1 space-y-12">
          {globalLockoutRemaining > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-rose-50 border border-rose-100 p-8 rounded-[2rem] flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200">
                    <Lock className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-display font-black text-xl text-rose-900">Academy Global Cooldown</h3>
                    <p className="font-body text-xs text-rose-600">Mastery requires time. Your next attempt is being calibrated.</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-heading font-black text-rose-400 uppercase tracking-widest mb-1">REBOOTING IN</p>
                 <p className="font-mono-stats font-black text-2xl text-rose-600">{globalLockoutRemaining}H</p>
              </div>
            </motion.div>
          )}

          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h1 className="font-display font-black text-4xl text-[#1C1917] mb-2">Rising Star Academy</h1>
                <p className="font-body text-[#6B7280]">Upskill through 40s Blitz sessions. Each pass yields +4% Progress.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
                <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-xs font-heading font-black text-[#B45309]">
                  {user?.trustScore >= 90 ? "ELITE SCHOLAR" : user?.trustScore >= 70 ? "LEVEL 2 SCHOLAR" : "RISING STAR"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {sortedCertifications.map((cert) => (
                 <motion.div
                   key={cert.title}
                   whileHover={globalLockoutRemaining > 0 ? {} : { y: -5 }}
                   className={`bg-white p-8 rounded-3xl border transition-all ${cert.isMatched ? 'border-[#6366F1] shadow-indigo-100 shadow-xl' : 'border-[#EBEBEB] shadow-sm'} ${globalLockoutRemaining > 0 ? 'opacity-60 saturate-50' : 'hover:shadow-xl'}`}
                 >
                   <div className="flex items-start justify-between mb-6">
                     <div className={`w-12 h-12 rounded-2xl bg-[#FAF8F5] flex items-center justify-center ${cert.color}`}>
                       <cert.icon className="w-6 h-6" />
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <span className={`text-[9px] font-heading font-black px-2 py-1 rounded-md uppercase tracking-wider ${globalLockoutRemaining > 0 ? "bg-rose-50 text-rose-600" : cert.progress >= 100 ? "bg-emerald-50 text-[#10B981]" : "bg-blue-50 text-[#1A56DB]"}`}>
                          {globalLockoutRemaining > 0 ? `Locked` : cert.progress >= 100 ? "EARNED" : (cert.rawStatus || cert.status)}
                        </span>
                        {cert.isMatched && (
                          <span className="flex items-center gap-1 text-[8px] font-heading font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                            <Sparkles className="w-3 h-3" /> MATCHED SKILL
                          </span>
                        )}
                     </div>
                   </div>
                   
                   <h3 className="font-heading font-bold text-lg text-[#1C1917] mb-1">{cert.title}</h3>
                   <p className="text-xs font-body text-[#6B7280] mb-6">{cert.level} Level Certification</p>
                   
                   <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-mono-stats font-bold text-[#1C1917]">
                       <span>PROGRESS</span>
                       <span>{cert.progress}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-[#FAF8F5] rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${cert.progress}%` }}
                         transition={{ duration: 1, ease: "easeOut" }}
                         className={`h-full rounded-full ${cert.progress >= 100 ? "bg-[#10B981]" : "bg-[#1A56DB]"}`}
                       />
                     </div>
                   </div>

                   <button 
                     onClick={() => handleStartTraining(cert)}
                     disabled={globalLockoutRemaining > 0}
                     className={`w-full mt-6 py-3 rounded-xl text-xs font-heading font-bold transition-all ${cert.progress >= 100 ? 'bg-[#FAF8F5] text-[#1C1917] hover:bg-black hover:text-white' : globalLockoutRemaining > 0 ? 'bg-rose-50 text-rose-300 cursor-not-allowed' : 'bg-[#1C1917] text-white hover:bg-black'}`}
                   >
                     {cert.progress >= 100 ? "View Certificate" : globalLockoutRemaining > 0 ? "Global Cooldown" : "Start Blitz Test (+4%)"}
                   </button>
                 </motion.div>
               ))}
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] border border-[#EBEBEB] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <GraduationCap className="w-48 h-48" />
            </div>
            
            <div className="relative z-10 max-w-xl">
              <h2 className="font-display font-black text-2xl text-[#1C1917] mb-4">Elite Mastery Path</h2>
              <p className="font-body text-[#6B7280] mb-8 leading-relaxed">
                Complete the full curriculum to unlock the **Top 1% Badge**. This badge grants you a 0% platform fee for your first $5,000 in earnings and priority matching with Enterprise clients.
              </p>
              <div className="flex flex-wrap gap-4 text-[#1C1917]">
                 <div className="flex items-center gap-2 text-xs font-heading font-bold">
                    <Clock className="w-4 h-4 text-[#1A56DB]" />
                    42 Hours Total
                 </div>
                 <div className="flex items-center gap-2 text-xs font-heading font-bold">
                    <BookOpen className="w-4 h-4 text-[#6366F1]" />
                    12 Modules
                 </div>
                 <div className="flex items-center gap-2 text-xs font-heading font-bold">
                    <Award className="w-4 h-4 text-[#F59E0B]" />
                    Enterprise Verified
                 </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar: Rising Star Rank */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-[#1C1917] rounded-3xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <h3 className="font-heading font-black text-sm uppercase tracking-widest">Rising Star Task</h3>
            </div>
            
            <p className="text-xs font-body text-[#9CA3AF] mb-8">Synchronized with your real-time reputation vault data.</p>
            
            <div className="space-y-4">
               {risingStarMilestones.map((m) => (
                 <div key={m.id} className="flex items-start gap-4">
                   <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${m.done ? "border-[#10B981] bg-[#10B981]" : "border-white/20"}`}>
                      {m.done && <CheckCircle className="w-3 h-3 text-white" />}
                   </div>
                   <span className={`text-xs font-body ${m.done ? "text-white line-through opacity-50" : "text-white"}`}>{m.label}</span>
                 </div>
               ))}
            </div>

            <button 
               onClick={handleClaimBoost}
               disabled={claiming || (risingStarMilestones.every(m => m.done) && user?.badges?.some((b: any) => b.name === 'Rising Star'))}
               className="w-full mt-10 py-3 bg-white text-[#1C1917] rounded-xl text-xs font-heading font-bold hover:bg-blue-50 transition-all disabled:opacity-50"
             >
               {claiming ? "CLAIMING..." : user?.badges?.some((b: any) => b.name === 'Rising Star') ? "BOOST ACTIVE ✨" : "Claim Batch Boost"}
             </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBEBEB] p-6">
            <div className="flex items-center gap-3 mb-4">
               <Target className="w-5 h-5 text-[#6366F1]" />
               <h4 className="font-heading font-bold text-sm text-[#1C1917]">Skill Breakdown</h4>
            </div>
            <div className="space-y-4">
               {skillsWithScores.length > 0 ? skillsWithScores.map((skill: any) => (
                 <div key={skill.label} className="space-y-1.5">
                   <div className="flex justify-between items-center text-[10px] font-heading font-black">
                      <span className="text-[#6B7280] uppercase tracking-widest">{skill.label}</span>
                      <span className="text-[#1C1917]">{skill.score}</span>
                   </div>
                   <div className="h-1 w-full bg-[#FAF8F5] rounded-full overflow-hidden">
                      <div className={`h-full ${skill.color}`} style={{ width: `${skill.score}%` }} />
                   </div>
                 </div>
               )) : (
                 <p className="text-[10px] font-body text-gray-400 italic">No verified skills linked yet.</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
