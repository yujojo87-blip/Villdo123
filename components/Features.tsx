import React from 'react';
import { Sparkles, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface ComparisonFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  visual: React.ReactNode;
}

const FeatureCard: React.FC<ComparisonFeatureProps> = ({ icon, title, description, visual }) => (
  <div className="bg-white/60 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-8 flex flex-col h-full hover:bg-white/80 dark:hover:bg-white/[0.07] transition-all duration-500 backdrop-blur-sm group shadow-sm dark:shadow-none">
    <div className="mb-6 p-3 bg-zinc-100 dark:bg-white/10 w-fit rounded-2xl text-zinc-800 dark:text-white group-hover:bg-zinc-200 dark:group-hover:bg-white/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-medium text-zinc-900 dark:text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 flex-grow">
      {description}
    </p>
    <div className="bg-zinc-50 dark:bg-black/40 rounded-xl p-6 font-mono text-sm border border-zinc-200 dark:border-white/5 shadow-inner">
      {visual}
    </div>
  </div>
);

const CONTENT = {
  en: {
    fluent: {
      title: "Fluent Logic",
      desc: "Stutters, 'ums', 'uhs', and filler words are automatically stripped away. Villdo listens to your intent, not just your raw audio.",
      input: ["Um,", " I think ", "like,", " we should go."],
      output: "I think we should go."
    },
    changeMind: {
      title: "Change Your Mind",
      desc: "Mid-sentence corrections are handled instantly. If you correct yourself while speaking, Villdo outputs only the final, correct thought.",
      input: "I want a ",
      crossed: "burger... no actually a",
      inputEnd: " salad.",
      output: "I want a salad."
    },
    structure: {
      title: "Smart Structure",
      desc: "Transform rambling thoughts into structured lists, notes, or emails automatically. No markdown knowledge required.",
      list: ["Meeting agenda", "Project timeline", "Next steps"]
    }
  },
  zh: {
    fluent: {
      title: "流畅逻辑",
      desc: "自动去除口吃、“那个”、“额”等废话。Villdo 倾听你的真实意图，而不仅仅是原始音频。",
      input: ["额，", " 我觉得 ", "那个，", " 我们该走了。"],
      output: "我觉得我们该走了。"
    },
    changeMind: {
      title: "随心修改",
      desc: "即时处理中途修改。如果你在说话时自我更正，Villdo 只会输出最终的正确想法。",
      input: "我想要一个 ",
      crossed: "汉堡... 不对其实是",
      inputEnd: " 沙拉。",
      output: "我想要一份沙拉。"
    },
    structure: {
      title: "智能结构",
      desc: "自动将凌乱的想法转化为结构化列表、笔记或邮件。无需掌握 Markdown 语法。",
      list: ["会议议程", "项目时间表", "下一步计划"]
    }
  }
};

export const Features: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = CONTENT[lang];

  return (
    <section className="py-32 max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: Fluent Logic */}
        <FeatureCard
          icon={<Sparkles className="w-6 h-6" />}
          title={t.fluent.title}
          description={t.fluent.desc}
          visual={
            <div className="space-y-4">
              <div className="text-zinc-500 leading-relaxed">
                <span className="line-through decoration-red-500/30 text-red-500/40 dark:text-red-400/40">{t.fluent.input[0]}</span>
                {t.fluent.input[1]}
                <span className="line-through decoration-red-500/30 text-red-500/40 dark:text-red-400/40">{t.fluent.input[2]}</span>
                {t.fluent.input[3]}
              </div>
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-medium">
                <ArrowRight className="w-4 h-4 shrink-0" />
                <span>{t.fluent.output}</span>
              </div>
            </div>
          }
        />

        {/* Card 2: Change Your Mind */}
        <FeatureCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          title={t.changeMind.title}
          description={t.changeMind.desc}
          visual={
            <div className="space-y-4">
              <div className="text-zinc-500 leading-relaxed">
                {t.changeMind.input}
                <span className="line-through decoration-red-500/30 text-red-500/40 dark:text-red-400/40">{t.changeMind.crossed}</span>
                {t.changeMind.inputEnd}
              </div>
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-medium">
                <ArrowRight className="w-4 h-4 shrink-0" />
                <span>{t.changeMind.output}</span>
              </div>
            </div>
          }
        />

        {/* Card 3: Smart Structure */}
        <FeatureCard
          icon={<FileText className="w-6 h-6" />}
          title={t.structure.title}
          description={t.structure.desc}
          visual={
            <div className="space-y-2 text-zinc-700 dark:text-zinc-300">
              {t.structure.list.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          }
        />
      </div>
    </section>
  );
};