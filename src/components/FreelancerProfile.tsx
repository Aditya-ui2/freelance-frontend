import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Star, MapPin, Clock, CheckCircle, MessageSquare,
  Briefcase, ExternalLink, ChevronLeft, ChevronRight, ShieldCheck, Zap, Edit3, Image as ImageIcon,
  Award, FileCheck, Search, ArrowRight, User
} from "lucide-react";
import { Freelancer } from "./FreelancerGrid";
import EditProfileModal from "./EditProfileModal";

interface FreelancerProfileProps {
  freelancer: Freelancer;
  onClose?: () => void;
  onHire?: () => void;
  onMessage?: () => void;
  onNavigate?: (page: string) => void;
  onUpdateUser?: (user: any) => void;
  isEmbedded?: boolean;
}

export default function FreelancerProfile({ freelancer, onClose, onHire, onMessage, onNavigate, onUpdateUser, isEmbedded = false }: FreelancerProfileProps) {
  const [activeTab, setActiveTab] = useState("pocs");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // CRITICAL: Robust safe accessors to prevent "White Screen" if optional data is missing or corrupted
  const effectiveFreelancer = freelancer || {
    name: "User",
    title: "Elite Professional",
    avatar: "",
    location: "Location Not Set",
    rate: "Not Set",
    trustScore: 0,
    pocScore: 0,
    skills: [],
    pocs: [],
    bio: "",
    availability: "Available",
    isRising: false,
    isNew: false
  };

  const pocs = effectiveFreelancer.pocs || [];
  
  // Cleanly handle skills from different formats (string or array)
  let skills: any[] = [];
  if (Array.isArray(effectiveFreelancer.skills)) {
    skills = effectiveFreelancer.skills;
  } else if (typeof effectiveFreelancer.skills === 'string') {
    skills = (effectiveFreelancer.skills as string).split(',').map(s => s.trim()).filter(Boolean);
  }

  const handlePocClick = (pocId: string) => {
    if (onNavigate) {
      onNavigate("portfolio-studio");
    }
  };

  const ProfileContent = (
    <motion.div
      initial={isEmbedded ? { opacity: 0, y: 20 } : { opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-3xl w-full ${isEmbedded ? 'max-w-4xl mx-auto shadow-sm border border-[#EBEBEB]' : 'max-w-3xl shadow-2xl'} overflow-hidden relative`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button - only show in modal mode */}
      {!isEmbedded && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full border border-[#EBEBEB] hover:bg-[#F5F3F0] transition-colors"
        >
          <X className="w-4 h-4 text-[#6B7280]" />
        </button>
      )}

      {/* Minimalism: Redesigned header section */}
      <div className={`relative ${isEmbedded ? 'pt-16 pb-8' : 'pt-10 pb-6'} px-10 bg-gradient-to-b from-[#FAF8F5]/50 to-white border-b border-[#F5F5F5]`}>
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] border-4 border-white object-cover shadow-2xl overflow-hidden bg-gradient-to-br from-[#1A56DB] to-[#6366F1] flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-500">
               <img
                  src={effectiveFreelancer.avatar || `https://ui-avatars.com/api/?name=${effectiveFreelancer.name}&background=1A56DB&color=fff`}
                  alt={effectiveFreelancer.name}
                  className="w-full h-full rounded-[2.2rem] object-cover"
                />
            </div>
            {effectiveFreelancer.availability === "Available" && (
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#10B981] border-4 border-white rounded-full shadow-lg" />
            )}
            {effectiveFreelancer.isRising && (
              <div className="absolute -top-3 -right-3">
                 <div className="w-10 h-10 bg-[#FFD700] rounded-2xl flex items-center justify-center shadow-lg rotate-12 border-2 border-white">
                    <Zap className="w-5 h-5 text-[#1C1917] fill-current" />
                 </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                  <h2 className="font-heading font-black text-4xl text-[#1C1917] tracking-tight">{effectiveFreelancer.name}</h2>
                  {effectiveFreelancer.isNew && (
                    <span className="px-3 py-1 bg-[#1A56DB]/5 text-[#1A56DB] rounded-lg text-[10px] font-heading font-black uppercase tracking-widest border border-[#1A56DB]/10">
                      New Talent
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[#6B7280]">
                    <p className="font-body text-lg font-medium">{effectiveFreelancer.title || "Elite Professional"}</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EBEBEB] hidden lg:block" />
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#9CA3AF]" />
                        <span className="text-sm font-body">{effectiveFreelancer.location}</span>
                    </div>
                </div>
              </div>
              
              {isEmbedded && (
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-6 py-3 border border-[#EBEBEB] text-[#1C1917] rounded-2xl text-sm font-heading font-bold hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-sm group"
                >
                  <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-10">
        {/* Stats Section with a Premium Look */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Trust Score", value: effectiveFreelancer.trustScore || 0, sub: "Reputation Hub", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "POC Rating", value: (effectiveFreelancer.pocScore || 0).toFixed(1), sub: "Verified Skills", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
              { label: "Hourly Rate", value: effectiveFreelancer.rate ? effectiveFreelancer.rate : "Not Set", sub: "Competitive", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-50" },
            ].map((stat) => (
              <div key={stat.label} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F5] to-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-[#EBEBEB]" />
                <div className="relative p-6 flex items-center justify-between">
                   <div>
                      <span className="block font-heading font-black text-[10px] text-[#9CA3AF] uppercase tracking-widest mb-1">{stat.label}</span>
                      <div className="font-mono-stats font-black text-3xl text-[#1C1917] tracking-tighter">{stat.value}</div>
                      <span className="block font-body text-[10px] text-[#6B7280] tracking-wide">{stat.sub}</span>
                   </div>
                   <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shadow-sm`}>
                      <stat.icon className={`w-6 h-6 ${stat.color} ${stat.label === 'POC Rating' ? 'fill-current' : ''}`} />
                   </div>
                </div>
              </div>
            ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
                {/* Professional Bio */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-[#1C1917] flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-heading font-black text-xs text-[#1C1917] uppercase tracking-widest">About Me</h4>
                  </div>
                  <p className="font-body text-base text-[#4B5563] leading-relaxed max-w-2xl">
                    {effectiveFreelancer.bio || "Crafting world-class experiences through dedication and specialized expertise. Looking to help clients bring ambitious projects to life."}
                  </p>
                </div>

                {/* Tabs for Content */}
                <div className="space-y-10">
                    <div className="flex gap-10 border-b border-[#F5F5F5]">
                      {[
                        { id: "pocs", label: "POC Portfolio", icon: Search },
                        { id: "skills", label: "Skills Breakdown", icon: Zap }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`pb-4 flex items-center gap-2 text-xs font-heading font-black uppercase tracking-widest transition-all relative ${
                            activeTab === tab.id ? "text-[#1A56DB]" : "text-[#9CA3AF] hover:text-[#1C1917]"
                          }`}
                        >
                          <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'opacity-100' : 'opacity-30'}`} />
                          {tab.label}
                          {activeTab === tab.id && (
                            <motion.div
                              layoutId="profileTabActive"
                              className="absolute bottom-0 left-0 right-0 h-1 bg-[#1A56DB] rounded-full"
                            />
                          )}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {activeTab === "pocs" && (
                        <motion.div
                          key="pocs"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={pocs.length > 0 ? "grid grid-cols-1 md:grid-cols-2 gap-6" : ""}
                        >
                          {pocs.length > 0 ? (
                            pocs.map((item: any, i: number) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.07 }}
                                onClick={() => handlePocClick(item.id)}
                                className="group relative rounded-3xl overflow-hidden cursor-pointer aspect-video border border-[#EBEBEB] bg-[#FAF8F5] shadow-sm hover:shadow-xl transition-all duration-500"
                              >
                                {item.imageUrl || item.img ? (
                                   <img src={item.imageUrl || item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                                ) : (
                                   <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-white to-[#FAF8F5]">
                                      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                                          <FileCheck className="w-8 h-8 text-[#1A56DB]" />
                                      </div>
                                      <p className="text-xs font-heading font-black text-[#1C1917] uppercase tracking-wider">{item.projectTitle || "Verified Project"}</p>
                                      <p className="text-[10px] font-body text-[#9CA3AF] mt-1">Score: {(item.score/10).toFixed(1)}/10</p>
                                   </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <p className="text-white text-lg font-heading font-black tracking-tight">{item.title || item.projectTitle || "POC Asset"}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-white text-[8px] font-heading font-black uppercase tracking-widest">Open in POC Studio</div>
                                    </div>
                                  </div>
                                  <div className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-[#1A56DB] transition-all">
                                    <ArrowRight className="w-5 h-5 text-white group-hover:text-[#1A56DB]" />
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <div className="py-20 text-center border-2 border-dashed border-[#F1F1F1] rounded-[3rem] bg-[#FAF8F5]/30 col-span-2">
                               <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-6">
                                  <Award className="w-10 h-10 text-[#1A56DB]" />
                               </div>
                               <h5 className="font-heading font-black text-lg text-[#1C1917] mb-2">No Proof of Concepts (POCs) Yet</h5>
                               <p className="font-body text-sm text-[#9CA3AF] max-w-sm mx-auto">Start completing micro-tasks or project milestones to build your earned portfolio here.</p>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === "skills" && (
                        <motion.div
                          key="skills"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                          {skills.length > 0 ? (
                            skills.map((skill: any, i: number) => {
                              const name = typeof skill === 'string' ? skill : skill.name;
                              const level = 85 + (i * 3) % 15;
                              return (
                                <div key={i} className="group">
                                  <div className="flex items-center justify-between mb-3 px-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#1A56DB]" />
                                        <span className="font-heading font-black text-xs text-[#1C1917] uppercase tracking-widest">{name}</span>
                                    </div>
                                    <span className="font-mono-stats text-xs font-black text-[#1A56DB]">{level}%</span>
                                  </div>
                                  <div className="h-3 bg-[#FAF8F5] rounded-full overflow-hidden p-0.5 border border-[#F1F1F1]">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${level}%` }}
                                      transition={{ delay: i * 0.1, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                      className="h-full bg-gradient-to-r from-[#1A56DB] to-[#6366F1] rounded-full shadow-lg shadow-blue-500/10"
                                    />
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="py-20 text-center border-2 border-dashed border-[#F1F1F1] rounded-[3rem] bg-[#FAF8F5]/30 col-span-2">
                                <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-6">
                                    <Zap className="w-10 h-10 text-amber-500" />
                                </div>
                                <h5 className="font-heading font-black text-lg text-[#1C1917] mb-2">No Skills Verified Yet</h5>
                                <p className="font-body text-sm text-[#9CA3AF] max-w-sm mx-auto">Complete certifications in the Academy to list your verified expertise here.</p>
                                <button 
                                  onClick={() => onNavigate?.("academy")}
                                  className="mt-6 px-6 py-2 bg-[#1C1917] text-white rounded-xl text-xs font-heading font-bold hover:bg-black transition-all"
                                >
                                  Browse Certifications
                                </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Sidebar Actions */}
            {!isEmbedded && (
                <div className="w-full lg:w-72 space-y-6">
                    <div className="bg-[#1C1917] rounded-[2.5rem] p-8 text-white shadow-2xl">
                        <h4 className="font-heading font-black text-xs uppercase tracking-widest text-blue-400 mb-6">Action Hub</h4>
                        <div className="space-y-4">
                            <button
                                onClick={onHire}
                                className="w-full py-4 bg-white text-[#1C1917] rounded-2xl font-heading font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Hire Now
                            </button>
                            <button
                                onClick={onMessage}
                                className="w-full py-4 border border-white/20 text-white rounded-2xl font-heading font-black text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={effectiveFreelancer}
        onSuccess={(updatedUser) => {
          // Update the global user state via the callback from home.tsx
          if (onUpdateUser) {
            onUpdateUser(updatedUser);
          }
          setIsEditModalOpen(false);
        }}
      />
    </motion.div>
  );

  if (isEmbedded) {
    return (
      <div className="py-12 px-6">
        {ProfileContent}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#1C1917]/80 backdrop-blur-xl z-[60] flex items-center justify-center p-8 overflow-y-auto"
      onClick={onClose}
    >
      {ProfileContent}
    </motion.div>
  );
}
