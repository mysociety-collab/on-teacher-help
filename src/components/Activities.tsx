import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Quote, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

const AFFIRMATIONS = [
  "선생님은 아이들에게 이미 충분히 좋은 거울이 되어주고 계십니다.",
  "오늘 소모한 에너지만큼, 선생님의 내일은 더 따뜻한 평온으로 채워질 거예요.",
  "완벽하지 않아도 괜찮습니다. 선생님의 진심은 아이들에게 닿고 있습니다.",
  "오늘 하루도 정말 애쓰셨습니다. 이제 무거운 짐은 잠시 내려놓으세요.",
  "선생님의 존재 자체가 누군가에게는 큰 위로이자 희망입니다.",
  "지치는 것은 선생님이 그만큼 최선을 다해 살아왔다는 증거입니다.",
  "아이들의 성장은 눈에 보이지 않아도 분명히 일어나고 있습니다. 선생님 덕분에요.",
  "때로는 멈춰 서서 자신을 먼저 돌보는 것이 가장 훌륭한 교육입니다."
];

export function Affirmation() {
  const [quote, setQuote] = useState(AFFIRMATIONS[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const filtered = AFFIRMATIONS.filter(q => q !== quote);
      setQuote(filtered[Math.floor(Math.random() * filtered.length)]);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="glass-card p-8 text-center relative overflow-hidden h-full flex flex-col justify-center gap-6 group">
      <div className="absolute top-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote size={48} />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.p
          key={quote}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="text-xl md:text-2xl font-serif font-medium leading-relaxed italic text-brand-text/90 px-4"
        >
          "{quote}"
        </motion.p>
      </AnimatePresence>

      <button
        onClick={nextQuote}
        className="mx-auto flex items-center gap-2 text-sm font-medium text-brand-sage hover:text-brand-sage/80 transition-colors bg-white/40 px-4 py-2 rounded-full border border-brand-sage/20"
      >
        <Sparkles size={16} /> 위로 더 받기
      </button>
    </div>
  );
}

export function BreathingGuide() {
  const [phase, setPhase] = useState<'In' | 'Hold' | 'Out'>('In');

  React.useEffect(() => {
    const sequence = async () => {
      while (true) {
        setPhase('In');
        await new Promise(r => setTimeout(r, 4000));
        setPhase('Hold');
        await new Promise(r => setTimeout(r, 4000));
        setPhase('Out');
        await new Promise(r => setTimeout(r, 4000));
      }
    };
    sequence();
  }, []);

  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center gap-8 h-full min-h-[300px]">
      <div className="flex flex-col items-center gap-2">
        <Wind className="text-brand-sage animate-pulse" />
        <h3 className="font-serif font-bold text-lg">마음 호흡하기</h3>
        <p className="text-sm text-brand-text/60">함께 천천히 호흡해 보아요</p>
      </div>

      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div
          animate={{
            scale: phase === 'In' ? 1.5 : phase === 'Hold' ? 1.5 : 0.8,
            backgroundColor: phase === 'In' ? 'rgba(148, 166, 132, 0.1)' : 'rgba(228, 194, 193, 0.1)'
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
        />
        
        {/* Pulse Circle */}
        <motion.div
          animate={{
            scale: phase === 'In' ? 1.2 : phase === 'Hold' ? 1.2 : 0.9,
            opacity: phase === 'Hold' ? 0.8 : 1
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="w-32 h-32 bg-brand-sage/20 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border border-brand-sage/20"
        >
          <span className="font-serif font-bold text-brand-sage text-xl uppercase tracking-widest">
            {phase === 'In' ? '숨 들이키기' : phase === 'Hold' ? '잠시 멈춤' : '천천히 내뱉기'}
          </span>
        </motion.div>
      </div>
      
      <div className="flex gap-2 text-xs font-mono text-brand-text/40">
        <span className={cn(phase === 'In' && "text-brand-sage font-bold")}>4s IN</span>
        <span>•</span>
        <span className={cn(phase === 'Hold' && "text-brand-sage font-bold")}>4s HOLD</span>
        <span>•</span>
        <span className={cn(phase === 'Out' && "text-brand-sage font-bold")}>4s OUT</span>
      </div>
    </div>
  );
}
