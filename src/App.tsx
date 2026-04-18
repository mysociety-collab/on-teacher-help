import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Wind, MessageCircle, Star, Sparkles, BarChart3 } from 'lucide-react';
import Chat from './components/Chat';
import { Affirmation, BreathingGuide } from './components/Activities';
import AnalysisView from './components/AnalysisView';
import { cn } from './lib/utils';

type Tab = 'chat' | 'affirmation' | 'breathing' | 'analysis';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Soft Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-sage/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      <header className="max-w-7xl mx-auto px-6 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-brand-sage p-2 rounded-2xl shadow-lg rotate-3">
              <Heart className="text-white" size={24} fill="white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-neutral-800">
              토닥토닥 선생님
            </h1>
          </div>
          <p className="text-brand-text/60 font-serif italic text-lg">
            선생님의 마음을 가장 먼저 생각합니다.
          </p>
        </div>

        <nav className="flex p-1 bg-black/5 rounded-2xl backdrop-blur-sm self-center md:self-end">
          <TabButton 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
            icon={<MessageCircle size={18} />}
            label="마음 상담" 
          />
          <TabButton 
            active={activeTab === 'analysis'} 
            onClick={() => setActiveTab('analysis')} 
            icon={<BarChart3 size={18} />}
            label="스트레스 분석" 
          />
          <TabButton 
            active={activeTab === 'affirmation'} 
            onClick={() => setActiveTab('affirmation')} 
            icon={<Star size={18} />}
            label="위로 문구" 
          />
          <TabButton 
            active={activeTab === 'breathing'} 
            onClick={() => setActiveTab('breathing')} 
            icon={<Wind size={18} />}
            label="숨 고르기" 
          />
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Side Info/Featured - Only show on desktop for extra polish */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="glass-card p-6 border-l-4 border-l-brand-sage">
            <h3 className="font-serif font-bold text-lg mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-brand-sage" />
              오늘의 격려
            </h3>
            <p className="text-sm text-brand-text/70 leading-relaxed">
              교육의 길은 결코 혼자 걷는 것이 아닙니다. 수많은 아이들이 선생님의 손끝에서 자라나고 있음을 잊지 마세요.
            </p>
          </div>
          
          <div className="glass-card p-6 overflow-hidden relative">
            <h3 className="font-serif font-bold text-lg mb-3">자가 진단</h3>
            <ul className="text-xs space-y-3 text-brand-text/60">
              <li className="flex gap-2">• 오늘 충분히 물을 마셨나요?</li>
              <li className="flex gap-2">• 1분간 깊은 호흡을 했나요?</li>
              <li className="flex gap-2">• 나 자신에게 "고마워"라고 했나요?</li>
            </ul>
            <div className="absolute -bottom-4 -right-4 bg-brand-accent/20 w-16 h-16 rounded-full blur-xl" />
          </div>
        </div>

        {/* Center/Right Content: Active Section */}
        <div className="lg:col-span-9 w-full min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex flex-col items-center"
            >
              {activeTab === 'chat' && <Chat />}
              {activeTab === 'analysis' && <AnalysisView />}
              {activeTab === 'affirmation' && <Affirmation />}
              {activeTab === 'breathing' && <BreathingGuide />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Footer Tab Bar */}
      <footer className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <nav className="flex items-center justify-around p-2 glass-card border border-white/20 shadow-2xl">
          <MobileTabButton 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
            icon={<MessageCircle size={24} />} 
          />
          <MobileTabButton 
            active={activeTab === 'analysis'} 
            onClick={() => setActiveTab('analysis')} 
            icon={<BarChart3 size={24} />} 
          />
          <MobileTabButton 
            active={activeTab === 'affirmation'} 
            onClick={() => setActiveTab('affirmation')} 
            icon={<Star size={24} />} 
          />
          <MobileTabButton 
            active={activeTab === 'breathing'} 
            onClick={() => setActiveTab('breathing')} 
            icon={<Wind size={24} />} 
          />
        </nav>
      </footer>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition-all",
        active 
          ? "bg-white text-brand-sage shadow-sm" 
          : "text-brand-text/40 hover:text-brand-text/60 hover:bg-white/40"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MobileTabButton({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-3 rounded-2xl transition-all",
        active 
          ? "bg-brand-sage text-white shadow-lg scale-110" 
          : "text-brand-text/40"
      )}
    >
      {icon}
    </button>
  );
}
