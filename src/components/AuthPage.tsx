import { useState } from "react";
import { authApi, userApi } from "../lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, CheckCircle, User, Briefcase } from "lucide-react";

interface AuthPageProps {
  mode: "login" | "signup";
  onNavigate?: (page: string) => void;
  onSuccess?: (userType: "freelancer" | "client") => void;
}

const onboardingSteps = {
  client: [
    { title: "Company Info", fields: ["companyName", "industry"] },
    { title: "Project Preferences", fields: ["projectTypes", "budget"] },
  ],
  freelancer: [
    { title: "Your Skills", fields: ["skills", "rate"] },
    { title: "Your Portfolio", fields: ["portfolio", "availability"] },
  ],
};

export default function AuthPage({ mode, onNavigate, onSuccess }: AuthPageProps) {
  const [currentMode, setCurrentMode] = useState(mode);
  const [step, setStep] = useState<"auth" | "userType" | "onboarding">("auth");
  const [userType, setUserType] = useState<"freelancer" | "client" | null>(null);
  const [onboardStep, setOnboardStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "",
    skills: "",
    rate: "",
    bio: "",
    portfolio: "",
    availability: "",
    companyName: "",
    industry: "",
    budget: ""
  });

  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMode === "login") {
      setLoading(true);
      try {
        const { data } = await authApi.login({
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("token", data.token);
        toast.success("Welcome back!");
        onSuccess?.(data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    } else {
      setStep("userType");
    }
  };

  const handleUserTypeSelect = async (type: "freelancer" | "client") => {
    setUserType(type);
    setLoading(true);
    try {
      const { data } = await authApi.register({
        name: form.name,
        email: form.email,
        password: form.password,
        userType: type,
      });
      localStorage.setItem("token", data.token);
      toast.success("Account created successfully!");
      setStep("onboarding");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardNext = async () => {
    const maxSteps = userType === "freelancer" ? 4 : 2;
    setLoading(true);
    try {
      // Save data to backend
      const profileData: any = {};
      if (userType === "freelancer") {
        if (onboardStep === 0) profileData.skills = form.skills;
        if (onboardStep === 1) profileData.rate = parseFloat(form.rate);
        if (onboardStep === 2) profileData.bio = form.bio;
        if (onboardStep === 3) profileData.availability = form.availability;
      } else {
        if (onboardStep === 0) {
          profileData.companyName = form.companyName;
          profileData.industry = form.industry;
        }
        if (onboardStep === 1) profileData.budget = form.budget;
      }

      if (Object.keys(profileData).length > 0) {
        await userApi.updateProfile(profileData);
      }

      if (onboardStep < maxSteps - 1) {
        setOnboardStep(onboardStep + 1);
      } else {
        handleOnboardComplete();
      }
    } catch (err: any) {
      toast.error("Failed to save progress");
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardComplete = () => {
    onSuccess?.(userType!);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <button
            onClick={() => onNavigate?.("home")}
            className="font-heading font-bold text-2xl text-[#1C1917]"
          >
            Freelance<span className="text-[#1A56DB]">Up</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Auth Form */}
          {step === "auth" && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-white border border-[#EBEBEB] rounded-3xl p-8 shadow-sm"
            >
              <h2 className="font-display font-black text-2xl text-[#1C1917] mb-1">
                {currentMode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="font-body text-sm text-[#6B7280] mb-6">
                {currentMode === "login"
                  ? "Sign in to continue to FreelanceUp"
                  : "Join thousands of freelancers and clients"}
              </p>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {currentMode === "signup" && (
                  <div>
                    <label className="block font-heading font-semibold text-xs text-[#1C1917] mb-1.5">Full Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jamie Smith"
                      required
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EBEBEB] rounded-xl font-body text-sm text-[#1C1917] placeholder-[#9CA3AF] outline-none focus:border-[#1A56DB] transition-colors"
                    />
                  </div>
                )}
                <div>
                  <label className="block font-heading font-semibold text-xs text-[#1C1917] mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EBEBEB] rounded-xl font-body text-sm text-[#1C1917] placeholder-[#9CA3AF] outline-none focus:border-[#1A56DB] transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-heading font-semibold text-xs text-[#1C1917] mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Min 8 characters"
                      required
                      className="w-full px-4 py-3 pr-11 bg-[#FAF8F5] border border-[#EBEBEB] rounded-xl font-body text-sm text-[#1C1917] placeholder-[#9CA3AF] outline-none focus:border-[#1A56DB] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {currentMode === "login" && (
                  <div className="text-right">
                    <button type="button" className="text-xs font-body text-[#1A56DB] hover:underline">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1A56DB] text-white rounded-xl font-heading font-semibold text-sm hover:bg-[#1648C4] transition-all btn-press shadow-md shadow-blue-100 flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {currentMode === "login" ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center font-body text-xs text-[#9CA3AF] mt-5">
                {currentMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => setCurrentMode(currentMode === "login" ? "signup" : "login")}
                  className="text-[#1A56DB] font-semibold hover:underline"
                >
                  {currentMode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </motion.div>
          )}

          {/* User Type Selection */}
          {step === "userType" && (
            <motion.div
              key="userType"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-white border border-[#EBEBEB] rounded-3xl p-8 shadow-sm"
            >
              <h2 className="font-display font-black text-2xl text-[#1C1917] mb-1">
                How will you use FreelanceUp?
              </h2>
              <p className="font-body text-sm text-[#6B7280] mb-6">
                Choose your role to personalize your experience
              </p>

              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    type: "freelancer" as const,
                    icon: User,
                    title: "I am a Freelancer",
                    desc: "Find projects, showcase your skills, and build your portfolio",
                    gradient: "from-[#1A56DB] to-[#6366F1]",
                  },
                  {
                    type: "client" as const,
                    icon: Briefcase,
                    title: "I Need Talent",
                    desc: "Post projects and hire skilled freelancers for your business",
                    gradient: "from-[#F59E0B] to-[#EF4444]",
                  },
                ].map((option) => (
                  <motion.button
                    key={option.type}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleUserTypeSelect(option.type)}
                    className="relative overflow-hidden p-5 border-2 border-[#EBEBEB] rounded-2xl text-left hover:border-[#1A56DB] transition-all group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    <div className="flex items-center gap-4 w-full">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-lg`}>
                        <option.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-base text-[#1C1917]">{option.title}</p>
                        <p className="font-body text-xs text-[#6B7280] mt-0.5">{option.desc}</p>
                      </div>
                      {loading && userType === option.type ? (
                        <div className="w-5 h-5 border-2 border-[#1A56DB]/30 border-t-[#1A56DB] rounded-full animate-spin ml-auto" />
                      ) : (
                        <ArrowRight className="w-5 h-5 text-[#EBEBEB] group-hover:text-[#1A56DB] ml-auto transition-colors" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Onboarding */}
          {step === "onboarding" && userType && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-white border border-[#EBEBEB] rounded-3xl p-8 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#1A56DB] flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">{onboardStep + 1}</span>
                </div>
                <span className="font-body text-xs text-[#9CA3AF]">
                  Step {onboardStep + 1} of {userType === "freelancer" ? 4 : 2}
                </span>
              </div>

              <h2 className="font-display font-black text-2xl text-[#1C1917] mb-1">
                {userType === "freelancer"
                  ? ["Add Your Skills", "Set Your Rate", "Upload Portfolio", "Set Availability"][onboardStep]
                  : ["Company Details", "Budget Preferences"][onboardStep]}
              </h2>
              <p className="font-body text-sm text-[#6B7280] mb-6">
                {userType === "freelancer"
                  ? "Build a profile that helps clients find you"
                  : "Tell us what you're looking for"}
              </p>

              {/* Step content placeholder */}
              <div className="bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl p-6 mb-5 min-h-24">
                {userType === "freelancer" ? (
                  <div className="space-y-4">
                    {onboardStep === 0 && (
                      <div>
                        <label className="block font-heading font-semibold text-xs text-[#1C1917] mb-1.5">Your Skills</label>
                        <textarea
                          value={form.skills}
                          onChange={(e) => setForm({ ...form, skills: e.target.value })}
                          placeholder="React, Figma, Node.js, TypeScript..."
                          className="w-full px-4 py-3 bg-white border border-[#EBEBEB] rounded-xl font-body text-sm text-[#1C1917] placeholder-[#9CA3AF] outline-none focus:border-[#1A56DB] transition-colors min-h-[100px] resize-none"
                        />
                      </div>
                    )}
                    {onboardStep === 1 && (
                      <div>
                        <label className="block font-heading font-semibold text-xs text-[#1C1917] mb-1.5">Hourly Rate ($)</label>
                        <input
                          type="number"
                          value={form.rate}
                          onChange={(e) => setForm({ ...form, rate: e.target.value })}
                          placeholder="e.g. 50"
                          className="w-full px-4 py-3 bg-white border border-[#EBEBEB] rounded-xl font-body text-sm text-[#1C1917] placeholder-[#9CA3AF] outline-none focus:border-[#1A56DB] transition-colors"
                        />
                      </div>
                    )}
                    {onboardStep === 2 && (
                      <div>
                        <label className="block font-heading font-semibold text-xs text-[#1C1917] mb-1.5">Your Bio</label>
                        <textarea
                          value={form.bio}
                          onChange={(e) => setForm({ ...form, bio: e.target.value })}
                          placeholder="Tell us about yourself and your experience..."
                          className="w-full px-4 py-3 bg-white border border-[#EBEBEB] rounded-xl font-body text-sm text-[#1C1917] placeholder-[#9CA3AF] outline-none focus:border-[#1A56DB] transition-colors min-h-[100px] resize-none"
                        />
                      </div>
                    )}
                    {onboardStep === 3 && (
                      <div>
                        <label className="block font-heading font-semibold text-xs text-[#1C1917] mb-1.5">Availability</label>
                        <select
                          value={form.availability}
                          onChange={(e) => setForm({ ...form, availability: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-[#EBEBEB] rounded-xl font-body text-sm text-[#1C1917] outline-none focus:border-[#1A56DB] transition-colors"
                        >
                          <option value="">Select availability</option>
                          <option value="Full-time">Full-time (40+ hrs/week)</option>
                          <option value="Part-time">Part-time (20 hrs/week)</option>
                          <option value="Contract">Project-based / Contract</option>
                        </select>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {onboardStep === 0 && (
                      <>
                        <div>
                          <label className="block font-heading font-semibold text-xs text-[#1C1917] mb-1.5">Company Name</label>
                          <input
                            value={form.companyName}
                            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                            placeholder="Acme Inc."
                            className="w-full px-4 py-3 bg-white border border-[#EBEBEB] rounded-xl font-body text-sm text-[#1C1917] placeholder-[#9CA3AF] outline-none focus:border-[#1A56DB] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block font-heading font-semibold text-xs text-[#1C1917] mb-1.5">Industry</label>
                          <input
                            value={form.industry}
                            onChange={(e) => setForm({ ...form, industry: e.target.value })}
                            placeholder="Technology, Finance, etc."
                            className="w-full px-4 py-3 bg-white border border-[#EBEBEB] rounded-xl font-body text-sm text-[#1C1917] placeholder-[#9CA3AF] outline-none focus:border-[#1A56DB] transition-colors"
                          />
                        </div>
                      </>
                    )}
                    {onboardStep === 1 && (
                      <div>
                        <label className="block font-heading font-semibold text-xs text-[#1C1917] mb-1.5">Typical Project Budget ($)</label>
                        <input
                          type="text"
                          value={form.budget}
                          onChange={(e) => setForm({ ...form, budget: e.target.value })}
                          placeholder="e.g. $1,000 - $5,000"
                          className="w-full px-4 py-3 bg-white border border-[#EBEBEB] rounded-xl font-body text-sm text-[#1C1917] placeholder-[#9CA3AF] outline-none focus:border-[#1A56DB] transition-colors"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {onboardStep > 0 && (
                  <button
                    onClick={() => setOnboardStep(onboardStep - 1)}
                    className="flex-1 py-2.5 border border-[#EBEBEB] rounded-xl font-heading font-semibold text-sm text-[#6B7280] hover:bg-[#FAF8F5] transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleOnboardNext}
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#1A56DB] text-white rounded-xl font-heading font-semibold text-sm hover:bg-[#1648C4] transition-all btn-press flex items-center justify-center gap-2 shadow-md shadow-blue-100 disabled:opacity-50"
                >
                  {onboardStep === (userType === "freelancer" ? 3 : 1) ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Complete Setup
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={handleOnboardComplete}
                className="w-full text-center text-xs font-body text-[#9CA3AF] hover:text-[#6B7280] mt-3"
              >
                Skip for now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
