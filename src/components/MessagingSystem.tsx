import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Smile, Search, MoreHorizontal, Phone, Video, ChevronRight, File, Image, Loader2, MessageSquare } from "lucide-react";
import { messageApi } from "../lib/api";
import { toast } from "sonner";

const conversations = [
  {
    id: 1,
    name: "Alex Chen",
    title: "UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    lastMsg: "Sure, I can start next Monday!",
    time: "2m ago",
    unread: 2,
    online: true,
    project: "E-Commerce Redesign",
  },
  {
    id: 2,
    name: "Maya Patel",
    title: "React Developer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    lastMsg: "Here is the updated repo link...",
    time: "1h ago",
    unread: 0,
    online: false,
    project: "Dashboard App",
  },
  {
    id: 3,
    name: "James Rivera",
    title: "Brand Strategist",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
    lastMsg: "Proposal sent! Please review.",
    time: "3h ago",
    unread: 1,
    online: true,
    project: "Brand Identity",
  },
];

const messageHistory = [
  { id: 1, from: "other", text: "Hi! I saw your project posting and I'm really excited about it. I have experience with similar e-commerce redesigns.", time: "10:00 AM", read: true },
  { id: 2, from: "me", text: "That's great to hear! Can you share some of your previous work?", time: "10:02 AM", read: true },
  { id: 3, from: "other", text: "Of course! Here's a link to my portfolio: behance.net/alexchen. I particularly worked on a Shopify redesign last month.", time: "10:05 AM", read: true },
  { id: 4, from: "me", text: "Wow, the work looks impressive especially the mobile views. When could you start?", time: "10:15 AM", read: true },
  { id: 5, from: "other", text: "Sure, I can start next Monday!", time: "10:16 AM", read: false },
];

const reactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export default function MessagingSystem({ 
  onClose, 
  isEmbedded = false,
  user,
  initialConversationId
}: { 
  onClose?: () => void; 
  isEmbedded?: boolean;
  user?: any;
  initialConversationId?: string | null;
}) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvo, setActiveConvo] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null);
  const [msgReactions, setMsgReactions] = useState<Record<number, string>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch conversations with polling
  useEffect(() => {
    const fetchConversations = async (isInitial = false) => {
      try {
        const { data } = await messageApi.getConversations();
        const mapped = data.map((c: any) => {
          const otherParticipant = c.Participants[0];
          return {
            id: c.id,
            name: otherParticipant.name,
            title: otherParticipant.title,
            avatar: otherParticipant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.name)}`,
            lastMsg: c.lastMessage || "No messages yet",
            time: new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            online: true,
            project: "Project Discussion"
          };
        });
        setConversations(mapped);
        
        // Handle initial conversation or selection
        if (initialConversationId) {
          const target = mapped.find((c: any) => c.id === initialConversationId);
          if (target) setActiveConvo(target);
        } else if (isInitial && mapped.length > 0 && !activeConvo) {
          setActiveConvo(mapped[0]);
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        if (isInitial) setLoading(false);
      }
    };

    fetchConversations(true);
    const interval = setInterval(() => fetchConversations(), 5000); // Poll conversations every 5s
    return () => clearInterval(interval);
  }, [initialConversationId]);

  // Fetch messages when activeConvo changes (with polling)
  useEffect(() => {
    if (!activeConvo) return;

    const fetchMessages = async (isInitial = false) => {
      if (isInitial) setMessagesLoading(true);
      try {
        const { data } = await messageApi.getMessages(activeConvo.id);
        const newMessages = data.map((m: any) => ({
          id: m.id,
          from: m.senderId === user?.id ? "me" : "other",
          text: m.content,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: m.read
        }));
        
        // Only update if message count changed to avoid unnecessary re-renders/scrolls
        setMessages(prev => JSON.stringify(prev) !== JSON.stringify(newMessages) ? newMessages : prev);
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        if (isInitial) setMessagesLoading(false);
      }
    };

    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(), 3000); // Poll messages every 3s
    return () => clearInterval(interval);
  }, [activeConvo?.id, user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeConvo) return;
    const content = input;
    setInput("");
    try {
      const { data } = await messageApi.sendMessage(activeConvo.id, content);
      setMessages((prev) => [
        ...prev,
        { 
          id: data.id, 
          from: "me", 
          text: content, 
          time: "Now", 
          read: false 
        },
      ]);
      // Update last message in sidebar
      setConversations(prev => prev.map(c => 
        c.id === activeConvo.id ? { ...c, lastMsg: content, time: "Now" } : c
      ));
    } catch (err) {
      toast.error("Failed to send message");
      setInput(content);
    }
  };

  const addReaction = (msgId: number, reaction: string) => {
    setMsgReactions((prev) => ({ ...prev, [msgId]: reaction }));
    setHoveredMsg(null);
  };

  return (
    <div 
      className={isEmbedded ? "w-full h-[calc(100vh-80px)]" : "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"}
      onClick={!isEmbedded ? onClose : undefined}
    >
      <motion.div
        initial={isEmbedded ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={isEmbedded ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
        className={`bg-white rounded-3xl w-full ${isEmbedded ? 'h-full border border-[#EBEBEB]' : 'max-w-4xl h-[600px] shadow-2xl'} overflow-hidden flex relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Conversation List */}
        <div className="w-64 border-r border-[#EBEBEB] bg-[#FAF8F5] flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-[#EBEBEB]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-bold text-sm text-[#1C1917]">Messages</h3>
              {!isEmbedded && <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#6B7280] text-sm">✕</button>}
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#EBEBEB] rounded-xl">
              <Search className="w-3.5 h-3.5 text-[#9CA3AF]" />
              <input placeholder="Search..." className="flex-1 text-xs font-body outline-none placeholder-[#9CA3AF] bg-transparent" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-[#1A56DB]" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-xs text-[#9CA3AF] font-body">No conversations yet</p>
              </div>
            ) : (
              conversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => setActiveConvo(convo)}
                  className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-white transition-colors ${
                    activeConvo?.id === convo.id ? "bg-white border-r-2 border-[#1A56DB]" : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img src={convo.avatar} alt={convo.name} className="w-9 h-9 rounded-full object-cover" />
                    {convo.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] border-2 border-[#FAF8F5] rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-semibold text-xs text-[#1C1917] truncate">{convo.name}</span>
                      <span className="text-[9px] font-body text-[#9CA3AF] flex-shrink-0 ml-1">{convo.time}</span>
                    </div>
                    <p className="font-body text-[10px] text-[#9CA3AF] truncate mt-0.5">{convo.lastMsg}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {activeConvo ? (
            <>
              {/* Chat Header */}
              <div className="px-5 py-3 border-b border-[#EBEBEB] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={activeConvo.avatar} alt={activeConvo.name} className="w-9 h-9 rounded-full object-cover" />
                    {activeConvo.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-[#1C1917]">{activeConvo.name}</p>
                    <p className="font-body text-[10px] text-[#9CA3AF]">{activeConvo.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors">
                    <Phone className="w-4 h-4 text-[#6B7280]" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors">
                    <Video className="w-4 h-4 text-[#6B7280]" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-[#1A56DB]" />
                  </div>
                ) : (
                  <>
                    {/* Project Context */}
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-xs font-body text-[#1A56DB]">
                        <ChevronRight className="w-3 h-3" />
                        Project: <strong>{activeConvo.project}</strong>
                      </div>
                    </div>

                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${msg.from === "me" ? "flex-row-reverse" : ""}`}
                        onMouseEnter={() => setHoveredMsg(msg.id)}
                        onMouseLeave={() => setHoveredMsg(null)}
                      >
                        {msg.from === "other" && (
                          <img src={activeConvo.avatar} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                        )}
                        <div className="relative max-w-xs">
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm font-body leading-relaxed ${
                              msg.from === "me"
                                ? "bg-[#1A56DB] text-white rounded-br-sm"
                                : "bg-[#FAF8F5] text-[#1C1917] border border-[#EBEBEB] rounded-bl-sm"
                            }`}
                          >
                            {msg.text}
                          </div>
                          <div className={`flex items-center gap-1 mt-0.5 ${msg.from === "me" ? "justify-end" : ""}`}>
                            <span className="text-[9px] font-body text-[#9CA3AF]">{msg.time}</span>
                            {msg.from === "me" && (
                              <span className="text-[9px] text-[#9CA3AF]">{msg.read ? "✓✓" : "✓"}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-[#EBEBEB]">
                <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#EBEBEB] rounded-2xl px-3 py-2">
                  <button className="p-1.5 hover:bg-white rounded-lg transition-colors">
                    <Paperclip className="w-4 h-4 text-[#9CA3AF]" />
                  </button>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm font-body text-[#1C1917] placeholder-[#9CA3AF] outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="p-2 bg-[#1A56DB] text-white rounded-xl hover:bg-[#1648C4] transition-all btn-press disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#9CA3AF]">
              <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-body">Select a conversation to start chatting</p>
            </div>
          )}
        </div>

        {/* Project Context Panel (Right) */}
        {activeConvo && (
          <div className="w-52 border-l border-[#EBEBEB] bg-[#FAF8F5] p-4 hidden lg:block">
            <h4 className="font-heading font-bold text-xs text-[#1C1917] mb-4">Project Brief</h4>
            <div className="space-y-3">
              <div className="bg-white border border-[#EBEBEB] rounded-xl p-3">
                <p className="text-[10px] font-heading font-semibold text-[#9CA3AF] uppercase mb-1">Project</p>
                <p className="font-body text-xs text-[#1C1917] font-medium">{activeConvo.project}</p>
              </div>
              <div className="bg-white border border-[#EBEBEB] rounded-xl p-3">
                <p className="text-[10px] font-heading font-semibold text-[#9CA3AF] uppercase mb-1">Status</p>
                <span className="text-[10px] font-heading font-semibold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full">In Progress</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
