import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { applicationApi, messageApi, projectApi } from "../lib/api";
import { Users, Star, MessageSquare, Loader2, Search, ShieldCheck, Mail, ExternalLink, MoreVertical, CheckCircle2, Zap } from "lucide-react";
import { toast } from "sonner";

export default function HiredTalent({ onStartChat }: { onStartChat?: (id: string) => void }) {
  const [hired, setHired] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatting, setChatting] = useState<string | null>(null);
  const [confirmingProject, setConfirmingProject] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchHired = async () => {
    setLoading(true);
    try {
      const { data } = await applicationApi.getHiredApplications();
      setHired(data);
    } catch (err) {
      console.error("Failed to fetch hired talent:", err);
      toast.error("Failed to load your team");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProject = async () => {
    if (!confirmingProject) return;

    setIsProcessing(true);
    try {
      await projectApi.complete(confirmingProject.Project.id);
      toast.success(`Project completed! $${confirmingProject.bidAmount} released to ${confirmingProject.Freelancer?.name}.`);
      setConfirmingProject(null);
      fetchHired();
    } catch (err) {
      console.error("Failed to complete project:", err);
      toast.error("Failed to complete project");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchHired();
  }, []);

  const filtered = hired.filter(h =>
    h.Freelancer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.Project?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-[#1C1917] flex items-center justify-center text-white shadow-xl shadow-black/10">
              <Users className="w-7 h-7" />
           </div>
           <div>
              <h1 className="font-display font-black text-3xl text-[#1C1917]">My Hired Talent</h1>
              <p className="font-body text-sm text-[#6B7280]">Manage your active collaborations and team members.</p>
           </div>
        </div>

        <div className="flex gap-4">
           <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] group-focus-within:text-[#1A56DB] transition-colors" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#EBEBEB] rounded-2xl font-body text-xs outline-none focus:border-[#1A56DB] transition-all"
              />
           </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-[#1A56DB] animate-spin mb-4" />
          <p className="font-body text-[#6B7280]">Assembling your team view...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-[#EBEBEB] p-24 text-center">
           <div className="w-20 h-20 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-[#EBEBEB]" />
           </div>
           <h3 className="font-heading font-bold text-xl text-[#1C1917] mb-2">No Hired Talent Yet</h3>
           <p className="font-body text-sm text-[#6B7280] max-w-sm mx-auto">
             Start hiring freelancers from your project applications to build your dream team.
           </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => {
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-white rounded-[2.5rem] border border-[#EBEBEB] overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
                >
                  <div className="h-2 bg-gradient-to-r from-[#1A56DB] to-[#6366F1]" />

                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                          {item.Freelancer?.avatar ? (
                            <img src={item.Freelancer.avatar} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-2xl font-black text-[#1A56DB]">
                              {item.Freelancer?.name?.[0]}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                        <MoreVertical className="w-4 h-4 text-[#9CA3AF]" />
                      </button>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-heading font-black text-xl text-[#1C1917] group-hover:text-[#1A56DB] transition-colors truncate">
                        {item.Freelancer?.name}
                      </h3>
                      <p className="text-[11px] font-heading font-black text-[#9CA3AF] uppercase tracking-wider mb-2">
                        {item.Freelancer?.title || "Expert Architect"}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                           <ShieldCheck className="w-3 h-3" />
                           <span className="text-[10px] font-mono font-bold">{item.Freelancer?.trustScore || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                           <Zap className="w-3 h-3 fill-current" />
                           <span className="text-[10px] font-mono font-bold">{item.Freelancer?.pocScore || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#FAF8F5] rounded-2xl mb-8 space-y-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#9CA3AF] font-heading font-bold uppercase tracking-wider">Project</span>
                        <span className="text-[#1C1917] font-bold truncate max-w-[150px]">{item.Project?.title}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#9CA3AF] font-heading font-bold uppercase tracking-wider">Amount</span>
                        <span className="text-[#10B981] font-mono font-bold">${item.bidAmount}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#9CA3AF] font-heading font-bold uppercase tracking-wider">Status</span>
                        <span className={`px-2 py-0.5 rounded-md font-heading font-black text-[8px] uppercase ${item.Project?.status === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-[#10B981]'}`}>
                           {item.Project?.status === 'completed' ? 'Project Completed' : 'Active Hire · In Progress'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={async () => {
                          const freelancerId = item.Freelancer?.id || item.freelancerId;
                          console.log('[HiredTalent] Init Chat:', { freelancerId, item });
                          if (!freelancerId) {
                            toast.error("Freelancer ID missing");
                            return;
                          }
                          setChatting(item.id);
                          try {
                            const { data } = await messageApi.startConversation(freelancerId);
                            onStartChat?.(data.id);
                          } catch (err) {
                            console.error('[HiredTalent] Chat Error:', err);
                            toast.error("Failed to start chat");
                          } finally {
                            setChatting(null);
                          }
                        }}
                        disabled={chatting === item.id}
                        className="flex-1 py-3.5 bg-[#1C1917] text-white rounded-xl font-heading font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1A56DB] transition-all shadow-lg hover:shadow-blue-200 disabled:opacity-50"
                      >
                        {chatting === item.id ? "Opening..." : "Open Chat"} <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-3.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#FAF8F5] hover:text-[#1C1917] transition-all">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                    {item.Project?.status === 'in-progress' && (
                      <button
                        onClick={() => setConfirmingProject(item)}
                        className="w-full mt-3 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-heading font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all border border-emerald-100"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Complete Project & Pay
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ── Confirmation Modal ── */}
      <AnimatePresence>
        {confirmingProject && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setConfirmingProject(null)}
              className="absolute inset-0 bg-[#1C1917]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-10 h-10 text-emerald-500" />
                </div>

                <h2 className="font-heading font-black text-2xl text-[#1C1917] mb-4">
                  Confirm Project Completion
                </h2>

                <div className="w-full bg-[#FAF8F5] rounded-2xl p-6 mb-8 text-left space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#6B7280]">Freelancer:</span>
                    <span className="font-bold text-[#1C1917]">{confirmingProject.Freelancer?.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#6B7280]">Project:</span>
                    <span className="font-bold text-[#1C1917] truncate max-w-[180px]">{confirmingProject.Project?.title}</span>
                  </div>
                  <div className="border-t border-[#EBEBEB] pt-4 flex justify-between items-center">
                    <span className="font-black text-xs uppercase tracking-widest text-[#9CA3AF]">Amount to Release</span>
                    <span className="text-2xl font-mono font-bold text-emerald-500">${confirmingProject.bidAmount}</span>
                  </div>
                </div>

                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => setConfirmingProject(null)}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-gray-50 text-[#6B7280] rounded-2xl font-heading font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompleteProject}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-[#1A56DB] text-white rounded-2xl font-heading font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1C1917] transition-all shadow-lg hover:shadow-blue-200 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Confirm & Pay <ExternalLink className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
