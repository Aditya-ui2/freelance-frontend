import { motion } from "framer-motion";
import { CreditCard, ArrowUpRight, ArrowDownLeft, ShieldCheck, Clock, Wallet, DollarSign, ExternalLink, LogOut } from "lucide-react";

export default function PaymentsDashboard({ user, onLogout }: { user: any; onLogout?: () => void }) {
  const transactions = user?.transactions || [];
  
  // Format currency
  const formatUSD = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  const stats = [
    { label: "Available to Withdraw", value: formatUSD(user?.balance), icon: Wallet, color: "text-[#10B981]", bg: "bg-emerald-50" },
    { label: "In Active Escrow", value: formatUSD(user?.escrowBalance), icon: ShieldCheck, color: "text-[#6366F1]", bg: "bg-indigo-50" },
    { label: "Pending Verification", value: formatUSD(user?.pendingBalance), icon: Clock, color: "text-[#F59E0B]", bg: "bg-amber-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="font-display font-black text-4xl text-[#1C1917] mb-2">SafePay Dashboard</h1>
          <p className="font-body text-[#6B7280]">Your financial command center with 100% Escrow security.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-6 py-3 bg-white border border-[#EBEBEB] text-[#1C1917] rounded-xl font-heading font-bold hover:bg-[#FAF8F5] transition-all">Export Report</button>
           <button className="px-6 py-3 bg-[#1A56DB] text-white rounded-xl font-heading font-bold hover:bg-[#1648C4] transition-all shadow-lg shadow-blue-100">Withdraw Funds</button>
           <button
             onClick={onLogout}
             className="px-6 py-3 bg-white border border-red-100 text-red-500 rounded-xl font-heading font-bold hover:bg-red-50 transition-all flex items-center gap-2"
           >
             <LogOut className="w-4 h-4" />
             Logout
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2rem] border border-[#EBEBEB] shadow-sm relative overflow-hidden"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-heading font-bold text-[#6B7280] uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-mono-stats font-bold text-[#1C1917]">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Transaction History */}
        <div className="flex-1">
          <div className="bg-white rounded-[2rem] border border-[#EBEBEB] overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-[#F5F3F0] flex items-center justify-between">
              <h3 className="font-heading font-bold text-[#1C1917]">Recent Transactions</h3>
              <button className="text-xs text-[#1A56DB] font-heading font-bold hover:underline">View All</button>
            </div>
            <div className="divide-y divide-[#F5F3F0]">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-8 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors group">
                   <div className="flex items-center gap-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-50 text-[#10B981]' : 'bg-blue-50 text-[#1A56DB]'}`}>
                        {tx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                      </div>
                      <div>
                         <h4 className="font-heading font-bold text-[#1C1917] mb-1 group-hover:text-[#1A56DB] transition-colors">{tx.title}</h4>
                         <p className="text-xs font-body text-[#6B7280]">{tx.project}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="font-mono-stats font-bold text-[#1C1917] mb-1">
                        {tx.type === 'income' ? '+' : ''}${tx.amount}
                      </div>
                      <div className="flex items-center justify-end gap-2">
                         <span className={`text-[10px] font-heading font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${tx.status === 'Released' ? 'bg-emerald-50 text-[#10B981]' : 'bg-[#FAF8F5] text-[#9CA3AF]'}`}>
                           {tx.status}
                         </span>
                         <span className="text-[10px] text-[#9CA3AF] font-body">{tx.date}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: SafePay Info */}
        <div className="w-full lg:w-80 space-y-6">
           <section className="bg-[#1C1917] rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <CreditCard className="w-24 h-24" />
              </div>
              <h4 className="font-heading font-bold text-sm mb-4 relative z-10">SafePay Protection</h4>
              <p className="text-xs font-body text-[#9CA3AF] mb-6 leading-relaxed relative z-10">
                All projects on FreelanceUp require 100% upfront payment into our secure Escrow. Funds are only released when milestones are approved.
              </p>
              <ul className="space-y-3 relative z-10">
                 {[
                   "Automated Invoicing",
                   "Dispute Mediation",
                   "Instant Bank Payouts",
                   "Tax Compliance Ready"
                 ].map((item) => (
                   <li key={item} className="flex items-center gap-2 text-[10px] font-heading font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      {item}
                   </li>
                 ))}
              </ul>
           </section>

           <div className="bg-white rounded-3xl border border-[#EBEBEB] p-6 space-y-6">
              <div className="flex items-center justify-between">
                 <h4 className="font-heading font-bold text-sm text-[#1C1917]">Earnings Logic</h4>
                 <DollarSign className="w-4 h-4 text-[#10B981]" />
              </div>
              <div className="space-y-4">
                 {[
                   { label: "Platform Fee", value: "3.5%", desc: "Lowered by Trust Score" },
                   { label: "Taxes (GST/VAT)", value: "Variable", desc: "Based on region" },
                   { label: "Net Earnings", value: "96.5%", desc: "To your pocket" }
                 ].map((item) => (
                   <div key={item.label} className="group">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-xs font-body text-[#6B7280]">{item.label}</span>
                         <span className="text-sm font-mono-stats font-bold text-[#1C1917]">{item.value}</span>
                      </div>
                      <p className="text-[10px] font-body text-[#9CA3AF] group-hover:text-[#1A56DB] transition-colors">{item.desc}</p>
                   </div>
                 ))}
              </div>
              <button className="w-full py-3 bg-[#FAF8F5] border border-[#EBEBEB] text-[#1C1917] rounded-xl text-[10px] font-heading font-black hover:bg-[#1A56DB] hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                Download Tax Forms
                <ExternalLink className="w-3 h-3" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
