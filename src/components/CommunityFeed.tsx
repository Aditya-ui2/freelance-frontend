import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Star, MessageCircle, Heart, Share2, Award, Zap, MoreHorizontal, TrendingUp, Send, Loader2, Link, RefreshCw } from "lucide-react";
import { postApi } from "../lib/api";
import { toast } from "sonner";

interface CommentAuthor {
  name: string;
  avatar?: string;
}

interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  Author?: CommentAuthor;
}

interface PostAuthor {
  name: string;
  avatar?: string;
  userType: string;
}

interface PostData {
  id: string;
  content: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  endorsed: boolean;
  createdAt: string;
  Author?: PostAuthor;
  Comments?: CommentData[];
}

interface LoungeStats {
  activeNow: number;
  successStories: number;
  trendingTopics: { name: string; count: string }[];
}

export default function CommunityFeed({ user }: { user: any }) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [stats, setStats] = useState<LoungeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  
  // Comment specific states
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentContent, setCommentContent] = useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});

  const fetchPosts = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    
    try {
      const { data } = await postApi.getAll();
      setPosts(data);
    } catch (err) {
      if (!silent) toast.error("Failed to load lounge feed");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await postApi.getStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  // Implement Auto-Refresh (Polling)
  useEffect(() => {
    fetchPosts();
    fetchStats();

    const interval = setInterval(() => {
      fetchPosts(true); // Silent refresh
      fetchStats();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLike = async (id: string) => {
    try {
      await postApi.like(id);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    } catch (err) {
      toast.error("Failed to update like");
    }
  };

  const handleToggleComments = (id: string) => {
    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentSubmit = async (postId: string) => {
    const content = commentContent[postId];
    if (!content?.trim()) return;

    setIsSubmittingComment(prev => ({ ...prev, [postId]: true }));
    try {
      const { data } = await postApi.addComment(postId, content);
      
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            Comments: [data, ...(p.Comments || [])]
          };
        }
        return p;
      }));
      
      setCommentContent(prev => ({ ...prev, [postId]: "" }));
      toast.success("Comment added!");
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleSubmit = async () => {
    if (!newPostContent.trim()) return;
    setIsPosting(true);
    try {
      const { data } = await postApi.create({ 
        content: newPostContent, 
        tags: ["#Community", "#Lounge"] 
      });
      setPosts([data, ...posts]);
      setNewPostContent("");
      toast.success("Moment shared with the lounge!");
      fetchStats(); 
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to share post");
    } finally {
      setIsPosting(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      {/* Subtle Auto-Refresh Indicator */}
      {isRefreshing && (
        <div className="absolute top-4 right-6 flex items-center gap-2 text-[10px] font-heading font-bold text-[#9CA3AF] uppercase tracking-widest bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#EBEBEB] shadow-sm z-50">
          <RefreshCw className="w-3 h-3 animate-spin text-[#1A56DB]" />
          Syncing Live
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Feed */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-[2rem] border border-[#EBEBEB] p-6 shadow-sm">
             <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1A56DB] to-[#6366F1] flex items-center justify-center flex-shrink-0">
                   {user?.avatar ? (
                     <img src={user.avatar} alt="User" className="w-full h-full rounded-full object-cover" />
                   ) : (
                     <span className="text-white font-black text-xl">{user?.name?.charAt(0) || "U"}</span>
                   )}
                </div>
                <div className="flex-1">
                   <textarea 
                     value={newPostContent}
                     onChange={(e) => setNewPostContent(e.target.value)}
                     placeholder="Share a tip, ask for help, or celebrate a win..."
                     className="w-full bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl p-4 font-body text-sm focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent outline-none resize-none min-h-[100px] transition-all"
                   />
                   <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                         <button className="p-2 hover:bg-[#FAF8F5] rounded-lg text-[#6B7280] transition-colors">
                            <Zap className="w-4 h-4" />
                         </button>
                         <button className="p-2 hover:bg-[#FAF8F5] rounded-lg text-[#6B7280] transition-colors">
                            <Star className="w-4 h-4" />
                         </button>
                      </div>
                      <button 
                        onClick={handleSubmit}
                        disabled={!newPostContent.trim() || isPosting}
                        className="px-6 py-2 bg-[#1C1917] text-white rounded-xl font-heading font-bold hover:bg-black transition-all btn-press shadow-md shadow-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Post to Lounge
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-[2rem] border border-[#EBEBEB] p-8 animate-pulse">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gray-100" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-100 rounded" />
                      <div className="h-3 w-20 bg-gray-50 rounded" />
                    </div>
                  </div>
                  <div className="h-20 bg-gray-50 rounded-xl mb-4" />
                </div>
              ))
            ) : (
              posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2rem] border border-[#EBEBEB] overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="p-8 pb-4">
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-4">
                          <div className="relative">
                             <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                                {post.Author?.avatar ? (
                                  <img src={post.Author.avatar} alt="Author" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="font-display font-black text-[#1C1917]">{post.Author?.name?.charAt(0) || "?"}</span>
                                )}
                             </div>
                             {post.endorsed && (
                               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center border-2 border-white">
                                  <Award className="w-3 h-3 text-white" />
                               </div>
                             )}
                          </div>
                          <div>
                             <div className="flex items-center gap-2">
                                <h4 className="font-heading font-bold text-[#1C1917]">{post.Author?.name || "Anonymous"}</h4>
                                <span className="text-[10px] font-heading font-black px-2 py-0.5 bg-blue-50 text-[#1A56DB] rounded-md uppercase tracking-wider">{post.Author?.userType || "Member"}</span>
                             </div>
                             <p className="text-[10px] font-body text-[#9CA3AF] uppercase tracking-widest mt-0.5">{getTimeAgo(post.createdAt)}</p>
                          </div>
                       </div>
                    </div>

                    <div className="font-body text-[#1C1917] text-sm leading-relaxed mb-6 whitespace-pre-wrap px-1">
                      {post.content}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6 px-1">
                       {post.tags?.map(tag => (
                         <span key={tag} className="text-[10px] font-heading font-bold text-[#1A56DB]/60 hover:text-[#1A56DB] transition-colors cursor-pointer bg-blue-50/50 px-2 py-1 rounded-lg">
                           {tag}
                         </span>
                       ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F5]">
                       <div className="flex items-center gap-6">
                          <button 
                            onClick={() => handleLike(post.id)}
                            className="flex items-center gap-2 text-[#6B7280] hover:text-rose-500 transition-colors group"
                          >
                             <Heart className="w-4 h-4 group-hover:fill-rose-500 transition-all group-active:scale-125" />
                             <span className="text-xs font-mono-stats font-bold">{post.likes}</span>
                          </button>
                          <button 
                            onClick={() => handleToggleComments(post.id)}
                            className={`flex items-center gap-2 transition-colors ${expandedComments[post.id] ? 'text-[#1A56DB]' : 'text-[#6B7280] hover:text-[#1A56DB]'}`}
                          >
                             <MessageCircle className="w-4 h-4" />
                             <span className="text-xs font-mono-stats font-bold">{post.commentsCount}</span>
                          </button>
                       </div>
                       <button className="p-2 hover:bg-[#FAF8F5] rounded-xl text-[#9CA3AF] hover:text-[#1C1917] transition-colors">
                          <Share2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedComments[post.id] && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-[#FAF8F5] border-t border-[#F5F5F5] overflow-hidden"
                      >
                        <div className="p-6 space-y-6">
                          {/* New Comment Input */}
                          <div className="flex gap-3">
                             <div className="w-8 h-8 rounded-full bg-[#1A56DB] flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-[10px] font-black">{user?.name?.charAt(0) || "U"}</span>
                             </div>
                             <div className="flex-1 flex gap-2">
                                <input 
                                  value={commentContent[post.id] || ""}
                                  onChange={(e) => setCommentContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  placeholder="Write a comment..."
                                  className="flex-1 bg-white border border-[#EBEBEB] rounded-xl px-4 py-2 text-xs font-body focus:ring-1 focus:ring-[#1A56DB] outline-none"
                                />
                                <button 
                                  onClick={() => handleCommentSubmit(post.id)}
                                  disabled={!commentContent[post.id]?.trim() || isSubmittingComment[post.id]}
                                  className="p-2 bg-[#1C1917] text-white rounded-xl hover:bg-black disabled:opacity-50"
                                >
                                  {isSubmittingComment[post.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                </button>
                             </div>
                          </div>

                          {/* Comment List */}
                          <div className="space-y-4">
                             {post.Comments && post.Comments.length > 0 ? (
                               post.Comments.map(comment => (
                                 <div key={comment.id} className="flex gap-3 group">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                       {comment.Author?.avatar ? (
                                         <img src={comment.Author.avatar} alt="Author" className="w-full h-full object-cover" />
                                       ) : (
                                         <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase">
                                            {comment.Author?.name?.charAt(0) || "?"}
                                         </div>
                                       )}
                                    </div>
                                    <div className="flex-1">
                                       <div className="bg-white border border-[#F5F5F5] p-3 rounded-2xl rounded-tl-none shadow-sm">
                                          <div className="flex justify-between items-start mb-1">
                                             <span className="text-[10px] font-heading font-black text-[#1C1917]">{comment.Author?.name || "Anonymous"}</span>
                                             <span className="text-[8px] font-body text-[#9CA3AF] uppercase tracking-tighter">{getTimeAgo(comment.createdAt)}</span>
                                          </div>
                                          <p className="text-xs font-body text-[#6B7280] leading-relaxed">{comment.content}</p>
                                       </div>
                                    </div>
                                 </div>
                               ))
                             ) : (
                               <p className="text-center text-[10px] font-body text-[#9CA3AF] py-2">No comments yet. Start the conversation!</p>
                             )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
           <div className="bg-[#1C1917] rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                 <Users className="w-24 h-24" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Users className="w-5 h-5 text-white" />
                   </div>
                   <h3 className="font-heading font-black text-sm uppercase tracking-widest">Lounge Stats</h3>
                </div>
                
                <div className="space-y-8">
                   <div>
                      <p className="text-[10px] font-heading font-bold text-[#9CA3AF] uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        Active Now
                      </p>
                      <p className="text-3xl font-mono-stats font-bold">{stats?.activeNow || "0"} <span className="text-xs text-[#10B981] font-body opacity-80">+14%</span></p>
                   </div>
                   <div>
                      <p className="text-[10px] font-heading font-bold text-[#9CA3AF] uppercase tracking-widest mb-1.5">New Success Stories</p>
                      <p className="text-3xl font-mono-stats font-bold">{stats?.successStories || "0"} <span className="text-xs text-blue-400 font-body opacity-80">This Week</span></p>
                   </div>
                   <button className="w-full py-3.5 bg-white text-[#1C1917] rounded-xl text-xs font-heading font-bold hover:bg-blue-50 transition-all shadow-xl shadow-white/5 group flex items-center justify-center gap-2">
                      Browse Mentor Directory
                      <TrendingUp className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
           </div>

           <div className="bg-white rounded-3xl border border-[#EBEBEB] p-6">
              <h4 className="font-heading font-bold text-sm text-[#1C1917] mb-6 flex items-center justify-between">
                 Trending Topics
                 <Zap className="w-4 h-4 text-[#F59E0B]" />
              </h4>
              <div className="space-y-4">
                 {(stats?.trendingTopics || [
                  { name: "#RepStake", count: "1.2k posts" },
                  { name: "#POCSuccess", count: "850 posts" },
                  { name: "#NewbieHacks", count: "2.5k posts" }
                 ]).map((topic, idx) => (
                   <div key={topic.name} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-lg bg-[#FAF8F5] flex items-center justify-center ${idx === 0 ? 'text-[#6366F1]' : idx === 1 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
                            {idx === 0 ? <Zap className="w-4 h-4" /> : idx === 1 ? <Star className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                         </div>
                         <div>
                            <p className="text-xs font-heading font-bold text-[#1C1917] group-hover:text-[#1A56DB] transition-colors">{topic.name}</p>
                            <p className="text-[10px] font-body text-[#9CA3AF]">{topic.count}</p>
                         </div>
                      </div>
                      <Link className="w-3 h-3 text-[#EBEBEB] group-hover:text-[#1A56DB] transition-colors" />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
