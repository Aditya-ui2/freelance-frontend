import { motion } from "framer-motion";
import { ArrowRight, Play, Star, Quote, Linkedin, ShieldCheck, Zap } from "lucide-react";

const spotlightFreelancers = [
  {
    id: 1,
    name: "Alex Chen",
    title: "UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&q=80",
    skills: ["Figma", "Prototyping"],
    trustScore: 98,
    highlight: "Redesigned a SaaS dashboard in 5 days",
  },
  {
    id: 2,
    name: "Maya Patel",
    title: "React Developer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&q=80",
    skills: ["React", "TypeScript"],
    trustScore: 95,
    highlight: "Built a full-stack app in 2 weeks",
  },
  {
    id: 3,
    name: "James Rivera",
    title: "Brand Strategist",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&q=80",
    skills: ["Branding", "Strategy"],
    trustScore: 100,
    highlight: "Created a brand identity from scratch",
  },
  {
    id: 4,
    name: "Priya Sharma",
    title: "Data Analyst",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&q=80",
    skills: ["Python", "Tableau"],
    trustScore: 97,
    highlight: "Automated reports saving 10hrs/week",
  },
];

const testimonials = [
  {
    text: "I was skeptical about hiring someone new to the platform but Alex delivered work that rivaled agencies charging 5x more.",
    author: "Tom Bradley",
    role: "CTO, TechStart Inc.",
    avatar: "T",
    rating: 5,
  },
  {
    text: "FreelanceUp's 'New Talent' filter helped me find a brilliant developer who was underpriced and overdelivered. Game changer.",
    author: "Sarah Kim",
    role: "Founder, Bloom Studio",
    avatar: "S",
    rating: 5,
  },
  {
    text: "The quality of new freelancers here surprised me. Maya built our entire dashboard in record time.",
    author: "David Chen",
    role: "Product Manager, Retail Co.",
    avatar: "D",
    rating: 5,
  },
];

const howItWorks = [
  { step: "01", title: "Create Your Profile", desc: "Sign up in minutes. Add your skills, set your rate, and showcase your best work.", icon: "👤" },
  { step: "02", title: "Browse & Apply", desc: "Explore hundreds of projects. Filter by budget, category, and deadline. Submit targeted proposals.", icon: "🔍" },
  { step: "03", title: "Get Hired & Earn", desc: "Win projects, deliver great work, collect reviews, and build your reputation fast.", icon: "💰" },
];

