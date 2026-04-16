import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { analyticsApi, projectApi } from "../lib/api";
import { Wallet, Briefcase, FileText, TrendingUp, ArrowUpRight, ArrowDownRight, Lock, Unlock, Clock, Download, Plus, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function FinanceHub() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchFinance = async () => {
    try {
      const response = await analyticsApi.getClientDashboard();
      setData(response.data.finance);
    } catch (err) {
      console.error("Failed to fetch finance:", err);
      toast.error("Failed to load financial records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-[#1A56DB] animate-spin mb-4" />
        <p className="font-body text-[#6B7280]">Recalculating ledger balances...</p>
      </div>
    );
  }

  const metrics = [
    {
      title: "Active Escrow",
      value: `$${(data?.activeEscrow || 0).toLocaleString()}`,
      icon: Lock,
      color: "blue",
      trend: "+12%",
      isPositive: true
    },
    {
      title: "Total Spent",
      value: `$${(data?.totalSpent || 0).toLocaleString()}`,
      icon: Wallet,
      color: "emerald",
      trend: "+8%",
      isPositive: true
    },
    {
      title: "Pending Invoices",
      value: data?.pendingInvoices || 0,
      icon: FileText,
      color: "amber",
      trend: "3 tasks",
      isPositive: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                 <Wallet className="w-6 h-6" />
              </div>
              <h1 className="font-display font-black text-3xl text-[#1C1917]">Finance Hub</h1>
           </div>
           <p className="font-body text-base text-[#6B7280] max-w-xl">
              Real-time visibility into your freelance spending and escrow security.
           </p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-white border border-[#EBEBEB] text-[#6B7280] rounded-xl text-[10px] font-heading font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Download Q1 Report
           </button>
           <button className="px-8 py-3 bg-[#1C1917] text-white rounded-xl text-[10px] font-heading font-black uppercase tracking-widest hover:bg-[#1A56DB] transition-all shadow-xl shadow-black/10">
              Manage Wallet
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white p-8 rounded-[2.5rem] border border-[#EBEBEB] hover:shadow-2xl transition-all duration-500"
          >
            <div className="flex items-center gap-4 mb-6">
               <div className={`w-12 h-12 rounded-2xl bg-${metric.color}-50 flex items-center justify-center text-${metric.color}-600`}>
                  <metric.icon className="w-6 h-6" />
               </div>
               <span className="text-[10px] font-heading font-black text-[#9CA3AF] uppercase tracking-widest">{metric.title}</span>
            </div>
            <div className="flex items-end justify-between">
               <div className="text-4xl font-mono-stats font-bold text-[#1C1917]">{metric.value}</div>
               <div className={`flex items-center gap-1 text-[10px] font-bold ${metric.isPositive ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {metric.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {metric.trend}
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className="bg-white rounded-[3rem] border border-[#EBEBEB] overflow-hidden">
              <div className="p-8 border-b border-[#F5F3F0] flex items-center justify-between">
                 <h3 className="font-heading font-black text-xl text-[#1C1917]">Invoices & Escrow</h3>
                 <button className="text-[10px] font-heading font-black text-[#1A56DB] uppercase tracking-widest hover:underline">View All History</button>
              </div>
              <div className="p-4">
                 {data?.recentTransactions?.map((tx: any, i: number) => (
                   <div key={i} className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-3xl transition-colors group">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-2xl bg-[#EBEBEB]/50 flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#1C1917] group-hover:text-white transition-colors">
                            <Briefcase className="w-6 h-6" />
                         </div>
                         <div>
                            <h4 className="font-heading font-bold text-sm text-[#1C1917]">{tx.title}</h4>
                            <p className="text-[10px] font-body text-[#9CA3AF]">Freelancer: <span className="text-[#1C1917] font-bold">{tx.freelancer}</span> • {tx.date}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="font-mono-stats font-bold text-lg text-[#1C1917] mb-1">${(tx.amount || 0).toLocaleString()}</div>
                         <div className="text-[8px] font-heading font-black uppercase tracking-widest text-[#9CA3AF] group-hover:text-[#10B981] transition-colors">{tx.status}</div>
                      </div>
                   </div>
                 ))}
                 {data?.recentTransactions?.length === 0 && (
                   <div className="p-20 text-center">
                      <p className="text-sm text-[#9CA3AF] italic">No recent transactions found.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-[#1C1917] p-8 rounded-[3rem] text-white relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all" />
              <div className="relative z-10">
                 <h3 className="font-heading font-black text-2xl mb-2">Spending ROI</h3>
                 <p className="text-[11px] text-[#9CA3AF] mb-8">Your output quality has increased by <span className="text-emerald-400">18%</span> compared to last month based on project deliverables.</p>
                 
                 <div className="space-y-6">
                    <div>
                       <div className="flex justify-between text-[9px] font-heading font-black uppercase tracking-widest mb-2">
                          <span>Design ROI</span>
                          <span>85%</span>
                       </div>
                       <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-blue-500" />
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-[9px] font-heading font-black uppercase tracking-widest mb-2">
                          <span>Dev Efficiency</span>
                          <span>72%</span>
                       </div>
                       <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "72%" }} className="h-full bg-emerald-400" />
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-[9px] font-heading font-black uppercase tracking-widest mb-2">
                          <span>Brand Impact</span>
                          <span>94%</span>
                       </div>
                       <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} className="h-full bg-amber-400" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-[#EBEBEB]">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                 <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-[#1C1917] mb-2">Quick Financial Tip</h4>
              <p className="font-body text-xs text-[#6B7280] leading-relaxed">
                 Projects with clear Proof-of-Concept requirements have a **24% lower escrow dispute rate**. Always review POCs before releasing funds.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
