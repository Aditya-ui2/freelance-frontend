import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Menu,
  ChevronDown,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  Briefcase,
  Home,
  Search,
  PlusCircle,
  HelpCircle,
  MessageSquare,
  Star,
  Shield,
  Layout,
  CreditCard,
  GraduationCap,
  Users,
  Radar,
  PieChart,
  FolderOpen,
  BarChart3,
  Zap
} from "lucide-react";

interface NavbarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  isLoggedIn?: boolean;
  userType?: "freelancer" | "client";
  user?: any;
  onLogout?: () => void;
}

const notifications: any[] = []; // Replaced by real-time backend data

import { notificationApi } from "../lib/api";

export default function Navbar({ currentPage = "home", onNavigate, isLoggedIn = false, userType = "freelancer", user, onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [bellWobble, setBellWobble] = useState(false);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const fetchNotifs = async () => {
    if (!isLoggedIn) return;
    try {
      const { data } = await notificationApi.getAll();
      setNotifs(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (unreadCount > 0) {
      setBellWobble(true);
      const timer = setTimeout(() => setBellWobble(false), 800);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  const markAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const dismissNotif = async (id: string) => {
    try {
      await notificationApi.dismiss(id);
      setNotifs(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { id: "home", label: isLoggedIn ? "Dashboard" : "Home", icon: Home },
    ...(isLoggedIn 
      ? [
          { id: "messages", label: "Chat", icon: MessageSquare },
          { 
            id: "tools", 
            label: userType === "freelancer" ? "Ecosystem" : "Command Center", 
            icon: userType === "freelancer" ? Zap : Shield,
            children: userType === "freelancer" ? [
              { id: "reputation-vault", label: "Rep-Vault", icon: Shield },
              { id: "portfolio-studio", label: "POC Studio", icon: Layout },
              { id: "freelancer-applications", label: "My Applications", icon: Briefcase },
              { id: "payments", label: "SafePay", icon: CreditCard },
              { id: "academy", label: "Academy", icon: GraduationCap },
              { id: "community", label: "Lounge", icon: Users },
            ] : [
              { id: "radar", label: "Talent Radar", icon: Radar },
              { id: "command", label: "Project Command", icon: Layout },
              { id: "finances", label: "Finance Hub", icon: PieChart },
              { id: "poc-library", label: "Review Applications", icon: FolderOpen },
              { id: "bench", label: "My Team", icon: Users },
              { id: "insights", label: "Insights", icon: BarChart3 },
            ]
          },
          { id: "browse", label: userType === "freelancer" ? "Browse Projects" : "Browse Talent", icon: Search },
        ]
      : [
          { id: "how", label: "How it Works", icon: HelpCircle }
        ]
    ),
  ];

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "bid": return <Briefcase className="w-4 h-4 text-[#1A56DB]" />;
      case "message": return <MessageSquare className="w-4 h-4 text-[#10B981]" />;
      case "review": return <Star className="w-4 h-4 text-[#F59E0B]" />;
      case "milestone": return <Zap className="w-4 h-4 text-[#6366F1]" />;
      case "system": return <Bell className="w-4 h-4 text-[#6B7280]" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#EBEBEB]" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <button
              onClick={() => onNavigate?.("home")}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1A56DB] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-heading font-bold text-sm">F</span>
              </div>
              <span className="font-heading font-bold text-xl text-[#1C1917] tracking-tight">
                Freelance<span className="text-[#1A56DB]">Up</span>
              </span>
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.id} className="relative group">
                  <button
                    onClick={() => !link.children && onNavigate?.(link.id)}
                    className={`relative px-4 py-2 font-body text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                      currentPage === link.id || 
                      (link.id === "home" && currentPage === "dashboard") ||
                      (link.children && link.children.some(c => currentPage === c.id))
                        ? "text-[#1A56DB] bg-blue-50"
                        : "text-[#6B7280] hover:text-[#1C1917] hover:bg-[#F5F3F0]"
                    }`}
                  >
                    {link.label}
                    {link.children && <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:rotate-180 transition-transform" />}
                  </button>

                  {/* Dropdown for specialized tools */}
                  {link.children && (
                    <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                      <div className="w-56 bg-white border border-[#EBEBEB] rounded-2xl shadow-xl p-2">
                        {link.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => onNavigate?.(child.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-heading font-bold transition-all ${
                              currentPage === child.id
                                ? "bg-blue-50 text-[#1A56DB]"
                                : "text-[#6B7280] hover:bg-[#FAF8F5] hover:text-[#1C1917]"
                            }`}
                          >
                            <child.icon className={`w-4 h-4 ${currentPage === child.id ? "text-[#1A56DB]" : "text-[#9CA3AF]"}`} />
                            {child.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => { setNotifOpen(!notifOpen); setUserDropOpen(false); }}
                      className={`relative p-2 rounded-lg hover:bg-[#F5F3F0] transition-colors ${bellWobble ? "animate-wobble" : ""}`}
                    >
                      <Bell className="w-5 h-5 text-[#6B7280]" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#1A56DB] text-white text-[10px] font-mono-stats font-bold rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {notifOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-[#EBEBEB] shadow-xl overflow-hidden"
                        >
                          <div className="p-4 border-b border-[#EBEBEB] flex items-center justify-between">
                            <h3 className="font-heading font-semibold text-sm text-[#1C1917]">Notifications</h3>
                            <button onClick={markAllRead} className="text-xs text-[#1A56DB] hover:underline font-body">
                              Mark all read
                            </button>
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {notifs.length === 0 ? (
                              <div className="p-12 text-center">
                                <Bell className="w-8 h-8 text-[#EBEBEB] mx-auto mb-3" />
                                <p className="text-xs font-body text-[#9CA3AF]">No notifications yet</p>
                              </div>
                            ) : (
                              notifs.map((n) => (
                                <div
                                  key={n.id}
                                  className={`flex items-start gap-3 p-3 hover:bg-[#FAF8F5] transition-colors border-b border-[#F5F3F0] last:border-0 ${!n.read ? "bg-blue-50/40" : ""}`}
                                >
                                  <div className="w-8 h-8 rounded-full bg-[#F5F3F0] flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {getNotifIcon(n.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-heading font-semibold text-[#1C1917]">{n.title}</p>
                                    <p className="text-xs text-[#6B7280] font-body mt-0.5 line-clamp-2">{n.description}</p>
                                    <span className="text-[10px] text-[#9CA3AF] font-mono-stats mt-1 block">
                                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <button onClick={() => dismissNotif(n.id)} className="text-[#9CA3AF] hover:text-[#6B7280] flex-shrink-0">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Avatar Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => { setUserDropOpen(!userDropOpen); setNotifOpen(false); }}
                      className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-[#F5F3F0] transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1A56DB] to-[#6366F1] flex items-center justify-center">
                        <span className="text-white text-xs font-heading font-bold">
                          {user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <span className="hidden lg:block text-sm font-body text-[#1C1917] font-medium">
                        {user?.name || "User"}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-[#6B7280] transition-transform ${userDropOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {userDropOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-[#EBEBEB] shadow-xl overflow-hidden"
                        >
                          {[
                            { icon: User, label: "Profile", page: "profile" },
                            { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
                          ].map((item) => (
                            <button
                              key={item.page}
                              onClick={() => { onNavigate?.(item.page); setUserDropOpen(false); }}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-body text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                            >
                              <item.icon className="w-4 h-4 text-[#6B7280]" />
                              {item.label}
                            </button>
                          ))}
                          <div className="border-t border-[#EBEBEB] mt-1">
                            <button
                              onClick={() => {
                                onLogout?.();
                                setUserDropOpen(false);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-body text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate?.("login")}
                    className="hidden sm:block px-4 py-2 text-sm font-body font-medium text-[#6B7280] hover:text-[#1C1917] transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onNavigate?.("signup")}
                    className="px-4 py-2 text-sm font-heading font-semibold text-white bg-[#1A56DB] rounded-xl hover:bg-[#1648C4] transition-all btn-press shadow-sm hover:shadow-md"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-[#F5F3F0] transition-colors"
              >
                <motion.div
                  animate={menuOpen ? "open" : "closed"}
                  className="w-5 h-5 flex flex-col justify-center gap-1 relative"
                >
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 7 },
                    }}
                    transition={{ duration: 0.25 }}
                    className="block h-0.5 w-5 bg-[#1C1917] rounded-full origin-center"
                  />
                  <motion.span
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 },
                    }}
                    transition={{ duration: 0.15 }}
                    className="block h-0.5 w-5 bg-[#1C1917] rounded-full"
                  />
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -7 },
                    }}
                    transition={{ duration: 0.25 }}
                    className="block h-0.5 w-5 bg-[#1C1917] rounded-full origin-center"
                  />
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-[#FAF8F5] z-50 lg:hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-heading font-bold text-xl text-[#1C1917]">
                    Freelance<span className="text-[#1A56DB]">Up</span>
                  </span>
                  <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-[#F5F3F0]">
                    <X className="w-5 h-5 text-[#1C1917]" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <div key={link.id}>
                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.1 }}
                        onClick={() => {
                          if (!link.children) {
                            onNavigate?.(link.id);
                            setMenuOpen(false);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-body text-sm font-medium transition-colors ${
                          currentPage === link.id || (link.children && link.children.some(c => currentPage === c.id))
                            ? "bg-blue-50 text-[#1A56DB]"
                            : "text-[#1C1917] hover:bg-[#F5F3F0]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <link.icon className="w-4 h-4" />
                          {link.label}
                        </div>
                        {link.children && <ChevronDown className="w-3.5 h-3.5 opacity-30" />}
                      </motion.button>

                      {link.children && (
                        <div className="ml-9 mt-1 mb-2 space-y-1">
                          {link.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => {
                                onNavigate?.(child.id);
                                setMenuOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-heading font-bold transition-all ${
                                currentPage === child.id ? "text-[#1A56DB] bg-blue-50/50" : "text-[#9CA3AF] hover:text-[#1C1917]"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <child.icon className="w-3.5 h-3.5" />
                                {child.label}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-[#EBEBEB] flex flex-col gap-3">
                  {isLoggedIn ? (
                    <button
                      onClick={() => { onLogout?.(); setMenuOpen(false); }}
                      className="w-full px-4 py-3 font-heading font-semibold text-sm text-red-500 border border-red-100 bg-red-50/50 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => { onNavigate?.("login"); setMenuOpen(false); }}
                        className="w-full px-4 py-3 font-heading font-semibold text-sm text-[#1C1917] border border-[#EBEBEB] rounded-xl hover:bg-[#F5F3F0] transition-colors"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => { onNavigate?.("signup"); setMenuOpen(false); }}
                        className="w-full px-4 py-3 font-heading font-semibold text-sm text-white bg-[#1A56DB] rounded-xl hover:bg-[#1648C4] transition-colors btn-press"
                      >
                        Get Started Free
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
