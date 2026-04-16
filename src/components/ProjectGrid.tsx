import { useState, useEffect } from "react";
import { projectApi } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Clock, DollarSign, Tag, ChevronRight, Zap, Target } from "lucide-react";
import ProjectApplicationModal from "./ProjectApplicationModal";

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: string;
  category: string;
  skills: string[];
  client: { name: string; rating: number };
  postedAt: string;
  isNewTalentFriendly: boolean;
  requiresPOC: boolean;
  hasApplied: boolean;
}

export default function ProjectGrid({ user, filters }: { user?: any, filters?: any }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await projectApi.getAll(filters);
      const mappedProjects: Project[] = data.map((p: any) => {
        let skillsArray = [];
        try {
          skillsArray = Array.isArray(p.skills) ? p.skills : (typeof p.skills === 'string' ? JSON.parse(p.skills) : []);
        } catch (e) { skillsArray = []; }

        return {
          id: p.id,
          title: p.title,
          description: p.description,
          budget: `$${p.budget || 0}`,
          category: p.category || "General",
          skills: skillsArray,
          client: { 
            name: p.Client?.name || "Premium Client", 
            rating: p.Client?.rating || 5.0 
          },
          postedAt: new Date(p.createdAt).toLocaleDateString(),
          isNewTalentFriendly: Number(p.budget) < 1000 || p.isNewTalentFriendly,
          requiresPOC: p.requiresPOC ?? true,
          hasApplied: p.hasApplied || false,
        };
      });
      setProjects(mappedProjects);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {selectedProject && (
          <ProjectApplicationModal 
            project={selectedProject} 
            user={user}
            onClose={() => setSelectedProject(null)}
            onSuccess={() => {
              setSelectedProject(null);
              fetchProjects();
            }}
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading && projects.length === 0 ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-white border border-[#EBEBEB] rounded-2xl animate-pulse" />
          ))
        ) : (
          projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={projects.length === 0 ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white border ${project.hasApplied ? 'border-[#F5F3F0] opacity-80' : 'border-[#EBEBEB]'} rounded-2xl p-6 hover:shadow-xl transition-all group relative overflow-hidden ${project.hasApplied ? 'cursor-default' : 'cursor-pointer'}`}
              onClick={() => !project.hasApplied && setSelectedProject(project)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  {project.isNewTalentFriendly && (
                    <span className="bg-emerald-50 text-[#10B981] text-[10px] font-heading font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      New Talent Friendly
                    </span>
                  )}
                  {project.requiresPOC && (
                    <span className="bg-blue-50 text-[#1A56DB] text-[10px] font-heading font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      POC Opportunity
                    </span>
                  )}
                </div>
                <div className="font-mono-stats font-bold text-lg text-[#1A56DB]">
                  {project.budget}
                </div>
              </div>

              <h3 className={`font-heading font-bold text-xl ${project.hasApplied ? 'text-[#9CA3AF]' : 'text-[#1C1917]'} mb-2 ${!project.hasApplied && 'group-hover:text-[#1A56DB]'} transition-colors`}>
                {project.title}
              </h3>
              <p className="font-body text-sm text-[#6B7280] line-clamp-2 mb-4">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-[#FAF8F5] border border-[#EBEBEB] rounded-full text-[10px] font-heading font-semibold text-[#6B7280]">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F5F3F0]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EBEBEB] to-[#D1D1D1] flex items-center justify-center text-[10px] font-bold text-[#6B7280]">
                    {project.client.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-xs text-[#1C1917]">{project.client.name}</p>
                    <p className="font-body text-[10px] text-[#9CA3AF]">Posted {project.postedAt}</p>
                  </div>
                </div>
                
                {project.hasApplied ? (
                  <div className="flex items-center gap-2 text-sm font-heading font-bold text-[#9CA3AF]">
                    Applied
                    <Target className="w-4 h-4" />
                  </div>
                ) : (
                  <button className="flex items-center gap-2 text-sm font-heading font-bold text-[#1A56DB] group-hover:translate-x-1 transition-transform">
                    Apply Now
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
