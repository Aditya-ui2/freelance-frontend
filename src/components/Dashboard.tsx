import { useState, useEffect } from "react";
import { projectApi, applicationApi, analyticsApi } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  TrendingUp, Briefcase, DollarSign, Eye, MessageSquare,
  Star, Award, ArrowUpRight, ArrowDownRight, Calendar,
  ChevronRight, Bell, Clock, User, Target, ShieldCheck, LogOut
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weeklyData = [
  { day: "Mon", earnings: 0 },
  { day: "Tue", earnings: 0 },
  { day: "Wed", earnings: 0 },
  { day: "Thu", earnings: 0 },
  { day: "Fri", earnings: 0 },
  { day: "Sat", earnings: 0 },
  { day: "Sun", earnings: 0 },
];

interface DashboardProps {
  userType?: "freelancer" | "client";
  user?: any;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export default function Dashboard({ userType = "freelancer", user, onNavigate, onLogout }: DashboardProps) {
  const [chartView, setChartView] = useState<"weekly" | "monthly">("weekly");
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [isBlindMode, setIsBlindMode] = useState(false);
  const [chartData, setChartData] = useState<any[]>(weeklyData);
  const [allCharts, setAllCharts] = useState<{ weeklyChart: any[], monthlyChart: any[] }>({ weeklyChart: [], monthlyChart: [] });

  const currentType = user?.userType || userType;

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const iconMap: any = {
          "Active Bids": Briefcase,
          "Projects Won": Award,
          "Total Earnings": DollarSign,
          "Profile Views": Eye,
          "Posted Projects": Briefcase,
          "Total Proposals": MessageSquare,
          "Hired Freelancers": User,
          "Total Spent": DollarSign,
          "Briefcase": Briefcase,
          "Award": Award,
          "DollarSign": DollarSign,
          "Eye": Eye,
          "MessageSquare": MessageSquare,
          "User": User
        };

        if (currentType === "freelancer") {
          const { data: applications } = await applicationApi.getMyApplications();
          setItems(applications
            .filter((app: any) => app.Project?.status !== "completed")
            .map((app: any) => ({
              id: app.id,
              project: app.Project?.title || "Unknown Project",
              client: app.Project?.Client?.name || "Client",
              budget: `$${(app.bidAmount || app.Project?.budget || 0).toLocaleString()}`,
              submitted: new Date(app.createdAt).toLocaleDateString(),
              status: app.status,
              stakedBadge: !!app.stakedBadgeId,
              poc: !!app.pocContent,
              deadline: "N/A",
            })));

          const { data: analytics } = await analyticsApi.getFreelancerDashboard();
          setDashboardStats((analytics.stats || []).map((s: any) => ({
            ...s,
            icon: iconMap[s.label] || iconMap[s.icon] || Target
          })));
          setAllCharts({
            weeklyChart: analytics.weeklyChart || [],
            monthlyChart: analytics.monthlyChart || []
          });
          setChartData(analytics.weeklyChart || weeklyData);
        } else {
          const { data: projects } = await projectApi.getMyProjects();
          setItems(projects.map((p: any) => ({
            id: p.id,
            project: p.title,
            client: "You",
            budget: `$${(p.budget || 0).toLocaleString()}`,
            submitted: new Date(p.createdAt).toLocaleDateString(),
            status: p.status === "open" ? "viewed" : "shortlisted",
            deadline: "N/A",
          })));

          const { data: analytics } = await analyticsApi.getClientDashboard();
          setDashboardStats((analytics.stats || []).map((s: any) => ({
            ...s,
            icon: iconMap[s.label] || iconMap[s.icon] || Target
          })));
          setAllCharts({
            weeklyChart: analytics.weeklyChart || [],
            monthlyChart: analytics.monthlyChart || []
          });
          setChartData(analytics.weeklyChart || weeklyData);
          setChartView("weekly");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id || !loading) {
      fetchDashboardData();
    }
  }, [currentType, user?.id]);

  // Sync displayed chart with view toggle
  useEffect(() => {
    if (chartView === "weekly") {
      setChartData(allCharts.weeklyChart.length > 0 ? allCharts.weeklyChart : weeklyData);
    } else {
      setChartData(allCharts.monthlyChart.length > 0 ? allCharts.monthlyChart : weeklyData);
    }
  }, [chartView, allCharts]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-[#6B7280]">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <h1 className="font-display font-black text-3xl lg:text-4xl text-[#1C1917] mt-1" style={{ letterSpacing: "-0.02em" }}>
                Welcome back, {user?.name || "User"} 👋
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-3">
              {userType === "client" && (
                <div className="flex items-center gap-3 mr-4 px-4 py-2 bg-white border border-[#EBEBEB] rounded-xl shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-heading font-bold text-[#1A56DB] uppercase leading-none mb-1">Blind Hiring</span>
                    <span className="text-[9px] text-[#9CA3AF] font-body">Focus on skills first</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsBlindMode(!isBlindMode);
                      toast.info(`Blind Mode ${!isBlindMode ? 'Enabled' : 'Disabled'}`);
                    }}
                    className={`w-10 h-5 rounded-full transition-colors relative ${isBlindMode ? "bg-[#1A56DB]" : "bg-[#EBEBEB]"}`}
                  >
                    <motion.div
                      animate={{ x: isBlindMode ? 22 : 2 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
              )}
              <button
                onClick={() => onNavigate?.(userType === "freelancer" ? "browse" : "post")}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1A56DB] text-white rounded-xl font-heading font-semibold text-sm hover:bg-[#1648C4] transition-all btn-press shadow-md shadow-blue-100"
              >
                {userType === "freelancer" ? "Browse Projects" : "Post a Project"}
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-100 text-red-500 rounded-xl font-heading font-semibold text-sm hover:bg-red-50 transition-all btn-press shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {(loading ? Array(4).fill(null) : dashboardStats).map((stat, i) => (
            <motion.div
              key={stat?.label || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`bg-white border border-[#EBEBEB] rounded-2xl p-4 ${loading ? 'animate-pulse' : ''}`}
            >
              {loading ? (
                <div className="h-20" />
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-4.5 h-4.5" style={{ width: "18px", height: "18px" }} />
                    </div>
                    <div className={`flex items-center gap-0.5 text-[10px] font-mono-stats font-semibold ${stat.positive ? "text-[#10B981]" : "text-red-400"}`}>
                      {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="font-mono-stats font-bold text-2xl text-[#1C1917]">{stat.value}</div>
                  <div className="font-body text-xs text-[#9CA3AF] mt-0.5">{stat.label}</div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Earnings Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white border border-[#EBEBEB] rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#1C1917]">
                  {currentType === "client" ? "Total Spent (This Week)" : "Earnings Overview (This Week)"}
                </h3>
                <p className="text-xs text-[#9CA3AF] font-body mt-1">
                  {currentType === "client" 
                    ? "Weekly investment tracking and spending analysis" 
                    : "Real-time weekly performance tracking and budget analysis"}
                </p>
              </div>
            </div>
            <div className="h-[220px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A56DB" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1A56DB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={15}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 600 }} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(v) => `$${v.toLocaleString()}`} 
                    dx={-10}
                    allowDecimals={false}
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    contentStyle={{ 
                      background: "#1C1917", 
                      border: "none", 
                      borderRadius: "12px", 
                      fontSize: "12px", 
                      fontFamily: "Space Grotesk",
                      color: "#fff",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    }}
                    itemStyle={{ color: "#fff", fontWeight: "bold" }}
                    labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}
                    formatter={(v: number) => [`$${v}`, "Amount"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#1A56DB" 
                    strokeWidth={5} 
                    fill="url(#earningsGrad)" 
                    dot={{ r: 5, fill: "#fff", stroke: "#1A56DB", strokeWidth: 3 }} 
                    activeDot={{ r: 7, fill: "#1A56DB", stroke: "#fff", strokeWidth: 2 }} 
                    connectNulls={true}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white border border-[#EBEBEB] rounded-2xl p-5"
          >
            <h3 className="font-heading font-bold text-sm text-[#1C1917] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: Briefcase, label: userType === "freelancer" ? "Browse New Projects" : "Post a Project", color: "text-[#1A56DB]", bg: "bg-blue-50", page: userType === "freelancer" ? "browse" : "post" },
                { icon: MessageSquare, label: "Open Messages", color: "text-[#10B981]", bg: "bg-emerald-50", page: "messages" },
                { icon: User, label: "Edit Profile", color: "text-[#6366F1]", bg: "bg-indigo-50", page: "profile" },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => onNavigate?.(action.page)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FAF8F5] transition-colors group"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${action.bg}`}>
                    <action.icon className={`w-3.5 h-3.5 ${action.color}`} />
                  </div>
                  <span className="font-body text-xs text-[#1C1917] group-hover:text-[#1A56DB] transition-colors">{action.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#EBEBEB] group-hover:text-[#1A56DB] ml-auto transition-colors" />
                </button>
              ))}
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors group border border-dashed border-red-100 mt-2"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-50">
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                </div>
                <span className="font-body text-xs text-red-500 group-hover:text-red-700 transition-colors font-semibold">Logout Now</span>
                <ChevronRight className="w-3.5 h-3.5 text-red-200 group-hover:text-red-500 ml-auto transition-colors" />
              </button>
            </div>
          </motion.div>

          {/* Active Bids / Projects (Stretched bottom) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3 bg-white border border-[#EBEBEB] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-sm text-[#1C1917]">
                {userType === "freelancer" ? "Active Bids" : "Posted Projects"}
              </h3>
              <button className="text-xs font-heading font-semibold text-[#1A56DB] hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-16 bg-[#FAF8F5] rounded-xl animate-pulse" />
                ))
              ) : items.length > 0 ? (
                items.map((item) => {
                  const statusStyle = {
                    pending: "bg-[#FAF8F5] text-[#9CA3AF] border-[#EBEBEB]",
                    viewed: "bg-blue-50 text-[#1A56DB] border-blue-100",
                    shortlisted: "bg-amber-50 text-[#F59E0B] border-amber-100",
                    accepted: "bg-emerald-50 text-[#10B981] border-emerald-100",
                    rejected: "bg-red-50 text-red-500 border-red-100",
                  }[item.status as string] || "bg-[#FAF8F5] text-[#9CA3AF] border-[#EBEBEB]";

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-xl hover:bg-[#F5F3F0] transition-colors cursor-pointer"
                    >
                      <div className={`w-8 h-8 bg-[#1A56DB]/10 rounded-xl flex items-center justify-center flex-shrink-0 ${userType === "client" && isBlindMode ? "blur-md" : ""}`}>
                        <Briefcase className="w-4 h-4 text-[#1A56DB]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-heading font-semibold text-xs text-[#1C1917] truncate ${userType === "client" && isBlindMode ? "blur-sm select-none" : ""}`}>
                          {item.project}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`font-body text-[10px] text-[#9CA3AF] ${userType === "client" && isBlindMode ? "blur-[2px] select-none" : ""}`}>
                            {item.client}
                          </span>
                          <span className="text-[#EBEBEB]">·</span>
                          <span className="font-body text-[10px] text-[#9CA3AF]">{item.submitted}</span>
                          {item.stakedBadge && (
                            <span className="ml-2 px-1.5 py-0.5 bg-emerald-50 text-[#10B981] text-[8px] font-heading font-bold rounded flex items-center gap-0.5 border border-emerald-100 animate-pulse">
                              <ShieldCheck className="w-2 h-2" /> REP STAKED
                            </span>
                          )}
                          {item.poc && (
                            <span className="ml-2 px-1.5 py-0.5 bg-blue-50 text-[#1A56DB] text-[8px] font-heading font-bold rounded flex items-center gap-0.5">
                              <Target className="w-2 h-2" /> POC READY
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono-stats font-bold text-sm text-[#1A56DB]">{item.budget}</p>
                        <span className={`text-[9px] font-heading font-semibold px-2 py-0.5 rounded-full border capitalize ${statusStyle}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-[#9CA3AF]">No active items found.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
