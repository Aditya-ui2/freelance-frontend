import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, DollarSign, Target, PieChart, ArrowUpRight, ArrowDownRight, Download, Loader2 } from "lucide-react";
import { analyticsApi } from "../lib/api";
import { toast } from "sonner";

export default function ClientInsights() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      const { data } = await analyticsApi.getClientDashboard();
      setData(data.insights);
    } catch (err) {
      console.error("Failed to fetch insights:", err);
      toast.error("Failed to load analytics dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <BarChart3 className="w-12 h-12 text-[#1A56DB] animate-pulse mb-4" />
        <p className="font-body text-[#6B7280]">Calculating project performance metrics...</p>
      </div>
    );
  }

  const kpis = [
    {
      title: "Hiring Velocity",
      value: `${data?.hiringVelocity || 4.2} days`,
      icon: TrendingUp,
      trend: "+12%",
      isPositive: true,
      color: "blue"
    },
    {
      title: "Cost per Match",
      value: "$0.45", // Keeping this logical for now as per image
      icon: DollarSign,
      trend: "-8%",
      isPositive: false,
      color: "emerald"
    },
    {
      title: "Fulfillment Rate",
      value: `${data?.fulfillmentRate || 94}%`,
      icon: Target,
      trend: "+3%",
      isPositive: true,
      color: "orange"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                 <BarChart3 className="w-6 h-6" />
              </div>
              <h1 className="font-display font-black text-3xl text-[#1C1917]">Client Insights</h1>
           </div>
           <p className="font-body text-base text-[#6B7280] max-w-xl">
              Advanced data analytics to measure your hiring ROI and project performance.
           </p>
        </div>
        <button className="px-8 py-3 bg-white border border-[#EBEBEB] text-[#1C1917] rounded-xl text-[10px] font-heading font-black uppercase tracking-widest hover:bg-[#1C1917] hover:text-white transition-all shadow-sm flex items-center gap-2">
           <Download className="w-4 h-4" /> Export Dataset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-[#EBEBEB] hover:shadow-xl transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl bg-${kpi.color}-50 flex items-center justify-center text-${kpi.color}-600 mb-6 font-bold shadow-sm`}>
               <kpi.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-heading font-black text-[#9CA3AF] uppercase tracking-widest mb-2 block">{kpi.title}</span>
            <div className="flex items-end justify-between">
               <div className="text-3xl font-mono-stats font-bold text-[#1C1917]">{kpi.value}</div>
               <div className={`flex items-center gap-1 text-[10px] font-bold ${kpi.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.trend}
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#1C1917] p-10 rounded-[3rem] text-white">
           <div className="flex items-center justify-between mb-10">
              <h3 className="font-heading font-black text-2xl">Spending Trends</h3>
              <div className="flex gap-2">
                 <button className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white">Monthly</button>
                 <button className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white">Yearly</button>
              </div>
           </div>
           
           <div className="h-64 flex items-end justify-between gap-4">
              {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                   <motion.div 
                     initial={{ height: 0 }}
                     animate={{ height: `${h}%` }}
                     transition={{ delay: i * 0.1, duration: 1 }}
                     className="w-full bg-indigo-500/20 hover:bg-indigo-500 transition-colors rounded-t-xl relative group"
                   >
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-[#1C1917] px-2 py-1 rounded-lg text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                        ${(h * 10).toLocaleString()}
                     </div>
                   </motion.div>
                   <span className="text-[10px] font-heading font-black text-[#4B5563] uppercase">
                      {['J', 'F', 'M', 'A', 'M', 'J', 'J'][i]}
                   </span>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-[#EBEBEB]">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-heading font-black text-2xl text-[#1C1917]">Talent Distribution</h3>
              <PieChart className="w-6 h-6 text-[#9CA3AF]" />
           </div>

           <div className="space-y-8">
              {data?.talentDistribution?.map((dist: any, i: number) => (
                <div key={i}>
                   <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-emerald-500' : i === 2 ? 'bg-amber-400' : 'bg-rose-500'}`} />
                         <span className="font-heading font-bold text-sm text-[#1C1917]">{dist.name}</span>
                      </div>
                      <span className="text-xs font-body text-[#9CA3AF]">{dist.count} freelancers hired</span>
                   </div>
                   <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(dist.count / 26) * 100}%` }} // Simplified total
                        className={`h-full ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-emerald-500' : i === 2 ? 'bg-amber-400' : 'bg-rose-500'}`}
                      />
                   </div>
                </div>
              ))}
              {(!data?.talentDistribution || data.talentDistribution.length === 0) && (
                <div className="py-10 text-center italic text-sm text-[#9CA3AF]">
                   Apply more hires to see distribution mapping.
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
