import { useState } from "react";
import { applicationApi } from "../lib/api";
import { motion } from "framer-motion";
import { X, Send, Target, AlertCircle, CheckCircle2, DollarSign, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface ProjectApplicationModalProps {
  project: any;
  user?: any;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ProjectApplicationModal({ project, user, onClose, onSuccess }: ProjectApplicationModalProps) {
  const [proposal, setProposal] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [pocContent, setPocContent] = useState("");
  const [pocType, setPocType] = useState("");
  const [pocImageUrl, setPocImageUrl] = useState("");
  const [pocTitle, setPocTitle] = useState("");
  const [stakedBadgeId, setStakedBadgeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedPocId, setSelectedPocId] = useState<string | null>(null);

  const userPocs = Array.isArray(user?.pocs) 
    ? user.pocs 
    : (typeof user?.pocs === 'string' ? JSON.parse(user.pocs) : []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await applicationApi.apply({
        projectId: project.id,
        proposal,
        bidAmount,
        pocContent,
        pocType,
        pocImageUrl,
        pocTitle,
        stakedBadgeId, // Rep-Stake!
      });
      setSuccess(true);
      toast.success("Application submitted successfully!");
      onSuccess?.();
      setTimeout(onClose, 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1C1917]/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
      >
        {success ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
            </div>
            <h2 className="font-display font-black text-2xl text-[#1C1917] mb-2">Application Sent!</h2>
            <p className="font-body text-[#6B7280]">Your proposal and Proof of Concept are now with the client.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#F5F3F0] flex items-center justify-between bg-[#FAF8F5]">
              <div>
                <p className="text-[10px] font-heading font-bold text-[#1A56DB] uppercase tracking-widest mb-1">Applying for</p>
                <h2 className="font-heading font-bold text-xl text-[#1C1917]">{project.title}</h2>
              </div>
              <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors">
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* POC Info Box */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4">
                <div className="w-10 h-10 bg-[#1A56DB] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="text-white w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#1A56DB]">The POC Advantage</h4>
                  <p className="font-body text-xs text-blue-700/80 mt-1">
                    New to the platform? Submit a small Proof of Concept (like a GitHub link, a design draft, or a code snippet) to show the client your skills directly. This often beats experience!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-heading font-bold text-sm text-[#1C1917]">Your Bid Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                      required
                      type="text"
                      placeholder="500"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#EBEBEB] rounded-xl focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent transition-all outline-none font-mono-stats"
                    />
                  </div>
                </div>
                {/* Proposed Unique Field */}
                <div className="space-y-2">
                  <label className="font-heading font-bold text-sm text-[#1A56DB] flex items-center gap-2">
                    Proof of Concept (Optional)
                    <div className="group relative">
                      <AlertCircle className="w-3.5 h-3.5 text-[#9CA3AF] cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1C1917] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Add a link to a repo, Figma file, or a quick code snippet that proves you can do THIS specific job.
                      </div>
                    </div>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. github.com/username/project-demo"
                    value={pocContent}
                    onChange={(e) => {
                      setPocContent(e.target.value);
                      setSelectedPocId(null);
                    }}
                    className="w-full px-4 py-3 bg-blue-50/30 border border-blue-100 rounded-xl focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              {/* POC Selection from Studio */}
              {userPocs.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-heading font-bold text-xs text-[#6B7280] uppercase tracking-wider">Select from your POC Studio</label>
                    <span className="text-[10px] text-[#1A56DB] font-bold">{userPocs.length} available</span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                    {userPocs.map((poc: any) => (
                      <button
                        key={poc.id}
                        type="button"
                        onClick={() => {
                          const isSelected = selectedPocId === poc.id;
                          const newSelection = isSelected ? null : poc.id;
                          setSelectedPocId(newSelection);
                          setPocContent(newSelection ? (poc.imageUrl || poc.url || poc.title) : "");
                          setPocType(newSelection ? poc.type : "");
                          setPocImageUrl(newSelection ? poc.imageUrl : "");
                          setPocTitle(newSelection ? poc.title : "");
                        }}
                        className={`flex-shrink-0 w-32 p-3 rounded-2xl border transition-all text-left group ${
                          selectedPocId === poc.id 
                            ? "border-[#1A56DB] bg-blue-50/50 ring-2 ring-blue-100" 
                            : "border-[#EBEBEB] bg-white hover:border-[#1A56DB]/50"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg mb-2 flex items-center justify-center ${
                          poc.type === "Design" ? "bg-pink-100 text-pink-500" : poc.type === "Code" ? "bg-emerald-100 text-emerald-500" : "bg-blue-100 text-blue-500"
                        }`}>
                          <Target className="w-4 h-4" />
                        </div>
                        <p className={`text-[10px] font-heading font-bold mb-1 line-clamp-1 ${selectedPocId === poc.id ? "text-[#1A56DB]" : "text-[#1C1917]"}`}>
                          {poc.title}
                        </p>
                        <p className="text-[8px] font-body text-[#9CA3AF] uppercase">{poc.type}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rep-Stake Section */}
              <div className="space-y-4 pt-4 border-t border-[#F5F3F0]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                    <h4 className="font-heading font-bold text-sm text-[#1C1917]">Reputation Staking (Rep-Stake)</h4>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-[#10B981] font-bold px-2 py-0.5 rounded-full">UNIQUE FEATURE</span>
                </div>
                <p className="font-body text-xs text-[#6B7280]">
                  Stake a badge to show you're serious. If you deliver, your reputation grows. If you ghost, the badge gets tarnished.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {["Verified React", "UI Expert", "Backend Pro"].map((badge) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => setStakedBadgeId(stakedBadgeId === badge ? null : badge)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        stakedBadgeId === badge 
                          ? "bg-emerald-50 border-[#10B981] text-[#10B981] shadow-sm ring-2 ring-emerald-100" 
                          : "bg-white border-[#EBEBEB] text-[#6B7280] hover:border-[#10B981]"
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${stakedBadgeId === badge ? "text-[#10B981]" : "text-[#EBEBEB]"}`} />
                      <span className="text-xs font-heading font-bold">{badge}</span>
                    </button>
                  ))}
                </div>
                {stakedBadgeId && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-emerald-50/50 rounded-xl"
                  >
                    <AlertCircle className="w-4 h-4 text-[#10B981]" />
                    <p className="text-[10px] font-body text-[#10B981]">
                      <strong>Risk:</strong> If you don't deliver, your "{stakedBadgeId}" badge will be suspended for 30 days.
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <label className="font-heading font-bold text-sm text-[#1C1917]">Proposal / Cover Letter</label>
                <textarea
                  required
                  rows={5}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Explain why you are the best fit for this project..."
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EBEBEB] rounded-xl focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent transition-all outline-none resize-none font-body text-sm"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-[#FAF8F5] border-t border-[#F5F3F0] flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-[#1A56DB] text-white rounded-xl font-heading font-bold hover:bg-[#1648C4] transition-all btn-press disabled:opacity-50 shadow-lg shadow-blue-100"
              >
                {loading ? "Submitting..." : "Send Application"}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
