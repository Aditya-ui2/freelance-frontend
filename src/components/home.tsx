import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import SearchFilter from "./SearchFilter";
import FreelancerGrid from "./FreelancerGrid";
import FreelancerProfile from "./FreelancerProfile";
import ProjectPosting from "./ProjectPosting";
import ProjectGrid from "./ProjectGrid";
import SkillCenter from "./SkillCenter";
import SimpleProcess from "./SimpleProcess";
import MessagingSystem from "./MessagingSystem";
import Dashboard from "./Dashboard";
import AuthPage from "./AuthPage";
import LandingContent from "./LandingContent";
import { Freelancer } from "./FreelancerGrid";
import { authApi, userApi } from "../lib/api";
import ReputationVault from "./ReputationVault";
import PortfolioStudio from "./PortfolioStudio";
import Academy from "./Academy";
import PaymentsDashboard from "./PaymentsDashboard";
import CommunityFeed from "./CommunityFeed";
import TalentRadar from "./TalentRadar";
import ProjectCommand from "./ProjectCommand";
import FinanceHub from "./FinanceHub";
import POCLibrary from "./POCLibrary";
import TalentBench from "./TalentBench";
import HiredTalent from "./HiredTalent";
import MyApplications from "./MyApplications";
import ClientInsights from "./ClientInsights";

type Page = "home" | "browse" | "post" | "how" | "login" | "signup" | "dashboard" | "profile" | "messages" | "settings" | "reputation-vault" | "portfolio-studio" | "academy" | "payments" | "community" | "radar" | "command" | "finances" | "poc-library" | "bench" | "insights" | "freelancer-applications";
type UserType = "freelancer" | "client";

interface HomeProps {
  initialPage?: Page;
}

