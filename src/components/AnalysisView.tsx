import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, PieChart, Info, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface AnalysisData {
  categoryCounts: Record<string, number>;
  summary: string;
}

export default function AnalysisView() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch('/api/analysis');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch analysis:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <TrendingUp className="animate-bounce text-brand-sage" size={48} />
        <p className="font-serif text-brand-text/60">선생님의 스트레스 데이터를 분석 중입니다...</p>
      </div>
    );
  }

  if (!data || Object.keys(data.categoryCounts).length === 0) {
    return (
      <div className="glass-card p-12 text-center flex flex-col items-center gap-4">
        <AlertCircle size={48} className="text-brand-accent/40" />
        <h3 className="text-xl font-serif font-bold">분석 데이터가 아직 부족합니다</h3>
        <p className="text-brand-text/60 max-w-sm">
          AI 상담원 '토닥이'와 더 많은 대화를 나누어 보세요. 선생님의 스트레스 원인을 분석하여 맞춤형 상담을 준비하겠습니다.
        </p>
      </div>
    );
  }

  const categories = Object.entries(data.categoryCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...categories.map(c => c[1]), 1);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stress Distribution Chart */}
        <div className="glass-card p-8 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-brand-sage" size={20} />
            <h3 className="font-serif font-bold text-lg">스트레스 분포 분석</h3>
          </div>
          
          <div className="space-y-4">
            {categories.map(([category, count]) => (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>{category}</span>
                  <span className="text-brand-text/40">{count}회 언급</span>
                </div>
                <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxCount) * 100}%` }}
                    className="h-full bg-brand-sage/60 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="glass-card p-8 flex flex-col gap-6 bg-brand-sage/5 border-l-4 border-l-brand-sage">
          <div className="flex items-center gap-2">
            <PieChart className="text-brand-sage" size={20} />
            <h3 className="font-serif font-bold text-lg">AI 맞춤 분석 결과</h3>
          </div>
          
          <div className="bg-white/40 p-4 rounded-2xl italic font-serif text-brand-text/80 leading-relaxed relative">
            <QuoteIcon className="absolute -top-2 -left-2 text-brand-sage/20" />
            {data.summary}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-1">
              <Info size={14} className="text-brand-sage" /> 주목할 점
            </h4>
            <ul className="text-xs space-y-2 text-brand-text/60">
              <li className="flex gap-2">• 현재 가장 높은 비중은 <strong>'{categories[0][0]}'</strong> 관련 스트레스입니다.</li>
              <li className="flex gap-2">• 지속적인 상담을 통해 마음의 짐을 덜어내는 과정에 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14C19.017 12.8954 18.1216 12 17.017 12H15.017C13.9124 12 13.017 11.1046 13.017 10V5C13.017 3.89543 13.9124 3 15.017 3H19.017C20.1216 3 21.017 3.89543 21.017 5V19C21.017 20.1046 20.1216 21 19.017 21H14.017ZM3 21L3 18C3 16.8954 3.89543 16 5 16H8V14C8 12.8954 7.10457 12 6 12H4C2.89543 12 2 11.1046 2 10V5C2 3.89543 2.89543 3 4 3H8C9.10457 3 10 3.89543 10 5V19C10 20.1046 9.10457 21 8 21H3Z" />
    </svg>
  );
}
