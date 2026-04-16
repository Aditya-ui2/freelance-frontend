import { useState, useEffect } from "react";
import { userApi } from "../lib/api";
import { motion } from "framer-motion";
import { Star, Bookmark, BookmarkCheck, MapPin, Clock, ArrowRight, Zap, ShieldCheck } from "lucide-react";

export interface Freelancer {
  id: string;
  name: string;
  title: string;
  avatar: string;
  location: string;
  rate: string;
  trustScore: number;
  pocScore: number;
  skills: string[];
  isNew: boolean;
  isRising: boolean;
  availability: "Available" | "Busy" | "Part-time";
  completedJobs: number;
  bio: string;
  portfolio: any[];
  pocs: any[];
  badges?: Array<{ id: string, name: string, status: 'Verified' | 'Staked' | 'Tarnished' }>;
  wide?: boolean;
}

const mockFreelancers: Freelancer[] = [
  // Keeping original mock as fallback or for design reference
  {
    id: "1",
    name: "Alex Chen",
    title: "UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    location: "San Francisco, CA",
    rate: "$45/hr",
    trustScore: 92,
    pocScore: 4.8,
    skills: ["Figma", "UI Design", "Prototyping"],
    isNew: true,
    isRising: true,
    availability: "Available",
    completedJobs: 8,
    bio: "Passionate designer crafting beautiful, user-centered digital experiences with a focus on clean aesthetics.",
    portfolio: [],
    pocs: [],
    wide: true,
  },
];

