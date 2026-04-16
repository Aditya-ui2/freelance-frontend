import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, Plus, FileCode, Figma, Globe, ExternalLink, Trash2, Eye, Target, Code, X, Download, Maximize2, Pencil } from "lucide-react";
import { portfolioApi } from "../lib/api";
import { toast } from "sonner";
import AddPOCModal from "./AddPOCModal";

export default function PortfolioStudio({ user, onRefresh, onNavigate }: { user: any; onRefresh?: () => void; onNavigate?: (page: string) => void }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPoc, setEditingPoc] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingPoc, setViewingPoc] = useState<any>(null);

  const rawPocs = Array.isArray(user?.pocs) 
    ? user.pocs 
    : (typeof user?.pocs === 'string' ? JSON.parse(user.pocs) : []);

  const pocs = rawPocs.map((p: any) => ({
    ...p,
    icon: p.type === "Design" ? Figma : p.type === "Code" ? FileCode : Globe,
    color: p.type === "Design" ? "bg-pink-50 text-pink-500" : p.type === "Code" ? "bg-blue-50 text-blue-500" : "bg-emerald-50 text-emerald-500"
  }));

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id.startsWith('mock-')) {
      toast.error("Cannot delete demo data");
      return;
    }

    setDeletingId(id);
    try {
      await portfolioApi.deletePoc(id);
      toast.success("POC removed successfully");
      onRefresh?.();
    } catch (err) {
      toast.error("Failed to delete POC");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="font-display font-black text-4xl text-[#1C1917] mb-2">POC Studio</h1>
          <p className="font-body text-[#6B7280]">Manage your specialized Proof-of-Concepts and win trust.</p>
        </motion.div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#1A56DB] text-white rounded-2xl font-heading font-bold hover:bg-[#1648C4] transition-all btn-press shadow-lg shadow-blue-100"
        >
          <Plus className="w-5 h-5" />
          Add New POC
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setShowAddModal(true)}
          className="aspect-[4/3] rounded-[2.5rem] border-2 border-dashed border-[#EBEBEB] flex flex-col items-center justify-center gap-4 hover:border-[#1A56DB] hover:bg-blue-50/20 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] flex items-center justify-center group-hover:bg-[#1A56DB] transition-colors shadow-sm">
            <Plus className="w-8 h-8 text-[#9CA3AF] group-hover:text-white" />
          </div>
          <span className="font-heading font-bold text-[#6B7280] group-hover:text-[#1A56DB]">Create POC Asset</span>
        </motion.button>

        <AnimatePresence mode="popLayout">
          {pocs.map((poc) => (
            <motion.div
              key={poc.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setViewingPoc(poc)}
              className="group relative bg-white rounded-[2.5rem] border border-[#EBEBEB] overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#1A56DB]/20 transition-all cursor-pointer"
            >
              <div className="aspect-video bg-[#FAF8F5] relative overflow-hidden">
                {poc.imageUrl ? (
                  <img src={poc.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={poc.title} />
                ) : poc.type === "Code" ? (
                  <div className="absolute inset-0 bg-[#1C1917] flex items-center justify-center p-6">
                    <div className="w-full h-full border border-emerald-500/20 rounded-xl p-4 overflow-hidden relative">
                       <Code className="w-12 h-12 text-emerald-500/20 absolute -right-2 -bottom-2" />
                       <p className="font-mono text-[8px] text-emerald-400/40 leading-relaxed truncate-3-lines">
                          {poc.codeContent || "// Source code snippet protected"}
                       </p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <poc.icon className="w-24 h-24" />
                  </div>
                )}
                
                <div className="absolute top-4 left-4">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-heading font-black uppercase tracking-widest flex items-center gap-2 ${poc.color} border border-white backdrop-blur-md shadow-sm`}>
                    <poc.icon className="w-3.5 h-3.5" />
                    {poc.type}
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-[#1C1917]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <div className="p-4 bg-white rounded-2xl text-[#1C1917] hover:bg-[#1A56DB] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPoc(poc);
                    }}
                    className="p-4 bg-white rounded-2xl text-[#1C1917] hover:bg-amber-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(poc.id, e)}
                    className="p-4 bg-red-500 rounded-2xl text-white hover:bg-red-600 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-bold text-lg text-[#1C1917] group-hover:text-[#1A56DB] transition-colors">{poc.title}</h3>
                  <span className="text-[10px] font-body text-[#9CA3AF] bg-[#FAF8F5] px-2 py-0.5 rounded-md">{poc.date}</span>
                </div>
                
                <div className="flex items-center gap-5 text-xs font-body text-[#6B7280]">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#9CA3AF]" />
                    {poc.platform || "Custom Store"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-[#9CA3AF]" />
                    {poc.views || 0} views
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#F5F3F0] flex items-center justify-between">
                  {poc.visibility === "Public" ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-500 rounded-xl text-[10px] font-heading font-black tracking-wide">
                      <Globe className="w-3.5 h-3.5" />
                      PUBLIC
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-xl text-[10px] font-heading font-black tracking-wide">
                      <Layout className="w-3.5 h-3.5" />
                      PRIVATE
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-[#10B981] rounded-xl text-[10px] font-heading font-black tracking-wide">
                    <Target className="w-4 h-4" />
                    POC READY
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Viewer Modal */}
      <AnimatePresence>
        {viewingPoc && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setViewingPoc(null)}
              className="absolute inset-0 bg-[#1C1917]/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 flex items-center justify-between border-b border-[#F5F3F0]">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${viewingPoc.color} bg-opacity-10`}>
                    <viewingPoc.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-2xl text-[#1C1917]">{viewingPoc.title}</h2>
                    <p className="text-sm text-[#6B7280] font-body">Type: {viewingPoc.type} • Platform: {viewingPoc.platform}</p>
                  </div>
                </div>
                <button onClick={() => setViewingPoc(null)} className="p-3 hover:bg-[#FAF8F5] rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#9CA3AF]" />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {viewingPoc.imageUrl && (
                  <div className="rounded-[2.5rem] overflow-hidden border border-[#EBEBEB] shadow-inner mb-8 bg-[#FAF8F5]">
                    <img src={viewingPoc.imageUrl} className="w-full h-auto" alt="Full View" />
                  </div>
                )}
                
                {viewingPoc.codeContent && (
                  <div className="bg-[#1C1917] rounded-[2rem] p-8 shadow-2xl relative group">
                    <div className="absolute top-6 right-6 flex gap-2">
                       <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                          <Download className="w-4 h-4" />
                       </button>
                    </div>
                    <pre className="font-mono text-sm text-emerald-400 overflow-x-auto custom-scrollbar leading-relaxed">
                      <code>{viewingPoc.codeContent}</code>
                    </pre>
                  </div>
                )}

                {viewingPoc.url && viewingPoc.url !== "#" && (
                  <div className="mt-8 bg-blue-50 border border-blue-100 rounded-3xl p-8 flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-black text-[#1A56DB] mb-1">External Resource Found</h4>
                      <p className="text-sm text-blue-600/60 font-body">Access the original file or live project link.</p>
                    </div>
                    <a 
                      href={viewingPoc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-[#1A56DB] text-white rounded-2xl font-heading font-bold hover:bg-[#1648C4] transition-all flex items-center gap-2"
                    >
                      Open Resource <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(showAddModal || editingPoc) && (
          <AddPOCModal 
            initialData={editingPoc}
            onClose={() => {
              setShowAddModal(false);
              setEditingPoc(null);
            }}
            onSuccess={() => {
              setShowAddModal(false);
              setEditingPoc(null);
              onRefresh?.();
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
