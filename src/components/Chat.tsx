import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Sparkles, RefreshCcw, Heart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithGemini, analyzeStress } from '../services/geminiService';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [analysisSummary, setAnalysisSummary] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history from backend on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const chatRes = await fetch('/api/chats');
        const analysisRes = await fetch('/api/analysis');
        
        if (chatRes.ok) {
          const data = await chatRes.json();
          setMessages(data);
        }
        
        if (analysisRes.ok) {
          const data = await analysisRes.json();
          if (data && data.summary !== "아직 분석 데이터가 없습니다.") {
            setAnalysisSummary(data.summary);
          }
        }
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setIsInitialLoading(false);
      }
    }
    loadHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // 1. Get Stress Analysis periodically (e.g., every 3 user messages)
      let currentAnalysis = null;
      const userMessageCount = newMessages.filter(m => m.role === 'user').length;
      if (userMessageCount % 3 === 0) {
        currentAnalysis = await analyzeStress(newMessages);
        if (currentAnalysis) {
          setAnalysisSummary(currentAnalysis.summary);
        }
      }

      // 2. Get AI Response (using context if available)
      const aiResponse = await chatWithGemini(newMessages, analysisSummary || undefined);
      if (aiResponse) {
        const finalMessages: Message[] = [...newMessages, { role: 'model', content: aiResponse }];
        setMessages(finalMessages);
        
        // 3. Persist to Backend
        await fetch('/api/chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            messages: finalMessages,
            analysis: currentAnalysis
          })
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: '죄송해요, 잠시 대화 연결이 원활하지 않네요. 다시 말씀해주시겠어요?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch('/api/chats', { method: 'DELETE' });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setAnalysisSummary(null);
      }
    } catch (error) {
      console.error('Failed to reset chat:', error);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto glass-card items-center justify-center">
        <Sparkles className="animate-spin text-brand-sage mb-4" size={32} />
        <p className="font-serif text-brand-text/60">상담 정보를 불러오고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto glass-card overflow-hidden">
      <div className="p-4 border-bottom border-black/5 bg-white/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-sage flex items-center justify-center text-white">
            <Heart size={16} fill="currentColor" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg leading-none">토닥이</h2>
            <p className="text-xs text-brand-text/60">선생님의 마음 동료</p>
          </div>
        </div>
        <button 
          onClick={handleReset}
          className="p-2 hover:bg-black/5 rounded-full transition-colors text-brand-text/40 hover:text-brand-text/80"
          title="대화 초기화"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
              msg.role === 'user' ? "bg-brand-accent text-white" : "bg-white text-brand-sage"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
            </div>
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-brand-accent/20 text-brand-text rounded-tr-none" 
                : "bg-white text-brand-text rounded-tl-none font-serif"
            )}>
              <div className="prose prose-sm font-serif">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white text-brand-sage flex items-center justify-center shadow-sm">
              <Sparkles size={16} className="animate-spin" />
            </div>
            <div className="bg-white/60 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
              <span className="w-1.5 h-1.5 bg-brand-sage/40 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-brand-sage/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-brand-sage/40 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/40 border-t border-black/5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="상담을 시작해보세요..."
            className="w-full bg-white/80 border-none rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-brand-sage/20 outline-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 text-brand-sage hover:text-brand-sage/80 disabled:opacity-30 transition-opacity"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