function FreelancerCard({ freelancer, onView }: { freelancer: Freelancer; onView?: (f: Freelancer) => void }) {
  const [saved, setSaved] = useState(false);
  const [hovering, setHovering] = useState(false);

  const availabilityColor = {
    Available: "text-[#10B981] bg-emerald-50",
    Busy: "text-[#F59E0B] bg-amber-50",
    "Part-time": "text-[#6366F1] bg-indigo-50",
  }[freelancer.availability];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      className="relative bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden group cursor-pointer"
      style={{
        transition: "all 0.3s ease-out",
        transform: hovering ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovering ? "0 12px 40px rgba(0,0,0,0.1)" : "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
        {freelancer.isRising && (
          <span className="badge-rising-star text-[10px] font-heading font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Zap className="w-2.5 h-2.5" />
            Rising Star
          </span>
        )}
        {freelancer.isNew && (
          <span className="badge-new-talent text-[10px] font-heading font-bold px-2 py-0.5 rounded-full">
            ✨ New Talent
          </span>
        )}
        {freelancer.badges?.map(badge => (
          <span 
            key={badge.id}
            className={`text-[9px] font-heading font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
              badge.status === 'Tarnished' 
                ? "bg-red-50 text-red-500 border-red-100 grayscale-[0.5]" 
                : badge.status === 'Staked'
                ? "bg-emerald-50 text-[#10B981] border-emerald-100 animate-pulse"
                : "bg-blue-50 text-[#1A56DB] border-blue-100"
            }`}
          >
            {badge.status === 'Tarnished' ? "⚠️" : "🛡️"} {badge.name}
          </span>
        ))}
      </div>

      {/* Bookmark */}
      <motion.button
        onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#EBEBEB] hover:bg-white transition-colors"
        whileTap={{ scale: 0.8 }}
      >
        {saved ? (
          <BookmarkCheck className="w-4 h-4 text-[#1A56DB]" />
        ) : (
          <Bookmark className="w-4 h-4 text-[#9CA3AF]" />
        )}
      </motion.button>

      <div className="p-5">
        {/* Avatar & Info */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={freelancer.avatar}
              alt={freelancer.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            {freelancer.availability === "Available" && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#10B981] border-2 border-white rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-sm text-[#1C1917] truncate">{freelancer.name}</h3>
            <p className="font-body text-xs text-[#6B7280] mt-0.5">{freelancer.title}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-2.5 h-2.5 text-[#9CA3AF]" />
              <span className="text-[10px] font-body text-[#9CA3AF]">{freelancer.location}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="font-body text-xs text-[#6B7280] line-clamp-2 mb-3 leading-relaxed">
          {freelancer.bio}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {freelancer.skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-[#FAF8F5] border border-[#EBEBEB] rounded-md text-[10px] font-heading font-semibold text-[#6B7280]"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                <ShieldCheck className="w-3 h-3" /> {freelancer.trustScore}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                <Zap className="w-3 h-3 fill-current" /> {freelancer.pocScore}
              </div>
            </div>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-heading font-semibold ${availabilityColor}`}>
              <Clock className="w-2.5 h-2.5" />
              {freelancer.availability}
            </div>
          </div>
          <span className="font-mono-stats font-bold text-sm text-[#1A56DB]">{freelancer.rate}</span>
        </div>
      </div>

      {/* Quick View Button - slides up on hover */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: hovering ? 0 : "100%" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A56DB] to-[#4F76E8] px-5 py-3"
        onClick={() => onView?.(freelancer)}
      >
        <button className="w-full flex items-center justify-center gap-2 text-white text-sm font-heading font-semibold">
          View Profile
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function FreelancerGrid({ onViewProfile, filters }: { onViewProfile?: (f: Freelancer) => void, filters?: any }) {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const { data } = await userApi.getFreelancers(filters);
        const mappedFreelancers: Freelancer[] = data.map((u: any) => {
          let skillsArray = [];
          try {
            skillsArray = Array.isArray(u.skills) ? u.skills : (typeof u.skills === 'string' ? JSON.parse(u.skills) : []);
          } catch (e) { skillsArray = []; }

          let badgesArray = [];
          try {
            badgesArray = Array.isArray(u.badges) ? u.badges : (typeof u.badges === 'string' ? JSON.parse(u.badges) : []);
          } catch (e) { badgesArray = []; }

          return {
            id: u.id,
            name: u.name,
            title: u.title || "Professional Freelancer",
            avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`,
            location: "Remote",
            rate: `$${u.rate || 0}/hr`,
            trustScore: u.trustScore || 0,
            pocScore: u.pocScore || 0,
            skills: skillsArray,
            isNew: new Date(u.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
            isRising: u.trustScore >= 90 || u.pocScore >= 4.5,
            availability: "Available",
            completedJobs: u.projectsCompleted || 0,
            bio: u.bio || "No bio provided",
            badges: badgesArray
          };
        });
        setFreelancers(mappedFreelancers.length > 0 ? mappedFreelancers : mockFreelancers);
      } catch (err) {
        console.error("Failed to fetch freelancers:", err);
        setFreelancers(mockFreelancers);
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancers();
  }, [filters]);
  return (
    <section className="py-16 px-6 lg:px-8" style={{ backgroundColor: "#FAF8F5" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="font-heading font-semibold text-sm text-[#1A56DB] uppercase tracking-wider mb-2">Discover</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-[#1C1917] tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              Fresh Talent,<br />Real Results
            </h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-sm font-heading font-semibold text-[#1A56DB] hover:underline">
            Browse all talent
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto min-h-[400px]">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-[250px] bg-white border border-[#EBEBEB] rounded-2xl animate-pulse" />
            ))
          ) : (
            freelancers.map((freelancer, i) => (
              <motion.div
                key={freelancer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className={freelancer.wide ? "md:col-span-2 lg:col-span-1" : ""}
              >
                <FreelancerCard freelancer={freelancer} onView={onViewProfile} />
              </motion.div>
            ))
          )}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-10"
        >
          <button className="px-8 py-3 bg-white border border-[#EBEBEB] rounded-2xl font-heading font-semibold text-sm text-[#1C1917] hover:border-[#1A56DB] hover:text-[#1A56DB] transition-all btn-press shadow-sm">
            Load More Talent
          </button>
        </motion.div>
      </div>
    </section>
  );
}
