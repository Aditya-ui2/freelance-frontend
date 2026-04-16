import { useState, useEffect } from "react";
import { applicationApi, messageApi } from "../lib/api";
import { Loader2, FolderOpen, Eye, ExternalLink, FileCode, Figma, Globe, Star, Filter, Search, X, DollarSign, MessageSquare, ShieldCheck, Zap, Info, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function POCLibrary({ 
  onNavigate, 
  onStartChat,
  filterProjectId = null,
  onClearFilter
}: { 
  onNavigate?: (page: string) => void;
  onStartChat?: (conversationId: string) => void;
  filterProjectId?: string | null;
  onClearFilter?: () => void;
}) {
  const [pocs, setPocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [confirmHireId, setConfirmHireId] = useState<string | null>(null);
  const [hiring, setHiring] = useState(false);
  const [chatting, setChatting] = useState<string | null>(null);

  const calculateMatchScore = (freelancerSkills: any[], projectSkills: any[], trustScore: number, pocScore: number) => {
    // 1. Skill Match (50%)
    let skillScore = 0;
    if (projectSkills.length > 0) {
      const matches = projectSkills.filter(s => freelancerSkills.some(fs => fs.toLowerCase() === s.toLowerCase()));
      skillScore = (matches.length / projectSkills.length) * 50;
    } else {
      skillScore = 50; // No requirements = perfect match for skills
    }

    // 2. Trust Factor (30%)
    const trustFactor = (trustScore / 100) * 30;

    // 3. Performance Factor (20%)
    const performanceFactor = (pocScore / 5) * 20;

    return Math.round(skillScore + trustFactor + performanceFactor);
  };

  const fetchPocs = async () => {
    setLoading(true);
    try {
      const { data } = await applicationApi.getReceivedApplications();
      const mappedPocs = data.map((app: any) => {
        const isImage = (val: string) => val?.startsWith('data:image') || val?.match(/\.(jpeg|jpg|gif|png|webp)$/i);
        const hasHttp = (val: string) => val?.startsWith('http');
        
        const freelancerSkills = app.Freelancer?.skills || [];
        const projectSkills = app.Project?.skills || [];
        const matchScore = calculateMatchScore(freelancerSkills, projectSkills, app.Freelancer?.trustScore || 0, app.Freelancer?.pocScore || 0);

        return {
          id: app.id,
          freelancerId: app.Freelancer?.id || app.freelancerId,
          freelancer: app.Freelancer?.name || "Anonymous",
          project: app.Project?.title || "Unknown Project",
          title: app.pocTitle || app.proposal.substring(0, 50) + (app.proposal.length > 50 ? "..." : ""),
          type: app.pocType || (app.pocContent?.includes("figma") ? "Design" : app.pocContent?.includes("github") ? "Code" : "Web"),
          platform: app.pocContent?.includes("figma") ? "Figma" : app.pocContent?.includes("github") ? "GitHub" : "Live URL",
          date: new Date(app.createdAt).toLocaleDateString(),
          preview: isImage(app.pocImageUrl) ? app.pocImageUrl : (isImage(app.pocContent) ? app.pocContent : null),
          pocLink: app.pocImageUrl || (hasHttp(app.pocContent) || isImage(app.pocContent) ? app.pocContent : null),
          proposal: app.proposal,
          bidAmount: app.bidAmount,
          avatar: app.Freelancer?.avatar,
          freelancerTitle: app.Freelancer?.title || "Emerging Freelancer",
          projectId: app.projectId,
          badges: app.Freelancer?.badges || [],
          trustScore: app.Freelancer?.trustScore || 0,
          pocScore: app.Freelancer?.pocScore || 0,
          skills: freelancerSkills,
          projectSkills: projectSkills,
          matchScore
        };
      });
      const filtered = filterProjectId 
        ? mappedPocs.filter((p: any) => p.projectId === filterProjectId)
        : mappedPocs;
      
      // Sort by Match Score descending
      setPocs(filtered.sort((a, b) => b.matchScore - a.matchScore));
    } catch (err) {
      console.error("Failed to fetch POCs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPocs();
  }, [filterProjectId]);

  const filteredPocs = pocs.filter(poc => {
    const matchesSearch = 
      poc.freelancer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poc.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poc.proposal.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleHire = async (appId: string, confirmed = false) => {
    if (!confirmed) {
      setConfirmHireId(appId);
      return;
    }
    
    setHiring(true);
    try {
      await applicationApi.updateStatus(appId, 'hired');
      toast.success("Freelancer hired successfully!");
      setConfirmHireId(null);
      setSelectedApp(null);
      fetchPocs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to hire freelancer");
    } finally {
      setHiring(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-[#1C1917] flex items-center justify-center text-white shadow-xl shadow-black/10">
              <FolderOpen className="w-7 h-7" />
           </div>
           <div>
              <h1 className="font-display font-black text-3xl text-[#1C1917]">Review Applications</h1>
              <p className="font-body text-sm text-[#6B7280]">Real-time reputation match and Proof-of-Concept reviews.</p>
           </div>
        </div>
        
        <div className="flex gap-4">
           <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] group-focus-within:text-[#1A56DB] transition-colors" />
              <input 
                type="text" 
                placeholder="Search applicants..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#EBEBEB] rounded-2xl font-body text-xs outline-none focus:border-[#1A56DB] transition-all"
              />
           </div>
           <button className="p-3 bg-white border border-[#EBEBEB] rounded-2xl hover:bg-[#FAF8F5] transition-all shadow-sm">
              <Filter className="w-5 h-5 text-[#6B7280]" />
           </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-[#1A56DB] animate-spin mb-4" />
          <p className="font-body text-[#6B7280]">Running Match Algorithm...</p>
        </div>
      ) : filteredPocs.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-[#EBEBEB] p-24 text-center">
           <Search className="w-16 h-16 text-[#EBEBEB] mx-auto mb-6" />
           <h3 className="font-heading font-bold text-xl text-[#1C1917] mb-2">No Applications Found</h3>
           <p className="font-body text-sm text-[#6B7280]">Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPocs.map((poc, i) => (
            <motion.div
              key={poc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-[2.5rem] border border-[#EBEBEB] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer relative"
              onClick={() => setSelectedApp(poc)}
            >
              {/* Match Score Badge */}
              <div className="absolute top-4 right-4 z-10">
                 <div className={`px-4 py-2 rounded-2xl backdrop-blur-xl border flex items-center gap-2 shadow-lg ${poc.matchScore > 85 ? 'bg-emerald-500/90 text-white border-emerald-400' : poc.matchScore > 60 ? 'bg-amber-500/90 text-white border-amber-400' : 'bg-gray-800/90 text-white border-gray-700'}`}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="font-heading font-black text-xs">{poc.matchScore}% MATCH</span>
                 </div>
              </div>

              <div className="relative h-40 overflow-hidden bg-[#FAF8F5]">
                 {poc.preview ? (
                   <img src={poc.preview} alt={poc.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 ) : (
                   <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1C1917] to-[#1A56DB]`}>
                      <FileCode className="w-12 h-12 text-white/20" />
                   </div>
                 )}
                 <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[9px] font-heading font-black uppercase tracking-widest backdrop-blur-md text-white bg-black/40 border border-white/20">
                       {poc.type}
                    </span>
                 </div>
              </div>

              <div className="p-6">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                       {poc.avatar ? <img src={poc.avatar} className="w-full h-full object-cover" /> : <ShieldCheck className="w-5 h-5 text-indigo-600" />}
                    </div>
                    <div>
                       <h3 className="font-heading font-bold text-sm text-[#1C1917] truncate">{poc.freelancer}</h3>
                       <p className="text-[10px] font-body text-[#9CA3AF] truncate max-w-[150px]">{poc.project}</p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-2xl mb-4 border border-gray-100/50">
                    <div className="flex items-center gap-1.5 font-mono-stats font-bold text-[#1C1917]">
                       <DollarSign className="w-3.5 h-3.5 text-[#1A56DB]" />
                       <span className="text-sm">{poc.bidAmount}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                          <ShieldCheck className="w-3 h-3" /> {poc.trustScore}
                       </div>
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                          <Zap className="w-3 h-3 fill-current" /> {poc.pocScore}
                       </div>
                    </div>
                 </div>

                 <button className="w-full py-3 bg-[#FAF8F5] border border-[#EBEBEB] rounded-xl font-heading font-black text-[9px] uppercase tracking-widest text-[#1C1917] group-hover:bg-[#1C1917] group-hover:text-white group-hover:border-[#1C1917] transition-all flex items-center justify-center gap-2">
                    REVIEW APPLICATION <Eye className="w-3.5 h-3.5" />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-[#1C1917]/90 backdrop-blur-xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-[#F5F3F0] flex items-center justify-between bg-[#FAF8F5]/50 backdrop-blur-md">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-[#1A56DB] border border-[#F0F0F0]">
                     <TrendingUp className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                       <h2 className="font-display font-black text-3xl text-[#1C1917]">Recruiter Analysis</h2>
                       <span className={`px-4 py-1 rounded-full text-[10px] font-heading font-black tracking-widest border shadow-sm ${selectedApp.matchScore > 85 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                          {selectedApp.matchScore}% MATCH
                       </span>
                    </div>
                    <p className="text-xs text-[#6B7280] font-body mt-1">Comparing freelancer expertise with your project requirements.</p>
                  </div>
                </div>
                <button onClick={() => setSelectedApp(null)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all"><X className="w-6 h-6 text-[#9CA3AF]" /></button>
              </div>

              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                  <div className="w-full lg:w-1/3 space-y-6">
                    <div className="p-8 bg-[#1C1917] rounded-[2.5rem] shadow-2xl shadow-black/20 text-white relative overflow-hidden">
                      {/* Decorative Background */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
                      
                      <div className="relative z-10 text-center">
                        <div className="w-24 h-24 rounded-full border-4 border-white/10 p-1 mx-auto mb-4">
                           <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                              {selectedApp.avatar ? <img src={selectedApp.avatar} className="w-full h-full object-cover" /> : <div className="text-indigo-600 text-2xl font-black">{selectedApp.freelancer[0]}</div>}
                           </div>
                        </div>
                        <h3 className="font-heading font-black text-xl mb-1">{selectedApp.freelancer}</h3>
                        <p className="text-[10px] uppercase font-black tracking-widest text-[#9CA3AF] mb-6">{selectedApp.freelancerTitle}</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-inner">
                             <div className="flex items-center gap-1.5 text-emerald-400 mb-2 justify-center"><ShieldCheck className="w-3.5 h-3.5" /><span className="text-[9px] font-black uppercase">TRUST</span></div>
                             <div className="font-mono-stats font-black text-2xl">{selectedApp.trustScore}</div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-inner">
                             <div className="flex items-center gap-1.5 text-amber-400 mb-2 justify-center"><Zap className="w-3.5 h-3.5 fill-current" /><span className="text-[9px] font-black uppercase">P.O.C</span></div>
                             <div className="font-mono-stats font-black text-2xl">{selectedApp.pocScore}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-3xl border border-[#EBEBEB] space-y-4">
                       <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-[#1A56DB]" />
                          <h4 className="font-heading font-black text-[10px] text-[#1C1917] uppercase tracking-widest">Match Analysis</h4>
                       </div>
                       <div className="space-y-3">
                          <div className="flex flex-col gap-1.5">
                             <div className="flex justify-between text-[10px] font-heading font-black uppercase text-[#6B7280] tracking-wider">
                                <span>Skill Alignment</span>
                                <span className="text-[#1A56DB]">{(selectedApp.matchScore > 50 ? 50 : selectedApp.matchScore)}/50</span>
                             </div>
                             <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(selectedApp.matchScore > 50 ? 50 : selectedApp.matchScore) * 2}%` }} className="h-full bg-[#1A56DB]" />
                             </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                             <div className="flex justify-between text-[10px] font-heading font-black uppercase text-[#6B7280] tracking-wider">
                                <span>Risk Factor (Trust)</span>
                                <span className="text-emerald-500">LOW</span>
                             </div>
                             <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${selectedApp.trustScore}%` }} className="h-full bg-emerald-500" />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-10">
                    <div>
                      <h4 className="font-heading font-black text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-5 flex items-center gap-3">
                         Verified Credentials <div className="h-px flex-1 bg-gray-100" />
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedApp.badges.length > 0 ? selectedApp.badges.map((badge: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2.5 px-5 py-2.5 bg-blue-50/50 border border-blue-100 rounded-2xl group/badge hover:bg-blue-100 transition-colors">
                            <Star className="w-4 h-4 text-[#1A56DB] fill-[#1A56DB] group-hover/badge:scale-125 transition-transform" />
                            <span className="text-[11px] font-heading font-black text-[#1A56DB] uppercase tracking-wide">{badge.name || badge}</span>
                          </div>
                        )) : (
                          <div className="w-full p-6 bg-gray-50 border border-dashed border-gray-200 rounded-[2rem] text-center italic text-xs text-gray-400">
                            No credentials found in the Reputation Vault.
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-heading font-black text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-5 flex items-center gap-3">
                         Proposed Solution <div className="h-px flex-1 bg-gray-100" />
                      </h4>
                      <div className="p-8 bg-[#FAF8F5] border border-gray-100 rounded-[2.5rem] font-body text-[15px] text-[#4B5563] leading-relaxed relative">
                        <div className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[10px] font-black text-[#1A56DB] shadow-sm uppercase tracking-widest">PROPOSAL</div>
                        {selectedApp.proposal}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-heading font-black text-[11px] text-[#9CA3AF] uppercase tracking-widest mb-5 flex items-center gap-3">
                         Evaluation Asset <div className="h-px flex-1 bg-gray-100" />
                      </h4>
                      <div className="p-6 border border-[#EBEBEB] rounded-[2.5rem] flex items-center justify-between hover:border-[#1A56DB] transition-all bg-white group shadow-sm hover:shadow-xl hover:shadow-blue-50/50">
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                              {selectedApp.type === 'Design' ? <Figma className="w-7 h-7" /> : <FileCode className="w-7 h-7" />}
                           </div>
                           <div>
                              <p className="text-base font-heading font-black text-[#1C1917]">{selectedApp.title}</p>
                              <p className="text-[10px] text-[#9CA3AF] uppercase font-heading font-black tracking-widest">{selectedApp.type} Proof of Concept</p>
                           </div>
                        </div>
                        <button onClick={() => selectedApp.pocLink ? setShowFilePreview(true) : toast.error("No link")} className="px-8 py-4 bg-[#1C1917] text-white rounded-2xl text-[11px] font-heading font-black hover:bg-[#1A56DB] transition-all shadow-xl shadow-black/10">OPEN POC PREVIEW</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-[#F5F3F0] flex gap-5 bg-white backdrop-blur-xl">
                <button onClick={() => handleHire(selectedApp.id, false)} disabled={hiring} className="flex-[2] py-5 bg-[#1A56DB] text-white rounded-[1.5rem] font-heading font-black tracking-[0.2em] text-xs hover:bg-[#1648C4] transition-all shadow-2xl shadow-blue-200 disabled:opacity-50">
                   {hiring ? "PROCESSING..." : `HIRE CANDIDATE • $${selectedApp.bidAmount}`}
                </button>
                <button 
                onClick={async () => {
                   console.log('[POCLibrary] Init Chat:', { freelancerId: selectedApp.freelancerId, selectedApp });
                   setChatting(selectedApp.id);
                   try {
                     const { data } = await messageApi.startConversation(selectedApp.freelancerId);
                     onStartChat?.(data.id);
                   } catch (err) { 
                     console.error('[POCLibrary] Chat Error:', err);
                     toast.error("Failed to start chat session"); 
                   } finally { setChatting(null); }
                }}
                  disabled={chatting === selectedApp.id}
                  className="flex-1 py-5 bg-[#FAF8F5] border border-[#EBEBEB] text-[#1C1917] rounded-[1.5rem] font-heading font-black tracking-[0.1em] text-xs hover:bg-[#1C1917] hover:text-white transition-all flex items-center justify-center gap-3"
                >
                   {chatting === selectedApp.id ? "OPENING..." : <>START CHAT <MessageSquare className="w-4 h-4" /></>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* File Preview Modal */}
      <AnimatePresence>
        {showFilePreview && selectedApp && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFilePreview(false)} className="absolute inset-0 bg-[#0F172A]/98 backdrop-blur-2xl" />
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative w-full max-w-7xl h-[92vh] bg-white rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b flex items-center justify-between bg-white px-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner"><Eye className="w-5 h-5" /></div>
                  <h3 className="font-heading font-black text-base text-[#1C1917]">POC Asset: {selectedApp.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => window.open(selectedApp.pocLink, '_blank')} className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"><ExternalLink className="w-5 h-5" /></button>
                  <button onClick={() => setShowFilePreview(false)} className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-rose-500 transition-all shadow-xl shadow-black/20"><X className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="flex-1 bg-gray-50 relative">
                {selectedApp.preview ? (
                  <div className="w-full h-full flex items-center justify-center p-12 bg-[#FAFBFD]"><img src={selectedApp.preview} className="max-w-full max-h-full rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] object-contain" alt="Preview" /></div>
                ) : (
                  <iframe src={selectedApp.pocLink} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin allow-forms" />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hire Confirmation Modal */}
      <AnimatePresence>
        {confirmHireId && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmHireId(null)} className="absolute inset-0 bg-[#1C1917]/90 backdrop-blur-lg" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl text-center"
            >
              <h3 className="font-heading font-black text-2xl text-[#1C1917] mb-3">Initiate Contract?</h3>
              <p className="font-body text-[13px] text-[#6B7280] leading-relaxed mb-10 px-4">You are about to hire <strong>{selectedApp?.freelancer}</strong>. This project will move to 'In Progress' immediately.</p>
              
              <div className="flex flex-col gap-3">
                <button onClick={() => handleHire(confirmHireId, true)} disabled={hiring} className="w-full py-4 bg-[#1C1917] text-white rounded-2xl font-heading font-black text-[11px] uppercase tracking-widest hover:bg-[#1A56DB] transition-all shadow-xl shadow-black/10 disabled:opacity-50">YES, HIRE FREELANCER</button>
                <button onClick={() => setConfirmHireId(null)} className="w-full py-4 text-gray-400 font-heading font-black text-[10px] uppercase tracking-widest hover:text-[#1C1917] transition-all">Cancel Request</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {filterProjectId && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]">
          <button onClick={onClearFilter} className="px-8 py-4 bg-[#1C1917] text-white rounded-full font-heading font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:bg-[#1A56DB] transition-all group">
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Project Specific Review • Show All
          </button>
        </div>
      )}
    </div>
  );
}
