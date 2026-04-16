import { motion, AnimatePresence } from "framer-motion";
import POCLibrary from "./POCLibrary";
import { Layout, CheckCircle2, Clock, Play, MoreHorizontal, MessageSquare, Plus, Activity, Loader2, Trophy, Star, User, X, Award, Zap, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { projectApi } from "../lib/api";
import { toast } from "sonner";

interface ProjectCommandProps {
  onNewProject?: () => void;
  onViewApplications?: (projectId: string) => void;
  onStartChat?: (conversationId: string) => void;
}

export default function ProjectCommand({ onNewProject, onViewApplications, onStartChat }: ProjectCommandProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showAppModal, setShowAppModal] = useState(false);
  const [confirmingProject, setConfirmingProject] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<{ freelancer: any; projectId: string; projectStatus: string } | null>(null);

  const fetchProjects = async () => {
    try {
      const { data } = await projectApi.getMyProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCompleteProject = async () => {
    if (!confirmingProject) return;
    
    setIsProcessing(true);
    try {
      await projectApi.complete(confirmingProject.id);
      const hiredCount = (confirmingProject.ProjectApplications || []).filter((a: any) => a.status === 'hired').length;
      toast.success(`Project completed! Payments released to ${hiredCount} freelancer(s).`);
      setConfirmingProject(null);
      await fetchProjects();
    } catch (err) {
      console.error("Failed to complete project:", err);
      toast.error("Failed to complete project");
    } finally {
      setIsProcessing(false);
    }
  };

  // Map backend status to UI progress/status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'open':
        return { label: 'Open', color: 'text-blue-600', bg: 'bg-blue-50', progress: 0, icon: <Layout className="w-4 h-4" /> };
      case 'in-progress':
        return { label: 'In Progress', color: 'text-amber-600', bg: 'bg-amber-50', progress: 65, icon: <Clock className="w-4 h-4" /> };
      case 'completed':
        return { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50', progress: 100, icon: <Trophy className="w-4 h-4 text-emerald-500" /> };
      default:
        return { label: status, color: 'text-gray-600', bg: 'bg-gray-50', progress: 0, icon: <Layout className="w-4 h-4" /> };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <Layout className="w-6 h-6" />
             </div>
             <h1 className="font-display font-black text-3xl text-[#1C1917]">Project Command</h1>
          </div>
          <p className="font-body text-sm text-[#6B7280]">Manage milestones, track timelines, and ensure project success.</p>
        </div>
        <button 
          onClick={onNewProject}
          className="px-8 py-3 bg-[#1A56DB] text-white rounded-2xl font-heading font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-[#1C1917] transition-all shadow-lg shadow-blue-100"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-[#1A56DB] animate-spin mb-4" />
          <p className="font-body text-[#6B7280]">Loading your project data...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-[#EBEBEB] p-20 text-center">
           <Activity className="w-16 h-16 text-[#EBEBEB] mx-auto mb-6" />
           <h3 className="font-heading font-bold text-xl text-[#1C1917] mb-2">No Projects Found</h3>
           <p className="font-body text-sm text-[#6B7280] mb-8 max-w-sm mx-auto">
             You haven't posted any projects yet. Start by creating a project to find the best talent.
           </p>
           <button 
             onClick={onNewProject}
             className="px-8 py-3 bg-[#1A56DB] text-white rounded-2xl font-heading font-black uppercase tracking-widest text-[10px] hover:bg-[#1C1917] transition-all"
           >
              Post Your First Project
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {projects.map((project, idx) => {
            const statusInfo = getStatusInfo(project.status);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[2.5rem] border border-[#EBEBEB] overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="p-8">
                   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-5">
                         <div className="w-16 h-16 rounded-[1.5rem] bg-[#FAF8F5] flex items-center justify-center p-3">
                            <Activity className="w-full h-full text-[#1A56DB]" />
                         </div>
                         <div>
                            <h3 className="font-heading font-bold text-xl text-[#1C1917]">{project.title}</h3>
                            <p className="text-xs font-body text-[#9CA3AF] mt-1">Status: <span className="text-[#1A56DB] font-semibold">{statusInfo.label}</span></p>
                         </div>
                      </div>

                      <div className="flex items-center gap-4">
                         <div className="text-right mr-4 hidden md:block">
                            <span className="text-[10px] font-heading font-black text-[#9CA3AF] uppercase tracking-widest block mb-1">Estimated Progress</span>
                            <span className="text-lg font-mono-stats font-bold text-[#1C1917]">{statusInfo.progress}%</span>
                         </div>
                         <div className="w-40 h-2.5 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#EBEBEB]">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${statusInfo.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                            />
                         </div>
                      </div>

                      <div className="flex items-center gap-2">
                         <button className="p-3 bg-white border border-[#EBEBEB] rounded-xl hover:bg-[#FAF8F5] transition-all">
                            <MessageSquare className="w-5 h-5 text-[#6B7280]" />
                         </button>
                         <button className="p-3 bg-white border border-[#EBEBEB] rounded-xl hover:bg-[#FAF8F5] transition-all">
                            <MoreHorizontal className="w-5 h-5 text-[#6B7280]" />
                         </button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 rounded-[2rem] border transition-all bg-[#FAF8F5] border-emerald-100">
                         <div className="flex items-center justify-between mb-4">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            <span className="text-[9px] font-heading font-black uppercase tracking-widest text-emerald-600">
                              published
                            </span>
                         </div>
                         <h4 className="font-heading font-bold text-sm text-[#1C1917] mb-1">Project Listing</h4>
                         <p className="text-[10px] font-body text-[#6B7280]">Live and accepting bids</p>
                      </div>

                      <div className="p-6 rounded-[2rem] border transition-all bg-white border-[#EBEBEB]">
                         <div className="flex items-center justify-between mb-4">
                            <Clock className="w-6 h-6 text-[#9CA3AF]" />
                            <span className="text-[9px] font-heading font-black uppercase tracking-widest text-[#9CA3AF]">
                              deadline
                            </span>
                         </div>
                         <h4 className="font-heading font-bold text-sm text-[#1C1917] mb-1">{project.deadline || 'No Deadline'}</h4>
                         <p className="text-[10px] font-body text-[#6B7280]">Target completion</p>
                      </div>

                      <div className="p-6 rounded-[2rem] border transition-all bg-white border-[#EBEBEB]">
                         <div className="flex items-center justify-between mb-4">
                            <MoreHorizontal className="w-6 h-6 text-[#9CA3AF]" />
                            <span className="text-[9px] font-heading font-black uppercase tracking-widest text-[#9CA3AF]">
                              next step
                            </span>
                         </div>
                         <h4 className="font-heading font-bold text-sm text-[#1C1917] mb-1">Review Bids</h4>
                         <p className="text-[10px] font-body text-[#6B7280]">No applications yet</p>
                      </div>
                   </div>

                   {/* Hired Team Section */}
                   {project.ProjectApplications?.some((app: any) => app.status === 'hired') && (
                      <div className="mt-8 pt-8 border-t border-[#F5F3F0]">
                        <div className="flex items-center justify-between mb-4">
                           <h4 className="font-heading font-black text-[10px] uppercase tracking-widest text-[#9CA3AF]">Active Hired Team</h4>
                           <span className="text-[10px] font-body text-[#1A56DB] font-bold">
                             {project.ProjectApplications.filter((a: any) => a.status === 'hired').length} Member(s)
                           </span>
                        </div>

                        {/* Success Banner for Completed Projects */}
                        {project.status === 'completed' && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8 p-6 rounded-[2.5rem] bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-2 border-emerald-100 flex items-center gap-6 shadow-xl shadow-emerald-900/5 relative overflow-hidden text-left"
                          >
                             <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0 relative z-10">
                               <CheckCircle2 className="w-8 h-8" />
                             </div>
                             <div className="relative z-10 mr-auto">
                                <h4 className="text-lg font-heading font-black text-emerald-900 tracking-tight leading-none mb-2">Congratulations! Project Complete</h4>
                                <p className="text-[11px] font-body text-emerald-700/80 leading-relaxed max-w-md">
                                  Your project has been successfully completed and all milestone payments have been released to your team flawlessly.
                                </p>
                             </div>
                             <div className="relative z-10 hidden sm:block">
                                <div className="px-4 py-2 rounded-2xl bg-emerald-600 text-white text-[10px] font-heading font-black uppercase tracking-widest shadow-md">Verified Success</div>
                             </div>
                             <Trophy className="w-24 h-24 text-emerald-100 absolute -bottom-4 -right-4 rotate-12 opacity-50" />
                          </motion.div>
                        )}

                        <div className="flex flex-wrap gap-6">
                           {project.ProjectApplications
                             .filter((app: any) => app.status === 'hired')
                             .map((app: any) => (
                               <div 
                                 key={app.id} 
                                 onClick={() => setSelectedFreelancer(app.freelancerInfo)}
                                 className="flex items-center gap-3 group/member cursor-pointer hover:bg-white/80 p-1.5 -m-1.5 rounded-2xl transition-all"
                               >
                                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center font-bold text-[#1A56DB] text-sm group-hover/member:scale-110 transition-transform">
                                     {app.freelancerAvatar ? (
                                       <img src={app.freelancerAvatar} className="w-full h-full object-cover" />
                                     ) : (
                                       app.freelancerName?.[0] || 'F'
                                     )}
                                  </div>
                                  <div className="flex flex-col text-left">
                                    <span className="text-[11px] font-bold text-[#1C1917] group-hover/member:text-[#1A56DB] transition-colors line-clamp-1">
                                      {app.freelancerName}
                                    </span>
                                    <span className="text-[9px] text-[#9CA3AF] font-heading font-black uppercase tracking-tighter">Hired Freelancer</span>
                                  </div>
                               </div>
                             ))}
                        </div>
                      </div>
                    )}
                </div>

                <div className="px-8 py-5 bg-[#FAF8F5] border-t border-[#F5F3F0] flex items-center justify-between">
                   <div className="flex items-center gap-2 text-xs font-body text-[#6B7280]">
                      <Clock className="w-3.5 h-3.5" />
                      Budget: <span className="text-[#1C1917] font-semibold">${project.budget}</span>
                   </div>
                    <div className="flex items-center gap-4">
                       {project.status !== 'completed' && (
                         <button
                           onClick={() => setConfirmingProject(project)}
                           className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-heading font-black uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100 shadow-sm"
                         >
                            <CheckCircle2 className="w-4 h-4" /> Complete & Pay Team
                         </button>
                       )}
                      <button 
                        onClick={() => {
                          setSelectedProjectId(project.id);
                          setShowAppModal(true);
                        }}
                        className="flex items-center gap-2 text-xs font-heading font-black text-[#1A56DB] uppercase tracking-widest hover:translate-x-1 transition-transform"
                      >
                         View Applications <Play className="w-3 h-3 fill-current" />
                      </button>
                   </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Applications Modal */}
      <AnimatePresence>
        {showAppModal && selectedProjectId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAppModal(false)}
              className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl h-full bg-[#FAF8F5] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 bg-white border-b border-[#EBEBEB] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h2 className="font-heading font-bold text-xl text-[#1C1917]">Project Applications</h2>
                </div>
                <button 
                  onClick={() => setShowAppModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Plus className="w-6 h-6 text-[#9CA3AF] rotate-45" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <POCLibrary 
                  filterProjectId={selectedProjectId} 
                  onClearFilter={() => setShowAppModal(false)}
                  onStartChat={(id) => {
                    setShowAppModal(false);
                    onStartChat?.(id);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Multi-Payment Confirmation Modal */}
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
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
              
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="font-heading font-black text-2xl text-[#1C1917]">Complete & Pay All</h2>
                    <p className="text-xs font-body text-[#6B7280]">Release funds for "{confirmingProject.title}"</p>
                  </div>
                </div>
                
                <div className="bg-[#FAF8F5] rounded-[2rem] p-6 mb-8 border border-[#EBEBEB]">
                  <h3 className="font-heading font-black text-[10px] uppercase tracking-widest text-[#9CA3AF] mb-4">Hired Freelancers to be Paid</h3>
                  <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {(confirmingProject.ProjectApplications || [])
                      .filter((app: any) => app.status === 'hired')
                      .map((app: any) => (
                        <div key={app.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#F5F3F0]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold font-heading text-[#1A56DB]">
                              {app.Freelancer?.avatar ? (
                                <img src={app.Freelancer.avatar} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                app.Freelancer?.name?.[0] || 'F'
                              )}
                            </div>
                            <span className="text-sm font-bold text-[#1C1917]">{app.Freelancer?.name || "Hired Talent"}</span>
                          </div>
                          <span className="font-mono-stats font-bold text-emerald-500">${app.bidAmount}</span>
                        </div>
                      ))}
                    {(confirmingProject.ProjectApplications || []).filter((app: any) => app.status === 'hired').length === 0 && (
                      <p className="text-xs text-[#9CA3AF] italic text-center py-4">No freelancers hired yet for this project.</p>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-[#EBEBEB] flex justify-between items-center px-2">
                    <span className="font-heading font-black text-xs uppercase tracking-widest text-[#1C1917]">Total Payout</span>
                    <span className="text-2xl font-mono-stats font-black text-emerald-500">
                      ${(confirmingProject.ProjectApplications || [])
                        .filter((app: any) => app.status === 'hired')
                        .reduce((sum: number, app: any) => sum + (parseInt(app.bidAmount) || 0), 0)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setConfirmingProject(null)}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-gray-50 text-[#6B7280] rounded-2xl font-heading font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompleteProject}
                    disabled={isProcessing || (confirmingProject.ProjectApplications || []).filter((a: any) => a.status === 'hired').length === 0}
                    className="flex-2 py-4 bg-[#1A56DB] text-white rounded-2xl font-heading font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1C1917] transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Confirm & Release All Funds</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {/* Freelancer Profile Modal */}
        {selectedFreelancer && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFreelancer(null)}
              className="absolute inset-0 bg-[#1C1917]/70 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              {/* Header / Avatar */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                <button 
                  onClick={() => setSelectedFreelancer(null)}
                  className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="px-8 pb-10 -mt-16 relative z-10 text-center">
                <div className="w-32 h-32 rounded-full border-8 border-white bg-gray-100 mx-auto shadow-xl overflow-hidden mb-6">
                  {selectedFreelancer.freelancer?.avatar ? (
                    <img src={selectedFreelancer.freelancer.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 text-4xl font-black font-heading lowercase">
                      {selectedFreelancer.freelancer?.name?.[0] || 'F'}
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-heading font-black text-[#1C1917] mb-1">{selectedFreelancer.freelancer?.name}</h3>
                <p className="text-sm font-body text-[#4F46E5] font-bold mb-4 tracking-tight">{selectedFreelancer.freelancer?.title || 'Elite Freelancer'}</p>

                {/* Rep Vault Stats Display */}
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="font-mono-stats font-bold text-lg">{selectedFreelancer.freelancer?.trustScore || 0}</span>
                    </div>
                    <span className="text-[9px] font-heading font-black uppercase text-[#9CA3AF] tracking-[0.2em]">Trust Score</span>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 mb-1">
                      <Zap className="w-4 h-4 fill-current" />
                      <span className="font-mono-stats font-bold text-lg">{selectedFreelancer.freelancer?.pocScore || 0}</span>
                    </div>
                    <span className="text-[9px] font-heading font-black uppercase text-[#9CA3AF] tracking-[0.2em]">POC Score</span>
                  </div>
                </div>



                <div className="text-left mb-8">
                  <h4 className="text-[10px] uppercase font-heading font-black tracking-widest text-gray-400 mb-3 ml-1 text-left">About Talent</h4>
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <p className="text-xs font-body text-gray-600 leading-relaxed text-left">
                      {selectedFreelancer.freelancer?.bio || `${selectedFreelancer.freelancer?.name} is a top-tier professional on FreelanceUp, known for delivering exceptional architectural solutions and technical excellence in complex projects.`}
                    </p>
                  </div>
                </div>

                <div className="text-left mb-8">
                  <h4 className="text-[10px] uppercase font-heading font-black tracking-widest text-gray-400 mb-3 ml-1 text-left">Top Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      let skills: string[] = [];
                      try {
                        skills = Array.isArray(selectedFreelancer.freelancer?.skills)
                          ? selectedFreelancer.freelancer.skills
                          : JSON.parse(selectedFreelancer.freelancer?.skills || '[]');
                      } catch (e) { skills = []; }
                      return skills.length > 0 ? skills.map((skill: string) => (
                        <span key={skill} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-body text-gray-700 shadow-sm">
                          {skill}
                        </span>
                      )) : <span className="text-xs text-gray-400 italic">No skills listed</span>;
                    })()}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedFreelancer(null)}
                  className="w-full py-4 bg-[#1C1917] text-white rounded-2xl font-heading font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
                >
                  <MessageSquare className="w-4 h-4" /> Message Talent
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
