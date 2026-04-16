import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Timer, Terminal, Play, AlertCircle, ShieldCheck } from "lucide-react";
import { challengeApi } from "../lib/api";
import { toast } from "sonner";

interface ChallengeModalProps {
  challenge: any;
  onClose: () => void;
  onSuccess: (trustScore: number) => void;
  onFail: () => void;
}

export default function ChallengeModal({ challenge, onClose, onSuccess, onFail }: ChallengeModalProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [code, setCode] = useState(challenge.starterCode || "");
  const [timeLeft, setTimeLeft] = useState(parseInt(challenge.duration) * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [cheatingDetected, setCheatingDetected] = useState(false);

  useEffect(() => {
    if (!hasStarted || result || cheatingDetected) return;

    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Anti-Cheating: Tab Monitoring
    const handleVisibilityChange = () => {
      if (document.hidden && !result) {
        setCheatingDetected(true);
        toast.error("Cheating detected: Tab switched. Task failed.");
        handleSubmit("CHEATING_DETECTED_AUTO_FAIL");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleVisibilityChange);
    };
  }, [timeLeft, hasStarted, result, cheatingDetected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAutoSubmit = () => {
    if (result) return;
    toast.error("Time is up! Task failed.");
    handleSubmit(""); 
  };

  const handleSubmit = async (codeToSubmit: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { data } = await challengeApi.verify(challenge.id, codeToSubmit);
      setResult(data);
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => onSuccess(data.trustScore), 2000);
      } else {
        toast.error(data.message);
        setTimeout(() => onFail(), 2000);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Verification failed");
      onFail();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 py-6 bg-[#1C1917] text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl">
              <Terminal className={`w-6 h-6 ${cheatingDetected ? 'text-red-500' : 'text-[#10B981]'}`} />
            </div>
            <div>
              <h2 className="font-display font-black text-xl leading-tight">{challenge.title}</h2>
              <p className="text-xs text-[#9CA3AF] font-body">Reward: +{challenge.reward} Trust Score</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {hasStarted && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono-stats font-bold text-lg ${timeLeft < 60 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/10 text-white'}`}>
                <Timer className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-5 gap-8 relative">
          
          {/* Start Confirmation Overlay */}
          {!hasStarted && (
            <div className="absolute inset-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-sm flex items-center justify-center p-8">
              <div className="max-w-md text-center space-y-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-[#1A56DB]">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-black text-[#1C1917]">Ready to begin?</h3>
                  <p className="text-sm font-body text-[#6B7280]">
                    Once you start, the timer will begin. You cannot pause the test or leave this tab. Cheating will result in an immediate failure.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button onClick={onClose} className="flex-1 px-6 py-3 bg-white border border-[#EBEBEB] text-[#6B7280] rounded-2xl font-heading font-bold hover:bg-gray-50 transition-all">
                    Not now
                  </button>
                  <button onClick={() => setHasStarted(true)} className="flex-1 px-6 py-3 bg-[#1A56DB] text-white rounded-2xl font-heading font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
                    Start Test
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Submit Confirmation Overlay */}
          {showConfirmSubmit && (
            <div className="absolute inset-0 z-50 bg-[#1C1917]/90 backdrop-blur-sm flex items-center justify-center p-8">
              <div className="max-w-md text-center space-y-6 text-white">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto text-[#10B981]">
                  <Play className="w-10 h-10 fill-current" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-black">Submit Solution?</h3>
                  <p className="text-sm font-body text-[#9CA3AF]">
                    Make sure your code is correct. You won't be able to change it after submission and you'll have to wait 7 days for the next attempt.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setShowConfirmSubmit(false)} className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-[#9CA3AF] rounded-2xl font-heading font-bold hover:bg-white/10 transition-all">
                    Review Code
                  </button>
                  <button onClick={() => { setShowConfirmSubmit(false); handleSubmit(code); }} className="flex-1 px-6 py-3 bg-[#10B981] text-white rounded-2xl font-heading font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
                    Yes, Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cheating Warning Overlay */}
          {cheatingDetected && (
            <div className="absolute inset-0 z-50 bg-red-900/95 backdrop-blur-md flex items-center justify-center p-8 text-white">
              <div className="max-w-md text-center space-y-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto text-white animate-bounce">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-black text-white">Test Terminated</h3>
                  <p className="text-sm font-body text-red-100">
                    Cheating detected (Tab Switch / Blur). This attempt has been recorded as a failure. You may attempt a new challenge in 7 days.
                  </p>
                </div>
                <button onClick={onFail} className="px-8 py-3 bg-white text-red-600 rounded-2xl font-heading font-bold hover:scale-[1.05] transition-all">
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-[#1C1917] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1A56DB]" />
                Instruction
              </h3>
              <p className="text-sm font-body text-[#4B5563] leading-relaxed">
                {challenge.description}
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 space-y-2">
              <h4 className="text-xs font-heading font-black text-red-600 uppercase tracking-widest">Anti-Cheat Enabled</h4>
              <ul className="text-[11px] font-body text-red-600 space-y-1">
                <li>• Copy/Paste is strictly disabled.</li>
                <li>• Tab switching will terminate the test.</li>
                <li>• Only one attempt allowed per week.</li>
              </ul>
            </div>

            {result && !cheatingDetected && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-2xl border ${result.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-heading font-bold text-sm">
                    {result.success ? "Passed!" : "Failed"}
                  </span>
                </div>
                <p className="text-xs font-body">{result.message}</p>
              </motion.div>
            )}
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex-1 min-h-[400px] bg-[#1C1917] rounded-3xl p-6 relative group border-4 border-[#2D2A28]">
               <div className="absolute top-4 right-4 text-[10px] font-mono text-[#4B5563] uppercase tracking-widest pointer-events-none">
                 JavaScript Environment
               </div>
               <textarea
                 value={code}
                 onChange={(e) => setCode(e.target.value)}
                 onPaste={(e) => { e.preventDefault(); toast.error("Copy-Paste is disabled for security."); }}
                 onCopy={(e) => { e.preventDefault(); toast.error("Copying is disabled."); }}
                 onCut={(e) => { e.preventDefault(); toast.error("Cutting is disabled."); }}
                 spellCheck={false}
                 className="w-full h-full bg-transparent text-[#10B981] font-mono text-sm resize-none focus:outline-none scrollbar-hide"
                 placeholder="// Start coding here..."
               />
               
               {isSubmitting && (
                 <div className="absolute inset-0 bg-[#1C1917]/80 backdrop-blur-sm flex items-center justify-center">
                   <div className="flex flex-col items-center gap-4">
                     <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
                     <span className="text-xs font-heading font-bold text-white tracking-widest uppercase">Verifying Code...</span>
                   </div>
                 </div>
               )}
            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm font-heading font-bold text-[#6B7280] hover:text-[#1C1917] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfirmSubmit(true)}
                disabled={isSubmitting || !!result || cheatingDetected}
                className="flex items-center gap-2 px-8 py-3 bg-[#1A56DB] text-white rounded-2xl font-heading font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
              >
                <Play className="w-4 h-4 fill-current" />
                Submit Solution
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
