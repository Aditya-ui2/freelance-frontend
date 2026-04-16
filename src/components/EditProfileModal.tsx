import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Shield, Star, DollarSign, Brain, FileText, BadgeCheck } from "lucide-react";
import { userApi } from "../lib/api";
import { toast } from "sonner";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess: (updatedUser: any) => void;
}

export default function EditProfileModal({ isOpen, onClose, user, onSuccess }: EditProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    title: user?.title || "",
    bio: user?.bio || "",
    rate: user?.rate || 0,
    skills: Array.isArray(user?.skills) ? user.skills.join(", ") : (user?.skills || "")
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Format data for backend
      const payload = {
        name: form.name,
        title: form.title,
        bio: form.bio,
        rate: parseFloat(form.rate.toString()),
        skills: form.skills.split(",").map(s => s.trim()).filter(Boolean)
      };

      const { data } = await userApi.updateProfile({ profile: payload });
      toast.success("Profile updated successfully!");
      onSuccess(data);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl relative z-10"
          >
            <div className="p-8 border-b border-[#F5F5F5] flex items-center justify-between bg-gradient-to-r from-white to-[#FAF8F5]">
              <div>
                <h2 className="font-heading font-black text-2xl text-[#1C1917]">Edit Your Profile</h2>
                <p className="font-body text-xs text-[#6B7280] mt-1 uppercase tracking-widest font-bold opacity-70">Update your professional identity</p>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-white border border-[#EBEBEB] rounded-2xl hover:bg-[#FAF8F5] transition-all"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 font-heading font-black text-[10px] text-[#1C1917] uppercase tracking-widest mb-2 px-1">
                    <Star className="w-3 h-3 text-[#1A56DB]" />
                    Full Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl font-body text-sm outline-none focus:border-[#1A56DB] transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 font-heading font-black text-[10px] text-[#1C1917] uppercase tracking-widest mb-2 px-1">
                    <Shield className="w-3 h-3 text-[#1A56DB]" />
                    Professional Title
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl font-body text-sm outline-none focus:border-[#1A56DB] transition-all"
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 font-heading font-black text-[10px] text-[#1C1917] uppercase tracking-widest mb-2 px-1">
                  <DollarSign className="w-3 h-3 text-[#1A56DB]" />
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  value={form.rate}
                  onChange={(e) => setForm({ ...form, rate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl font-body text-sm outline-none focus:border-[#1A56DB] transition-all"
                  placeholder="e.g. 45"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-heading font-black text-[10px] text-[#1C1917] uppercase tracking-widest mb-2 px-1">
                  <Brain className="w-3 h-3 text-[#1A56DB]" />
                  Skills (Comma separated)
                </label>
                <textarea
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl font-body text-sm outline-none focus:border-[#1A56DB] transition-all min-h-[100px] resize-none"
                  placeholder="React, Figma, Node.js, etc."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-heading font-black text-[10px] text-[#1C1917] uppercase tracking-widest mb-2 px-1">
                  <FileText className="w-3 h-3 text-[#1A56DB]" />
                  Professional Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl font-body text-sm outline-none focus:border-[#1A56DB] transition-all min-h-[120px] resize-none"
                  placeholder="Tell clients about your experience and how you can help them..."
                />
              </div>
            </form>

            <div className="p-8 border-t border-[#F5F5F5] bg-[#FAF8F5]/50 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 border border-[#EBEBEB] text-[#1C1917] rounded-2xl font-heading font-black text-sm hover:bg-white transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] py-4 bg-[#1C1917] text-white rounded-2xl font-heading font-black text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