function Home({ initialPage = "home" }: HomeProps) {
  const routerNavigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<Page>(initialPage);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType>("freelancer");
  const [user, setUser] = useState<any>(null);
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [showProjectPosting, setShowProjectPosting] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activePOCProjectId, setActivePOCProjectId] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});

  const handleNavigate = (page: string) => {
    if (page === "post") {
      if (!isLoggedIn) {
        setAuthMode("signup");
        setCurrentPage("signup");
        routerNavigate("/signup");
      } else {
        setShowProjectPosting(true);
      }
      return;
    }
    if (page === "messages") {
      setCurrentPage("messages");
      setShowMessages(false);
      return;
    }
    if (page === "poc-library") {
      setActivePOCProjectId(null); // Reset when navigating directly
    }
    if (page === "login") {
      setAuthMode("login");
      setCurrentPage("login");
      routerNavigate("/auth");
      return;
    }
    if (page === "signup") {
      setAuthMode("signup");
      setCurrentPage("signup");
      routerNavigate("/signup");
      return;
    }
    if (page === "home") {
      if (isLoggedIn) {
        setCurrentPage("dashboard");
        routerNavigate("/dashboard");
        return;
      }
      routerNavigate("/");
    } else if (page === "dashboard") {
      routerNavigate("/dashboard");
    } else if (page === "browse") {
      routerNavigate("/browse");
    } else if (page === "how") {
      routerNavigate("/skill-center");
    } else if (["reputation-vault", "portfolio-studio", "academy", "payments", "community", "radar", "command", "finances", "poc-library", "bench", "insights"].includes(page)) {
      routerNavigate(`/${page}`);
    }
    setCurrentPage(page as Page);
  };

  const handleAuthSuccess = (userData: any) => {
    setIsLoggedIn(true);
    setUserType(userData.userType || userData.user?.userType);
    setUser(userData.user || userData);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCurrentPage("home");
    toast.success("Successfully logged out");
  };

  useEffect(() => {
    if (initialPage) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { data } = await authApi.getMe();
        setUser(data);
      } catch (err) {
        console.error("Failed to refresh user", err);
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await authApi.getMe();
          setIsLoggedIn(true);
          setUserType(data.userType);
          setUser(data);
          // Auto-redirect if on home or auth pages
          if (["home", "login", "signup"].includes(currentPage)) {
            setCurrentPage("dashboard");
            routerNavigate("/dashboard");
          }
        } catch (err) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    };
    checkAuth();
  }, [currentPage]); // Re-check if navigation happens to ensure redirects stay active

  // Auto-Refresh: Keep user profile data synced every 20 seconds
  useEffect(() => {
    let interval: any;
    if (isLoggedIn) {
      interval = setInterval(async () => {
        try {
          const { data } = await authApi.getMe();
          setUser(data);
        } catch (err) {
          console.error("Sync error:", err);
        }
      }, 20000); // 20 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (selectedFreelancer) {
      userApi.viewProfile(selectedFreelancer.id.toString()).catch(err => {
        console.error("Failed to track profile view:", err);
      });
    }
  }, [selectedFreelancer]);

  const isAuthPage = currentPage === "login" || currentPage === "signup";
  const isDashboard = currentPage === "dashboard";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF8F5" }}>
      {/* Modals */}
      <AnimatePresence>
        {selectedFreelancer && (
          <FreelancerProfile
            freelancer={selectedFreelancer}
            onClose={() => setSelectedFreelancer(null)}
            onHire={() => { setSelectedFreelancer(null); handleNavigate("messages"); }}
            onMessage={() => { setSelectedFreelancer(null); handleNavigate("messages"); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProjectPosting && (
          <ProjectPosting
            onClose={() => setShowProjectPosting(false)}
            onSuccess={() => { setShowProjectPosting(false); setCurrentPage("dashboard"); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMessages && (
          <MessagingSystem 
            onClose={() => setShowMessages(false)} 
            user={user}
            initialConversationId={activeConversationId}
          />
        )}
      </AnimatePresence>

      {/* Auth Pages */}
      {isAuthPage && (
        <AuthPage
          mode={authMode}
          onNavigate={handleNavigate}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Main App */}
      {!isAuthPage && (
        <>
          <Navbar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            isLoggedIn={isLoggedIn}
            userType={userType}
            user={user}
            onLogout={handleLogout}
          />

          {/* Dashboard */}
          {isDashboard && (
            <Dashboard
              userType={userType}
              user={user}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          )}

          {/* Home / Landing - Only show if not logged in */}
          {currentPage === "home" && !isLoggedIn && (
            <main>
              <HeroSection onNavigate={handleNavigate} />
              <LandingContent onNavigate={handleNavigate} />
            </main>
          )}

          {/* Browse Page */}
          {currentPage === "browse" && (
            <main className="pt-20">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="mb-8">
                  <p className="font-heading font-semibold text-sm text-[#1A56DB] uppercase tracking-wider mb-2">
                    {userType === "freelancer" ? "Marketplace" : "Discover"}
                  </p>
                  <h1 className="font-display font-black text-4xl lg:text-5xl text-[#1C1917]" style={{ letterSpacing: "-0.02em" }}>
                    {userType === "freelancer" ? "Browse Projects" : "Browse Talent"}
                  </h1>
                  <p className="font-body text-base text-[#6B7280] mt-2">
                    {userType === "freelancer" 
                      ? "Find high-quality projects that match your unique skills"
                      : "Find emerging freelancers ready to deliver exceptional work"}
                  </p>
                </div>
                <SearchFilter onChange={setFilters} />
                {userType === "freelancer" ? (
                  <ProjectGrid user={user} filters={filters} />
                ) : (
                  <FreelancerGrid onViewProfile={setSelectedFreelancer} filters={filters} />
                )}
              </div>
            </main>
          )}

          {/* How it Works */}
          {currentPage === "how" && (
            <main className="pt-20">
              <SimpleProcess onNavigate={handleNavigate} />
            </main>
          )}

          {/* Messages (Full Page) */}
          {currentPage === "messages" && (
            <main className="pt-20">
              <MessagingSystem 
                isEmbedded={true} 
                user={user}
                initialConversationId={activeConversationId}
              />
            </main>
          )}

          {/* Post Project */}
          {currentPage === "post" && (
            <main className="pt-20 min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="font-display font-black text-3xl text-[#1C1917] mb-4">Post a Project</h1>
                <button
                  onClick={() => setShowProjectPosting(true)}
                  className="px-6 py-3 bg-[#1A56DB] text-white rounded-xl font-heading font-semibold hover:bg-[#1648C4] transition-all btn-press"
                >
                  Start Posting
                </button>
              </div>
            </main>
          )}

          {/* Reputation Vault */}
          {currentPage === "reputation-vault" && (
            <main className="pt-20">
              <ReputationVault user={user} onRefresh={refreshUser} />
            </main>
          )}

          {/* Portfolio Studio */}
          {currentPage === "portfolio-studio" && (
            <main className="pt-20">
              <PortfolioStudio user={user} onRefresh={refreshUser} onNavigate={handleNavigate} />
            </main>
          )}

          {/* Academy */}
          {currentPage === "academy" && (
            <main className="pt-20">
              <Academy user={user} onRefresh={refreshUser} />
            </main>
          )}

          {/* Freelancer Applications */}
          {currentPage === "freelancer-applications" && (
            <main className="pt-20">
              <MyApplications 
                onStartChat={(id) => {
                  setActiveConversationId(id);
                  handleNavigate("messages");
                }}
              />
            </main>
          )}

          {/* Payments Dashboard */}
          {currentPage === "payments" && (
            <main className="pt-20">
              <PaymentsDashboard user={user} onLogout={handleLogout} />
            </main>
          )}

          {/* Community Lounge */}
          {currentPage === "community" && (
            <main className="pt-20">
              <CommunityFeed user={user} />
            </main>
          )}

          {/* Client Specific Pages */}
          {currentPage === "radar" && (
            <main className="pt-20">
              <TalentRadar 
                onStartChat={(id) => {
                  setActiveConversationId(id);
                  handleNavigate("messages");
                }}
              />
            </main>
          )}

          {currentPage === "command" && (
            <main className="pt-20">
              <ProjectCommand 
                onNewProject={() => setShowProjectPosting(true)} 
                onViewApplications={(projectId) => {
                  setActivePOCProjectId(projectId);
                  setCurrentPage("poc-library");
                }}
                onStartChat={(id) => {
                  setActiveConversationId(id);
                  handleNavigate("messages");
                }}
              />
            </main>
          )}

          {currentPage === "finances" && (
            <main className="pt-20">
              <FinanceHub />
            </main>
          )}

          {currentPage === "poc-library" && (
            <main className="pt-20">
              <POCLibrary 
                onNavigate={handleNavigate} 
                filterProjectId={activePOCProjectId}
                onClearFilter={() => setActivePOCProjectId(null)}
                onStartChat={(id) => {
                  setActiveConversationId(id);
                  handleNavigate("messages");
                }}
              />
            </main>
          )}

          {currentPage === "insights" && (
            <main className="pt-20">
              <ClientInsights />
            </main>
          )}

          {/* User Profile Page */}
          {currentPage === "profile" && user && (
            <main className="pt-20">
              <FreelancerProfile 
                isEmbedded={true}
                onNavigate={handleNavigate}
                onUpdateUser={setUser}
                freelancer={{
                  id: user.id,
                  name: user.name,
                  title: user.title,
                  avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=1A56DB&color=fff`,
                  location: user.location || "Location Not Set",
                  rate: user.rate ? `$${user.rate}` : null,
                  trustScore: user.trustScore || 0,
                  pocScore: user.pocScore || 0.0,
                  skills: user.skills || [],
                  isNew: false,
                  isRising: user.isRising || false,
                  availability: user.availability || "Available",
                  completedJobs: user.projectsCompleted || 0,
                  bio: user.bio,
                  portfolio: user.portfolio || [],
                  pocs: user.pocs || []
                }}
              />
            </main>
          )}

          {currentPage === "bench" && (
            <main className="pt-20">
              <HiredTalent 
                onStartChat={(id) => {
                  setActiveConversationId(id);
                  handleNavigate("messages");
                }}
              />
            </main>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
