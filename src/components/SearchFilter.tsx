import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, X, SlidersHorizontal } from "lucide-react";

const categories = ["All Categories", "Design", "Development", "Writing", "Marketing", "Video", "Photography", "Finance", "Music"];

const filterChips = [
  { id: "budget", label: "Budget Range", options: ["Any Budget", "< $50/hr", "$50-100/hr", "$100+/hr"] },
  { id: "availability", label: "Availability", options: ["Any", "Full-time", "Part-time", "Weekends"] },
  { id: "trust", label: "Reputation", options: ["Any Reputation", "90+ Trust Score", "80+ Trust Score", "New Talent"] },
  { id: "experience", label: "Experience", options: ["Any Level", "New Talent", "1-2 Years", "3-5 Years"] },
];

const skillSuggestions = [
  "React", "Node.js", "Python", "Figma", "UI/UX Design",
  "Copywriting", "SEO", "Video Editing", "WordPress", "Data Analysis",
];

export default function SearchFilter({ onSearch, onChange }: { onSearch?: (query: string) => void, onChange?: (filters: any) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [catOpen, setCatOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newTalentOnly, setNewTalentOnly] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = skillSuggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase()) && query.length > 0
  );

  const activeCount = Object.keys(activeFilters).length + (newTalentOnly ? 1 : 0);

  useEffect(() => {
    const filters: any = {
      category: category === "All Categories" ? undefined : category,
      search: query || undefined,
      newTalent: newTalentOnly || undefined
    };

    if (activeFilters.budget) {
      if (activeFilters.budget === "< $50/hr") {
        filters.maxBudget = 50;
      } else if (activeFilters.budget === "$50-100/hr") {
        filters.minBudget = 50;
        filters.maxBudget = 100;
      } else if (activeFilters.budget === "$100+/hr") {
        filters.minBudget = 100;
      }
    }

    onChange?.(filters);
  }, [category, query, activeFilters, newTalentOnly]);

  useEffect(() => {
    const handleClickOutside = () => {
      setCatOpen(false);
      setOpenFilter(null);
      setShowSuggestions(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <section className="py-8 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Search Bar */}
          <div className="flex items-stretch gap-2 bg-white border border-[#EBEBEB] rounded-2xl p-2 shadow-sm hover:shadow-md transition-shadow">
            {/* Category Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#FAF8F5] rounded-xl text-sm font-heading font-medium text-[#1C1917] hover:bg-[#F5F3F0] transition-colors whitespace-nowrap"
              >
                <span className="hidden sm:block">{category}</span>
                <span className="sm:hidden">Cat.</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#6B7280] transition-transform ${catOpen ? "rotate-180" : ""}`} />
              </button>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#EBEBEB] rounded-xl shadow-lg overflow-hidden z-20"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setCatOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm font-body hover:bg-[#FAF8F5] transition-colors ${
                        category === cat ? "text-[#1A56DB] font-medium" : "text-[#1C1917]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px bg-[#EBEBEB] my-1" />

            {/* Search Input */}
            <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-[#9CA3AF] ml-2 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search by skill, name, or keyword..."
                  className="flex-1 py-2.5 bg-transparent text-sm font-body text-[#1C1917] placeholder-[#9CA3AF] outline-none min-w-0"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="p-1 hover:bg-[#F5F3F0] rounded-full">
                    <X className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  </button>
                )}
              </div>

              {/* Suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#EBEBEB] rounded-xl shadow-lg overflow-hidden z-20"
                >
                  {filteredSuggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setQuery(s); setShowSuggestions(false); onSearch?.(s); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-body text-[#1C1917] hover:bg-[#FAF8F5] flex items-center gap-2"
                    >
                      <Search className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={() => onSearch?.(query)}
              className="px-6 py-2.5 bg-[#1A56DB] text-white text-sm font-heading font-semibold rounded-xl hover:bg-[#1648C4] transition-all btn-press flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:block">Search</span>
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <div className="flex items-center gap-1.5 text-xs font-heading font-semibold text-[#6B7280]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters:
            </div>

            {filterChips.map((filter) => (
              <div key={filter.id} className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setOpenFilter(openFilter === filter.id ? null : filter.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-medium transition-all ${
                    activeFilters[filter.id]
                      ? "bg-[#1A56DB] text-white"
                      : "bg-white border border-[#EBEBEB] text-[#6B7280] hover:border-[#1A56DB] hover:text-[#1A56DB]"
                  }`}
                >
                  {activeFilters[filter.id] || filter.label}
                  <ChevronDown className={`w-3 h-3 transition-transform ${openFilter === filter.id ? "rotate-180" : ""}`} />
                </button>
                {openFilter === filter.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-1 w-36 bg-white border border-[#EBEBEB] rounded-xl shadow-lg overflow-hidden z-20"
                  >
                    {filter.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (opt === filter.options[0]) {
                            const updated = { ...activeFilters };
                            delete updated[filter.id];
                            setActiveFilters(updated);
                          } else {
                            setActiveFilters({ ...activeFilters, [filter.id]: opt });
                          }
                          setOpenFilter(null);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-body text-[#1C1917] hover:bg-[#FAF8F5]"
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}

            {/* New Talent Toggle */}
            <button
              onClick={() => setNewTalentOnly(!newTalentOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all ${
                newTalentOnly
                  ? "badge-new-talent"
                  : "bg-white border border-[#EBEBEB] text-[#6B7280] hover:border-[#6366F1] hover:text-[#6366F1]"
              }`}
            >
              ✨ New Talent Only
            </button>

            {activeCount > 0 && (
              <button
                onClick={() => { setActiveFilters({}); setNewTalentOnly(false); }}
                className="text-xs font-body text-[#6B7280] hover:text-[#1C1917] underline"
              >
                Clear all ({activeCount})
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