export default function LandingContent({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <>
      {/* How It Works */}
      <section className="py-20 px-6 lg:px-8 bg-white border-t border-b border-[#EBEBEB]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="font-heading font-semibold text-sm text-[#1A56DB] uppercase tracking-wider mb-2">Simple Process</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-[#1C1917]" style={{ letterSpacing: "-0.02em" }}>
              From Zero to<br />First Client
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative p-6 bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl"
              >
                <div className="font-mono-stats font-black text-6xl text-[#EBEBEB] absolute top-4 right-4 leading-none select-none">
                  {item.step}
                </div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-heading font-bold text-base text-[#1C1917] mb-2">{item.title}</h3>
                <p className="font-body text-sm text-[#6B7280] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Talent Spotlight */}
      <section className="py-20 px-6 lg:px-8" style={{ backgroundColor: "#FAF8F5" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <p className="font-heading font-semibold text-sm text-[#F59E0B] uppercase tracking-wider mb-2">⭐ Spotlight</p>
              <h2 className="font-display font-black text-4xl lg:text-5xl text-[#1C1917]" style={{ letterSpacing: "-0.02em" }}>
                New Talent<br />Rising Fast
              </h2>
            </div>
            <button 
              onClick={() => onNavigate?.("login")}
              className="hidden md:flex items-center gap-2 text-sm font-heading font-semibold text-[#1A56DB] hover:underline"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none" style={{ scrollSnapType: "x mandatory" }}>
            {spotlightFreelancers.map((fl, i) => (
              <motion.div
                key={fl.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex-shrink-0 w-64 bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden card-hover cursor-pointer"
                style={{ scrollSnapAlign: "start" }}
                onClick={() => onNavigate?.("login")}
              >
                {/* Thumbnail */}
                <div className="relative h-36 overflow-hidden">
                  <img src={fl.thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-[#1A56DB] ml-0.5" />
                    </div>
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span className="badge-rising-star text-[10px] font-heading font-bold px-2 py-0.5 rounded-full">
                      ⚡ Rising
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={fl.avatar} alt={fl.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <p className="font-heading font-bold text-xs text-[#1C1917]">{fl.name}</p>
                      <p className="font-body text-[10px] text-[#9CA3AF]">{fl.title}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span className="font-mono-stats font-bold text-[10px] text-emerald-600">{fl.trustScore}</span>
                    </div>
                  </div>

                  <p className="font-body text-xs text-[#6B7280] leading-relaxed italic">"{fl.highlight}"</p>

                  <div className="flex gap-1 mt-2">
                    {fl.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-[#FAF8F5] border border-[#EBEBEB] text-[9px] font-heading font-semibold text-[#6B7280] rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 lg:px-8 bg-white border-t border-[#EBEBEB]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="font-heading font-semibold text-sm text-[#10B981] uppercase tracking-wider mb-2">Success Stories</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-[#1C1917]" style={{ letterSpacing: "-0.02em" }}>
              Clients Love<br />New Talent
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="p-6 bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl relative"
              >
                <Quote className="w-6 h-6 text-[#1A56DB]/20 absolute top-4 right-4" />
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                  ))}
                </div>
                <p className="font-body text-sm text-[#1C1917] leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1A56DB] to-[#6366F1] flex items-center justify-center">
                    <span className="text-white text-xs font-heading font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-xs text-[#1C1917]">{t.author}</p>
                    <p className="font-body text-[10px] text-[#9CA3AF]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Founders */}
      <section className="py-24 px-6 lg:px-8 bg-white overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl opacity-60" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-heading font-semibold text-sm text-[#1A56DB] uppercase tracking-wider mb-2">The Visionaries</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-[#1C1917]" style={{ letterSpacing: "-0.02em" }}>
              Meet Our<br />Founding Team
            </h2>
            <p className="font-body text-base text-[#6B7280] mt-4 max-w-2xl mx-auto">
              Behind the platform is a team committed to empowering the next generation of global talent.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              {
                name: "Aditya Pratap Singh Rathore",
                role: "Founder",
                image: "/founders/aditya.jpg",
                delay: 0.1,
                bio: "Strategic visionary leading the platform's core mission to democratize freelance opportunities.",
                imageStyle: { scale: "1.4", objectPosition: "top" }
              },
              {
                name: "Harshwardhan Singh",
                role: "CEO",
                image: "/founders/harshwardhan.jpg",
                delay: 0.2,
                bio: "Driving operational excellence and executing the long-term growth strategy for the global marketplace.",
                imageStyle: { scale: "1.2" }
              },
              {
                name: "Abhishek Rao",
                role: "Co-Founder",
                image: "/founders/abhishek.jpg",
                delay: 0.3,
                bio: "Championing user-centric product evolution and building a community of top-tier talent."
              },
              {
                name: "Ankit Kumar",
                role: "CTO",
                image: "/founders/ankit.jpg",
                delay: 0.4,
                bio: "Architecting the scalable technical foundations and AI-driven matching algorithms."
              }
            ].map((founder, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: founder.delay, duration: 0.5 }}
                className="text-center group"
              >
                <div className="relative mb-6 inline-block">
                  {/* Photo Frame */}
                  <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-blue-100/50 group-hover:shadow-blue-200/50 transition-all duration-300 relative z-10">
                    <img 
                      src={founder.image} 
                      alt={founder.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={founder.imageStyle}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${founder.name}`;
                      }}
                    />
                  </div>
                  {/* Decorative Circle */}
                  <div className="absolute inset-0 rounded-full bg-[#1A56DB] opacity-0 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300 -z-0" />
                  
                  {/* Social Link Overlay */}
                  <div className="absolute bottom-0 right-0 z-20 transform translate-x-1/4 translate-y-1/4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-[#1A56DB] p-2 rounded-full text-white shadow-lg">
                      <Linkedin className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                
                <div className="px-4 flex flex-col items-center flex-grow">
                  <h3 className="font-heading font-black text-lg text-[#1C1917] group-hover:text-[#1A56DB] transition-colors">
                    {founder.name}
                  </h3>
                  <p className="font-body text-[10px] font-semibold text-[#1A56DB] uppercase tracking-wider mt-1 mb-3">
                    {founder.role}
                  </p>
                  <p className="font-body text-xs text-[#6B7280] leading-relaxed">
                    {founder.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: "#FAF8F5" }}>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#1A56DB] to-[#6366F1] rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%)"
              }}
            />
            <p className="font-heading font-semibold text-blue-200 text-sm uppercase tracking-wider mb-3">Get Started Today</p>
            <h2 className="font-display font-black text-4xl text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
              Your First Client is Waiting
            </h2>
            <p className="font-body text-blue-100 text-base mb-8 max-w-md mx-auto">
              Join 12,000+ freelancers who found their first client on FreelanceUp. No experience required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onNavigate?.("login")}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#1A56DB] rounded-2xl font-heading font-bold text-sm hover:bg-blue-50 transition-all btn-press shadow-xl"
              >
                Start Freelancing Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate?.("login")}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 border border-white/30 text-white rounded-2xl font-heading font-semibold text-sm hover:bg-white/20 transition-all"
              >
                Browse Talent
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-[#EBEBEB] bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="font-heading font-bold text-lg text-[#1C1917] mb-3">
                Freelance<span className="text-[#1A56DB]">Up</span>
              </div>
              <p className="font-body text-xs text-[#9CA3AF] leading-relaxed">
                Democratizing opportunity for emerging freelancers worldwide.
              </p>
            </div>
            {[
              { title: "Platform", links: ["Browse Talent", "Post a Project", "How It Works", "Pricing"] },
              { title: "For Freelancers", links: ["Create Profile", "Find Work", "Earn Badges", "Resources"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Support"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-heading font-bold text-xs text-[#1C1917] uppercase tracking-wider mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="font-body text-xs text-[#9CA3AF] hover:text-[#1C1917] transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-[#EBEBEB] flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-body text-[10px] text-[#9CA3AF]">© 2024 FreelanceUp. All rights reserved.</p>
            <div className="flex gap-4">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
                <a key={link} href="#" className="font-body text-[10px] text-[#9CA3AF] hover:text-[#6B7280]">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
