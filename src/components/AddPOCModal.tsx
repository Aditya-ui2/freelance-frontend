import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Figma, FileCode, Globe, Link2, Layout, Upload, Image as ImageIcon, Code as CodeIcon } from "lucide-react";
import { toast } from "sonner";
import { portfolioApi } from "../lib/api";

interface AddPOCModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function AddPOCModal({ onClose, onSuccess, initialData }: AddPOCModalProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    type: initialData?.type || "Design",
    platform: initialData?.platform || "Figma",
    url: initialData?.url || "",
    imageUrl: initialData?.imageUrl || "",
    codeContent: initialData?.codeContent || "",
    visibility: initialData?.visibility || "Public"
  });

  const types = [
    { name: "Design", icon: Figma, color: "text-pink-500", bg: "bg-pink-50" },
    { name: "Code", icon: FileCode, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Web", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
        toast.error("Please provide a title");
        return;
    }

    if (formData.type === "Design" && !formData.imageUrl && !formData.url) {
      toast.error("Please upload an image or provide a portfolio link");
      return;
    }

    if (formData.type === "Code" && !formData.codeContent && !formData.url) {
      toast.error("Please paste your code or provide a repository link");
      return;
    }

    if (formData.type === "Web" && !formData.url) {
      toast.error("Please provide a project URL");
      return;
    }

    setLoading(true);
    try {
      if (initialData?.id) {
        await portfolioApi.updatePoc(initialData.id, formData);
        toast.success("POC updated successfully!");
      } else {
        await portfolioApi.addPoc(formData);
        toast.success("POC added to your studio!");
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save POC");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1C1917]/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-[#F5F3F0] flex items-center justify-between bg-[#1C1917] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              {initialData ? <Layout className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="font-display font-black text-xl">{initialData ? "Edit POC Asset" : "Create POC Asset"}</h2>
              <p className="text-xs text-blue-100/60 font-body">{initialData ? "Refine your proof of talent" : "Add specialized proof of talent"}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-heading font-black text-[#9CA3AF] uppercase tracking-widest px-1">Proof Context (Title)</label>
            <input
              required
              type="text"
              placeholder="e.g. Optimized Auth Flow"
              className="w-full px-6 py-4 bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl focus:ring-2 focus:ring-[#1A56DB] outline-none font-body text-sm transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-heading font-black text-[#9CA3AF] uppercase tracking-widest px-1">Upload Preview / Screenshot (Recommended)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-video bg-[#FAF8F5] border-2 border-dashed border-[#EBEBEB] rounded-[2rem] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#1A56DB] hover:bg-blue-50/20 transition-all group overflow-hidden relative"
            >
              {formData.imageUrl ? (
                <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-[#9CA3AF] group-hover:text-[#1A56DB]" />
                  <span className="text-xs font-heading font-bold text-[#6B7280]">Add Screenshot (JPG/PNG)</span>
                </>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {types.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setFormData({ ...formData, type: t.name, platform: t.name === "Design" ? "Portfolio" : t.name === "Code" ? "Local Snippet" : "Live URL" })}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.type === t.name ? 'border-[#1A56DB] bg-blue-50/50' : 'border-[#EBEBEB] bg-white hover:border-[#1A56DB]/30'}`}
              >
                <div className={`w-10 h-10 rounded-xl ${t.bg} flex items-center justify-center ${t.color}`}>
                  <t.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-heading font-bold text-[#1C1917]">{t.name}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {formData.type === "Design" && (
              <motion.div
                key="design-fields"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-black text-[#9CA3AF] uppercase tracking-widest px-1">Portfolio / Figma Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://figma.com/..."
                    className="w-full px-6 py-4 bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl outline-none font-body text-sm"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>
              </motion.div>
            )}

            {formData.type === "Code" && (
              <motion.div
                key="code-fields"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-black text-[#9CA3AF] uppercase tracking-widest px-1">Paste Your Code Snippet</label>
                  <div className="bg-[#1C1917] rounded-[2rem] p-6 shadow-inner border-t border-white/5">
                    <textarea
                      placeholder="// Paste your logic here..."
                      className="w-full h-48 bg-transparent text-emerald-400 font-mono text-xs outline-none resize-none custom-scrollbar"
                      value={formData.codeContent}
                      onChange={(e) => setFormData({ ...formData, codeContent: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-black text-[#9CA3AF] uppercase tracking-widest px-1">Repository Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    className="w-full px-6 py-4 bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl outline-none font-body text-sm"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>
              </motion.div>
            )}

            {formData.type === "Web" && (
              <motion.div
                key="web-fields"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-black text-[#9CA3AF] uppercase tracking-widest px-1">Live Project Link</label>
                  <div className="relative">
                    <Link2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                      required
                      type="url"
                      placeholder="https://project.com"
                      className="w-full pl-14 pr-6 py-4 bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl outline-none font-body text-sm"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-heading font-black text-[#9CA3AF] uppercase tracking-widest px-1">Studio Visibility</label>
            <div className="flex p-1.5 bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl gap-2">
               <button 
                type="button"
                onClick={() => setFormData({ ...formData, visibility: 'Public' })}
                className={`flex-1 py-3 rounded-xl text-xs font-heading font-bold transition-all ${formData.visibility === 'Public' ? 'bg-white text-[#1A56DB] shadow-sm' : 'text-[#6B7280] hover:text-[#1C1917]'}`}
               >
                 Public
               </button>
               <button 
                type="button"
                onClick={() => setFormData({ ...formData, visibility: 'Private' })}
                className={`flex-1 py-3 rounded-xl text-xs font-heading font-bold transition-all ${formData.visibility === 'Private' ? 'bg-[#1C1917] text-white shadow-lg' : 'text-[#6B7280] hover:text-[#1C1917]'}`}
               >
                 Private
               </button>
            </div>
            <p className="text-[10px] text-[#9CA3AF] font-body px-1">
              {formData.visibility === 'Public' 
                ? "This POC will be visible to everyone on your profile." 
                : "Internal use only. Use this to attach proof to specific bids privately."}
            </p>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 border-2 border-[#EBEBEB] text-[#1C1917] rounded-2xl font-heading font-bold hover:bg-[#FAF8F5] transition-all"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="flex-1 px-8 py-4 bg-[#1A56DB] text-white rounded-2xl font-heading font-bold hover:bg-[#1648C4] transition-all relative overflow-hidden group shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              <span className={loading ? 'opacity-0' : 'opacity-100'}>Save to Studio</span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
