import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { applicationApi, messageApi } from "../lib/api";
import { Briefcase, Clock, CheckCircle2, XCircle, Search, ExternalLink, MessageSquare, DollarSign, Loader2, Trash2, Star, Eye, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function MyApplications({ onStartChat }: { onStartChat?: (id: string) => void }) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatting, setChatting] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await applicationApi.getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      toast.error("Failed to load your applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (id: string) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    
    setWithdrawing(id);
    try {
      await applicationApi.withdrawApplication(id);
      toast.success("Application withdrawn");
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      toast.error("Failed to withdraw application");
    } finally {
      setWithdrawing(null);
    }
  };

  const handleChat = async (clientId: string, appId: string) => {
    if (!clientId) {
      console.error("No client ID found for application:", appId);
      toast.error("Could not find client information to start chat.");
      return;
    }
    setChatting(appId);
    try {
      const { data } = await messageApi.startConversation(clientId);
      if (onStartChat) {
        onStartChat(data.id);
      } else {
        console.warn("onStartChat handler missing");
      }
    } catch (err: any) {
      console.error("Failed to start chat:", err);
      toast.error(err.response?.data?.message || "Failed to start chat with client");
    } finally {
      setChatting(null);
    }
  };

  const filtered = applications.filter(app => {
    return app.Project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           app.Project?.Client?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusStyle = (status: string, projectStatus?: string) => {
    if (projectStatus === 'completed') {
      return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: CheckCircle2, label: 'Completed' };
    }

    switch (status.toLowerCase()) {
      case 'hired':
        return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: CheckCircle2, label: 'Hired' };
      case 'rejected':
        return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', icon: XCircle, label: 'Rejected' };
      default:
        return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: Clock, label: 'Pending' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-[#1C1917] flex items-center justify-center text-white shadow-xl shadow-black/10">
              <LogStack className="w-7 h-7" />
           </div>
           <div>
              <h1 className="font-display font-black text-3xl text-[#1C1917]">My Applications</h1>
              <p className="font-body text-sm text-[#6B7280]">Track your bids and collaborate with clients.</p>
           </div>
        </div>
        
        <div className="flex gap-4">
           <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] group-focus-within:text-[#1A56DB] transition-colors" />
              <input 
                type="text" 
                placeholder="Search projects..." 
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
          <p className="font-body text-[#6B7280]">Loading your proposal history...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-[#EBEBEB] p-24 text-center">
           <h3 className="font-heading font-bold text-xl text-[#1C1917] mb-2">No Applications Found</h3>
           <p className="font-body text-sm text-[#6B7280]">Apply for projects to see them here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((app, i) => {
              const status = getStatusStyle(app.status, app.Project?.status);
              const client = app.Project?.Client;
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-[2rem] border border-[#EBEBEB] p-6 hover:shadow-xl hover:shadow-black/5 transition-all duration-500 overflow-hidden relative"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-start gap-5 flex-1">
                      <div className={`w-14 h-14 rounded-2xl ${status.bg} ${status.text} flex items-center justify-center shrink-0`}>
                        <status.icon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                           <h3 className="font-heading font-black text-lg text-[#1C1917] truncate">{app.Project?.title}</h3>
                           <span className={`px-3 py-1 rounded-full text-[9px] font-heading font-black uppercase tracking-widest border ${status.bg} ${status.text} ${status.border}`}>
                             {status.label}
                           </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-body text-[#6B7280]">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden border border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-indigo-600">
                                {client?.avatar ? <img src={client.avatar} className="w-full h-full object-cover" /> : client?.name[0]}
                             </div>
                             <span className="font-bold text-[#1C1917]">{client?.name}</span>
                             <div className="flex items-center gap-1.5 ml-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                <span className="font-mono-stats font-bold text-[10px]">{client?.trustScore || "0"}</span>
                             </div>
                          </div>
                          <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> <span className="font-mono-stats font-bold text-[#1C1917]">${app.bidAmount}</span></span>
                          {app.pocType && (
                            <span className="flex items-center gap-1.5 text-indigo-600 font-bold">
                               <ExternalLink className="w-3.5 h-3.5" /> {app.pocTitle || "POC Attached"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {app.status === 'pending' && (
                        <button 
                          onClick={() => handleWithdraw(app.id)}
                          disabled={withdrawing === app.id}
                          className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-heading font-black text-[9px] uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                           <Trash2 className="w-3.5 h-3.5" /> {withdrawing === app.id ? "Working..." : "Withdraw"}
                        </button>
                      )}
                      {/* Action buttons based on status */}
                      {app.Project?.status === 'completed' ? (
                        <div className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-heading font-black text-[8px] uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          Project Success
                        </div>
                      ) : (
                        <div className="px-5 py-2.5 bg-[#FAF8F5] text-[#9CA3AF] rounded-xl font-heading font-black text-[8px] uppercase tracking-widest border border-[#EBEBEB] flex items-center gap-2">
                          <Clock className="w-3 h-3 animate-pulse" />
                          {app.status === 'hired' ? 'Awaiting Client Message' : 'Waiting for Response'}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function LogStack({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M4 10h16" />
      <path d="M4 14h16" />
      <path d="M4 18h16" />
      <path d="M4 6h16" />
    </svg>
  );
}
