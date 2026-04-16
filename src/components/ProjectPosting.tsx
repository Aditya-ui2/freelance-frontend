import { useState } from "react";
import { projectApi } from "../lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, DollarSign, Calendar, Tag, FileText, Briefcase, CheckCircle } from "lucide-react";

const categories = ["Design", "Development", "Writing", "Marketing", "Video", "Photography", "Finance", "Music", "Other"];
const skillOptions = ["React", "Node.js", "Python", "Figma", "UI/UX", "Copywriting", "SEO", "Video Editing", "WordPress", "Data Analysis", "Photoshop", "Illustrator"];

interface ProjectPostingProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

const steps = [
  { id: 1, label: "Title", icon: Briefcase },
  { id: 2, label: "Category", icon: Tag },
  { id: 3, label: "Description", icon: FileText },
  { id: 4, label: "Budget", icon: DollarSign },
  { id: 5, label: "Timeline", icon: Calendar },
  { id: 6, label: "Skills", icon: Sparkles },
];

export default function ProjectPosting({ onClose, onSuccess }: ProjectPostingProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    budgetType: "fixed" as "fixed" | "hourly",
    budgetMin: 500,
    budgetMax: 2000,
    deadline: "",
    skills: [] as string[],
  });
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  const handleAiSuggest = () => {
    setAiSuggesting(true);
    setTimeout(() => {
      setForm((f) => ({
        ...f,
        description: f.description + (f.description ? "\n\n" : "") +
          "We are looking for a talented and detail-oriented freelancer to help us deliver a high-quality solution. The ideal candidate should have strong communication skills, be proactive in identifying potential issues, and deliver clean, well-documented work. We value creativity, reliability, and a collaborative mindset. Please include examples of similar past work in your proposal.",
      }));
      setAiSuggesting(false);
    }, 1500);
  };

  const handleSkillToggle = (skill: string) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter((s) => s !== skill)
        : [...f.skills, skill],
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await projectApi.create({
        title: form.title,
        description: form.description,
        category: form.category,
        budget: form.budgetMax,
        skills: form.skills,
        deadline: form.deadline,
      });
      setSubmitted(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to publish project");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-12 text-center max-w-sm w-full shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-[#10B981]" />
          </motion.div>
          <h3 className="font-display font-black text-2xl text-[#1C1917] mb-2">Project Published!</h3>
          <p className="font-body text-sm text-[#6B7280] mb-6">
            Your project is live. Expect proposals from talented freelancers soon.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full bg-[#FAF8F5] rounded-xl p-3 border border-[#EBEBEB]"
          >
            <p className="text-xs font-body text-[#6B7280]">Redirecting to your dashboard...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#FAF8F5] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-black text-2xl text-[#1C1917]">Post a Project</h2>
              <p className="font-body text-sm text-[#6B7280] mt-0.5">Step {step} of {steps.length}</p>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
              ✕
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-1 mb-2">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1 flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    step > s.id
                      ? "bg-[#10B981] text-white"
                      : step === s.id
                      ? "bg-[#1A56DB] text-white"
                      : "bg-[#F5F3F0] text-[#9CA3AF]"
                  }`}
                >
                  {step > s.id ? <CheckCircle className="w-4 h-4" /> : <s.icon className="w-3.5 h-3.5" />}
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-[#EBEBEB] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#1A56DB] rounded-full"
                      animate={{ width: step > s.id ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mb-4">
            {steps.map((s) => (
              <span key={s.id} className={`text-[9px] font-heading font-semibold ${step === s.id ? "text-[#1A56DB]" : "text-[#9CA3AF]"}`}>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 pb-6">
          <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 min-h-48">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <label className="block font-heading font-semibold text-sm text-[#1C1917] mb-2">Project Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Build a modern e-commerce website with React"
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EBEBEB] rounded-xl font-body text-sm text-[#1C1917] placeholder-[#9CA3AF] outline-none focus:border-[#1A56DB] transition-colors"
                  />
                  <p className="text-xs font-body text-[#9CA3AF] mt-2">Be specific and clear. Good titles attract better proposals.</p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <label className="block font-heading font-semibold text-sm text-[#1C1917] mb-3">Project Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setForm({ ...form, category: cat })}
                        className={`px-3 py-2.5 rounded-xl text-xs font-heading font-semibold transition-all ${
                          form.category === cat
                            ? "bg-[#1A56DB] text-white shadow-md shadow-blue-100"
                            : "bg-[#FAF8F5] border border-[#EBEBEB] text-[#6B7280] hover:border-[#1A56DB] hover:text-[#1A56DB]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-heading font-semibold text-sm text-[#1C1917]">Project Description</label>
                    <button
                      onClick={handleAiSuggest}
                      disabled={aiSuggesting}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-[10px] font-heading font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      <Sparkles className="w-3 h-3" />
                      {aiSuggesting ? "Generating..." : "AI Suggest"}
                    </button>
                  </div>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe your project in detail. What are the goals? What deliverables do you expect?"
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EBEBEB] rounded-xl font-body text-sm text-[#1C1917] placeholder-[#9CA3AF] outline-none focus:border-[#1A56DB] resize-none transition-colors h-32"
                  />
                  <p className="text-xs font-body text-[#9CA3AF] mt-1">{form.description.length} characters · Aim for 200+ for better matches</p>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <label className="block font-heading font-semibold text-sm text-[#1C1917] mb-3">Budget</label>
                  <div className="flex gap-2 mb-4">
                    {(["fixed", "hourly"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setForm({ ...form, budgetType: type })}
                        className={`flex-1 py-2 rounded-xl text-xs font-heading font-semibold capitalize transition-all ${
                          form.budgetType === type
                            ? "bg-[#1A56DB] text-white"
                            : "bg-[#FAF8F5] border border-[#EBEBEB] text-[#6B7280]"
                        }`}
                      >
                        {type} Price
                      </button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-body text-[#6B7280]">Min budget</span>
                        <span className="font-mono-stats font-bold text-sm text-[#1C1917]">${form.budgetMin}{form.budgetType === "hourly" ? "/hr" : ""}</span>
                      </div>
                      <input
                        type="range"
                        min="100" max="5000" step="100"
                        value={form.budgetMin}
                        onChange={(e) => setForm({ ...form, budgetMin: Number(e.target.value) })}
                        className="w-full accent-[#1A56DB]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-body text-[#6B7280]">Max budget</span>
                        <span className="font-mono-stats font-bold text-sm text-[#1C1917]">${form.budgetMax}{form.budgetType === "hourly" ? "/hr" : ""}</span>
                      </div>
                      <input
                        type="range"
                        min="500" max="50000" step="500"
                        value={form.budgetMax}
                        onChange={(e) => setForm({ ...form, budgetMax: Number(e.target.value) })}
                        className="w-full accent-[#1A56DB]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <label className="block font-heading font-semibold text-sm text-[#1C1917] mb-2">Project Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EBEBEB] rounded-xl font-body text-sm text-[#1C1917] outline-none focus:border-[#1A56DB] transition-colors"
                  />
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {["1 Week", "2 Weeks", "1 Month"].map((opt) => (
                      <button
                        key={opt}
                        className="py-2 bg-[#FAF8F5] border border-[#EBEBEB] rounded-xl text-xs font-heading font-semibold text-[#6B7280] hover:border-[#1A56DB] hover:text-[#1A56DB] transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div key="s6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <label className="block font-heading font-semibold text-sm text-[#1C1917] mb-3">Required Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all ${
                          form.skills.includes(skill)
                            ? "badge-new-talent"
                            : "bg-[#FAF8F5] border border-[#EBEBEB] text-[#6B7280] hover:border-[#6366F1] hover:text-[#6366F1]"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-body text-[#9CA3AF] mt-3">{form.skills.length} skills selected · Select up to 8</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-semibold text-sm text-[#6B7280] border border-[#EBEBEB] hover:bg-[#F5F3F0] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {step < steps.length ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1A56DB] text-white rounded-xl font-heading font-semibold text-sm hover:bg-[#1648C4] transition-all btn-press shadow-md shadow-blue-100"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#10B981] text-white rounded-xl font-heading font-semibold text-sm hover:bg-emerald-600 transition-all btn-press shadow-md shadow-emerald-100 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Publish Project
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
