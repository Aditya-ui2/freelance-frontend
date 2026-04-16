import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, CheckCircle2, ChevronRight, Code, Palette, Globe, Zap, Timer, Trophy } from "lucide-react";
import { toast } from "sonner";

const skillsToAssess = [
  { id: "react", name: "React Development", icon: Code, level: "Advanced", questions: 15, duration: "20 min", color: "bg-blue-50 text-blue-600" },
  { id: "ui", name: "UI/UX Design", icon: Palette, level: "Intermediate", questions: 12, duration: "15 min", color: "bg-purple-50 text-purple-600" },
  { id: "node", name: "Node.js Backend", icon: Globe, level: "Advanced", questions: 18, duration: "25 min", color: "bg-emerald-50 text-emerald-600" },
  { id: "ts", name: "TypeScript", icon: Zap, level: "Intermediate", questions: 10, duration: "12 min", color: "bg-indigo-50 text-indigo-600" },
];

export default function SkillCenter() {
  const [activeTest, setActiveTest] = useState<any>(null);
  const [testComplete, setTestComplete] = useState(false);

  const startTest = (skill: any) => {
    setActiveTest(skill);
    toast.message(`Starting ${skill.name} Assessment`, {
      description: "Good luck! Focus and prove your expertise.",
    });
  };

  const finishTest = () => {
    setTestComplete(true);
    toast.success("Assessment Complete!", {
      description: "You've earned the 'Verified React' badge!",
    });
    setTimeout(() => {
      setActiveTest(null);
      setTestComplete(false);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="font-heading font-semibold text-sm text-[#1A56DB] uppercase tracking-wider mb-2">Prove Your Worth</p>
        <h1 className="font-display font-black text-4xl lg:text-5xl text-[#1C1917]" style={{ letterSpacing: "-0.02em" }}>
          Skill Validation<span className="text-[#1A56DB]"> Center</span>
        </h1>
        <p className="font-body text-base text-[#6B7280] mt-4 max-w-2xl">
          Don't have 10+ reviews yet? No problem. Complete our industry-standard assessments and get **Verified Badges** that show clients you have the skills to deliver.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillsToAssess.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-[#EBEBEB] rounded-3xl p-6 hover:shadow-xl transition-all group overflow-hidden relative"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${skill.color}`}>
              <skill.icon className="w-6 h-6" />
            </div>
            
            <h3 className="font-heading font-bold text-lg text-[#1C1917] mb-1">{skill.name}</h3>
            <p className="font-body text-xs text-[#9CA3AF] mb-6">Level: {skill.level}</p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-[10px] font-heading font-semibold text-[#6B7280]">
                <Timer className="w-3 h-3" /> {skill.duration}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-heading font-semibold text-[#6B7280]">
                <Award className="w-3 h-3" /> {skill.questions} Questions
              </div>
            </div>

            <button
              onClick={() => startTest(skill)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#FAF8F5] border border-[#EBEBEB] rounded-xl font-heading font-bold text-sm text-[#1C1917] hover:bg-[#1A56DB] hover:text-white hover:border-transparent transition-all btn-press"
            >
              Start Assessment
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Mock Test Modal */}
      <AnimatePresence>
        {activeTest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden p-12 text-center"
            >
              {!testComplete ? (
                <>
                  <div className="w-20 h-20 bg-blue-50 text-[#1A56DB] rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <Trophy className="w-10 h-10" />
                  </div>
                  <h2 className="font-display font-black text-3xl text-[#1C1917] mb-4">
                    {activeTest.name} Test
                  </h2>
                  <p className="font-body text-[#6B7280] mb-10">
                    This is a simulated workspace. In the real version, you'd solve problems directly in the browser.
                  </p>
                  <button
                    onClick={finishTest}
                    className="px-12 py-4 bg-[#1A56DB] text-white rounded-2xl font-heading font-black text-lg hover:bg-[#1648C4] transition-all btn-press"
                  >
                    Finish & Get Badge
                  </button>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="space-y-6"
                >
                  <div className="w-24 h-24 bg-emerald-100 text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h2 className="font-display font-black text-4xl text-[#1C1917]">Verified!</h2>
                  <p className="font-body text-xl text-[#6B7280]">
                    Congratulations! You've earned the <strong>Verified {activeTest.name}</strong> badge.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
