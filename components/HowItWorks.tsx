import React from 'react';
import { Download, Mic, MonitorDown } from 'lucide-react';
import { Language } from '../types';

const STEPS = {
  en: [
    { title: "Download App", icon: MonitorDown },
    { title: "Press Fn", icon: "FN_KEY" },
    { title: "Speak Freely", icon: Mic }
  ],
  zh: [
    { title: "下载应用", icon: MonitorDown },
    { title: "按下 Fn", icon: "FN_KEY" },
    { title: "自由表达", icon: Mic }
  ],
  ja: [
    { title: "アプリをダウンロード", icon: MonitorDown },
    { title: "Fnキーを押す", icon: "FN_KEY" },
    { title: "自由に話す", icon: Mic }
  ]
};

// Realistic Fn Key Component
const FnKey = () => (
  <div className="group/key relative w-16 h-16">
    {/* Key Base (Shadow/Side) */}
    <div className="absolute inset-0 bg-zinc-300 dark:bg-zinc-800 rounded-xl translate-y-1.5" />
    {/* Key Top */}
    <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 rounded-xl border-t border-white/60 dark:border-white/10 shadow-sm flex items-center justify-center transition-transform duration-100 group-hover/key:translate-y-1">
      <span className="font-mono font-semibold text-zinc-500 dark:text-zinc-300 text-lg">Fn</span>
    </div>
  </div>
);

export const HowItWorks: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/30 dark:via-white/5 to-transparent pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 relative">
          
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent -translate-y-1/2 z-0" />

          {STEPS[lang].map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
              
              {/* Number Badge */}
              <div className="mb-8 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-full z-20 shadow-sm">
                 <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">0{i + 1}</span>
              </div>

              {/* Visual Container */}
              <div className="w-32 h-32 mb-8 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-100 dark:border-zinc-800 shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-blue-500/10 dark:group-hover:shadow-blue-500/20 transition-all duration-500 relative backdrop-blur-sm">
                {/* Glow effect behind icon */}
                <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {step.icon === "FN_KEY" ? (
                   <FnKey />
                ) : (
                   // @ts-ignore - render icon component
                   <step.icon className="w-10 h-10 text-zinc-700 dark:text-zinc-200 stroke-[1.5] relative z-10" />
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-medium text-zinc-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {step.title}
              </h3>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};