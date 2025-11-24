import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Copy, Check, Mic, ArrowRight, RefreshCw, Sparkles, Keyboard } from 'lucide-react';
import { transformText } from '../services/geminiService';
import { DemoMode, Language } from '../types';

// Helper component for animated strikethrough
const AnimatedStrike: React.FC<{ children: React.ReactNode; show: boolean }> = ({ children, show }) => (
  <span className="relative inline-block mx-0.5">
    <span className={`transition-opacity duration-300 ${show ? 'opacity-50' : 'opacity-100'}`}>
      {children}
    </span>
    <span 
      className={`absolute top-1/2 left-0 h-[2px] bg-red-500 rounded-full transition-all duration-500 ease-out ${show ? 'w-full' : 'w-0'}`} 
      style={{ transform: 'translateY(-50%)' }}
    />
  </span>
);

// Define rich scenarios for the demo visualization
interface ScenarioData {
  raw: string;
  clean: string;
  // renderDiff now accepts a boolean to trigger the drawing animation
  renderDiff: (lang: Language, showCorrections: boolean) => React.ReactNode; 
}

const SCENARIOS: Record<Language, Record<DemoMode, ScenarioData>> = {
  en: {
    [DemoMode.PROFESSIONAL_EMAIL]: {
      raw: "I think we should, should probably send the report tomorrow... yeah tomorrow.",
      clean: "I think we should probably send the report tomorrow.",
      renderDiff: (lang, show) => (
        <span>
          I think we should, <AnimatedStrike show={show}>should</AnimatedStrike> probably send the report <AnimatedStrike show={show}>tomorrow... yeah</AnimatedStrike> tomorrow.
        </span>
      )
    },
    [DemoMode.SLACK_MESSAGE]: {
      raw: "hey guys just fyi i pushed the code but like there is a small bug in the login page i'm fixing it now",
      clean: "Just FYI, I've pushed the code. There's a small bug on the login page that I'm fixing now.",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>hey guys</AnimatedStrike> just fyi i pushed the code <AnimatedStrike show={show}>but like</AnimatedStrike> there is a small bug in the login page i'm fixing it now
        </span>
      )
    },
    [DemoMode.PERSONAL_NOTE]: {
      raw: "reminder to buy milk and uh also need to call mom for her birthday and pick up the dry cleaning",
      clean: "- Buy milk\n- Call Mom (Birthday)\n- Pick up dry cleaning",
      renderDiff: (lang, show) => (
        <span>
          reminder to buy milk <AnimatedStrike show={show}>and uh also need to</AnimatedStrike> call mom for her birthday <AnimatedStrike show={show}>and</AnimatedStrike> pick up the dry cleaning
        </span>
      )
    },
    [DemoMode.CODE_COMMENT]: {
      raw: "so this function basically takes the user id and then it checks the database to see if they exist",
      clean: "Checks database for existence of provided User ID.",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>so</AnimatedStrike> this function <AnimatedStrike show={show}>basically</AnimatedStrike> takes the user id <AnimatedStrike show={show}>and then it</AnimatedStrike> checks the database to see if they exist
        </span>
      )
    },
    [DemoMode.CREATIVE_WRITING]: {
      raw: "the sky was like really blue and the clouds were fluffy and the wind was blowing through the trees",
      clean: "The azure sky held fluffy clouds, while a gentle wind whispered through the trees.",
      renderDiff: (lang, show) => (
        <span>
          the sky was <AnimatedStrike show={show}>like really</AnimatedStrike> blue and the clouds were fluffy and the wind was blowing through the trees
        </span>
      )
    }
  },
  zh: {
    [DemoMode.PROFESSIONAL_EMAIL]: {
      raw: "我觉得我们应该，应该明天发送报告... 对明天。",
      clean: "我觉得我们应该明天发送报告。",
      renderDiff: (lang, show) => (
        <span>
          我觉得我们应该，<AnimatedStrike show={show}>应该</AnimatedStrike>明天发送报告<AnimatedStrike show={show}>... 对明天</AnimatedStrike>。
        </span>
      )
    },
    [DemoMode.SLACK_MESSAGE]: {
      raw: "嘿大家跟你们说下我刚提交了代码但是额登录页有个小bug我正在修",
      clean: "刚提交了代码。登录页有个小 Bug，正在修复。",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>嘿大家跟你们说下</AnimatedStrike>我刚提交了代码<AnimatedStrike show={show}>但是额</AnimatedStrike>登录页有个小bug我正在修
        </span>
      )
    },
    [DemoMode.PERSONAL_NOTE]: {
      raw: "提醒我去买牛奶然后额还要给妈妈打电话祝她生日快乐还有去取干洗的衣服",
      clean: "- 买牛奶\n- 给妈妈打电话（生日）\n- 取干洗衣服",
      renderDiff: (lang, show) => (
        <span>
          提醒我去买牛奶<AnimatedStrike show={show}>然后额还要</AnimatedStrike>给妈妈打电话祝她生日快乐<AnimatedStrike show={show}>还有去</AnimatedStrike>取干洗的衣服
        </span>
      )
    },
    [DemoMode.CODE_COMMENT]: {
      raw: "所以这个函数基本上就是获取用户id然后额去查数据库看他们存不存在",
      clean: "根据用户 ID 检查数据库中是否存在该用户。",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>所以</AnimatedStrike>这个函数<AnimatedStrike show={show}>基本上就是</AnimatedStrike>获取用户id<AnimatedStrike show={show}>然后额去</AnimatedStrike>查数据库看他们存不存在
        </span>
      )
    },
    [DemoMode.CREATIVE_WRITING]: {
      raw: "天空特别特别蓝然后云彩很蓬松风吹过树林的感觉",
      clean: "湛蓝的天空中漂浮着蓬松的云朵，微风轻拂过树林。",
      renderDiff: (lang, show) => (
        <span>
          天空<AnimatedStrike show={show}>特别特别</AnimatedStrike>蓝<AnimatedStrike show={show}>然后</AnimatedStrike>云彩很蓬松风吹过树林的感觉
        </span>
      )
    }
  },
  ja: {
    [DemoMode.PROFESSIONAL_EMAIL]: {
      raw: "えっと、火曜日の会議、体調悪いので、たぶん欠席します。",
      clean: "体調不良のため、火曜日の会議を欠席いたします。",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>えっと、</AnimatedStrike>火曜日の会議、体調悪いので、<AnimatedStrike show={show}>たぶん</AnimatedStrike>欠席します。
        </span>
      )
    },
    [DemoMode.SLACK_MESSAGE]: {
      raw: "お疲れ様です、コードプッシュしたんですけど、なんかバグあるんで、今直してます。",
      clean: "お疲れ様です。コードをプッシュしました。バグを修正中です。",
      renderDiff: (lang, show) => (
        <span>
          お疲れ様です、コードプッシュしたんですけど、<AnimatedStrike show={show}>なんか</AnimatedStrike>バグあるんで、今直してます。
        </span>
      )
    },
    [DemoMode.PERSONAL_NOTE]: {
      raw: "牛乳買うのと、あとえーっと母に電話するのと、クリーニング行く。",
      clean: "- 牛乳を買う\n- 母に電話\n- クリーニングに行く",
      renderDiff: (lang, show) => (
        <span>
          牛乳買うのと、<AnimatedStrike show={show}>あとえーっと</AnimatedStrike>母に電話するのと、クリーニング行く。
        </span>
      )
    },
    [DemoMode.CODE_COMMENT]: {
      raw: "つまりこの関数は、ユーザーIDをとって、データベースにいるか見るやつです。",
      clean: "ユーザーIDがデータベースに存在するか確認する。",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>つまり</AnimatedStrike>この関数は、ユーザーIDをとって、データベースにいるか見る<AnimatedStrike show={show}>やつです</AnimatedStrike>。
        </span>
      )
    },
    [DemoMode.CREATIVE_WRITING]: {
      raw: "空がめっちゃ青くて、雲もふわふわで、風が木を吹き抜ける感じ。",
      clean: "空は深く澄み渡り、白い雲が浮かんでいる。木々の間を風が吹き抜けていった。",
      renderDiff: (lang, show) => (
        <span>
          空が<AnimatedStrike show={show}>めっちゃ</AnimatedStrike>青くて、雲もふわふわで、風が木を吹き抜ける感じ。
        </span>
      )
    }
  }
};

const MODE_LABELS: Record<Language, Record<DemoMode, string>> = {
  en: {
    [DemoMode.PROFESSIONAL_EMAIL]: "Removes Repetition",
    [DemoMode.SLACK_MESSAGE]: "Formatting",
    [DemoMode.PERSONAL_NOTE]: "Structuring",
    [DemoMode.CODE_COMMENT]: "Summarizing",
    [DemoMode.CREATIVE_WRITING]: "Polishing"
  },
  zh: {
    [DemoMode.PROFESSIONAL_EMAIL]: "去除重复",
    [DemoMode.SLACK_MESSAGE]: "自动格式",
    [DemoMode.PERSONAL_NOTE]: "智能结构",
    [DemoMode.CODE_COMMENT]: "总结摘要",
    [DemoMode.CREATIVE_WRITING]: "润色优化"
  },
  ja: {
    [DemoMode.PROFESSIONAL_EMAIL]: "重複削除",
    [DemoMode.SLACK_MESSAGE]: "自動整形",
    [DemoMode.PERSONAL_NOTE]: "構造化",
    [DemoMode.CODE_COMMENT]: "要約",
    [DemoMode.CREATIVE_WRITING]: "文章推敲"
  }
};

const UI_TEXT: Record<Language, { tryIt: string, pressMic: string, listening: string, reset: string, analysis: string, micError: string }> = {
  en: {
    tryIt: "Try it yourself",
    pressMic: "Press the microphone button below and read:",
    listening: "Listening...",
    reset: "Reset",
    analysis: "Analysis",
    micError: "Microphone access denied. Please check permissions."
  },
  zh: {
    tryIt: "亲自试一试",
    pressMic: "点击右下角的麦克风按钮，并朗读：",
    listening: "正在聆听...",
    reset: "重置",
    analysis: "分析演示",
    micError: "无法访问麦克风，请检查权限。"
  },
  ja: {
    tryIt: "試してみる",
    pressMic: "下のマイクボタンを押して、読み上げてください：",
    listening: "聞き取り中...",
    reset: "リセット",
    analysis: "分析プロセス",
    micError: "マイクへのアクセスが拒否されました。権限を確認してください。"
  }
};

interface InteractiveDemoProps {
  lang: Language;
}

export const InteractiveDemo: React.FC<InteractiveDemoProps> = ({ lang }) => {
  const [selectedMode, setSelectedMode] = useState<DemoMode>(DemoMode.PROFESSIONAL_EMAIL);
  // Stages: 0:Start, 1:Typing, 2:Done/Pause, 3:Correction, 4:Result
  const [animStage, setAnimStage] = useState(0); 
  const [displayedRaw, setDisplayedRaw] = useState("");
  const [editorText, setEditorText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
  const scenario = SCENARIOS[lang][selectedMode];
  const ui = UI_TEXT[lang];

  // --- Animation Loop (Left Side) ---
  useEffect(() => {
    let typingInterval: ReturnType<typeof setInterval>;
    let t2: ReturnType<typeof setTimeout>;
    let t3: ReturnType<typeof setTimeout>;
    let t4: ReturnType<typeof setTimeout>;

    setAnimStage(0);
    setDisplayedRaw("");
    
    const rawText = scenario.raw;
    let charIndex = 0;

    // Start typing slightly faster
    const startDelay = setTimeout(() => {
      setAnimStage(1);
      typingInterval = setInterval(() => {
        if (charIndex < rawText.length) {
          setDisplayedRaw(rawText.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setAnimStage(2); // Typing done
          
          // Trigger Correction
          t3 = setTimeout(() => setAnimStage(3), 400);
          // Show Result
          t4 = setTimeout(() => setAnimStage(4), 1200);
        }
      }, 20);
    }, 100);

    return () => {
      clearTimeout(startDelay);
      clearInterval(typingInterval);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [selectedMode, lang]);

  // --- Interaction Logic (Right Side) ---
  const handleMicClick = async () => {
    if (isRecording) return;

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // If successful, start the "recording" simulation
      setIsRecording(true);
      setEditorText("");
      
      // Stop the tracks immediately since we are just simulating for now
      stream.getTracks().forEach(track => track.stop());

      setTimeout(() => {
        setIsRecording(false);
        simulateTyping(scenario.clean);
      }, 1500); 

    } catch (err) {
      console.error("Microphone permission denied or error:", err);
      alert(ui.micError);
    }
  };

  const simulateTyping = (text: string) => {
    let i = 0;
    const interval = setInterval(() => {
      setEditorText(text.slice(0, i + 1));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
  };

  return (
    <div className="w-full max-w-6xl mx-auto relative">
      
      {/* Top Navigation Tabs */}
      <div className="flex justify-center mb-8 overflow-x-auto py-2 scrollbar-hide">
        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl backdrop-saturate-150 p-1.5 rounded-full border border-zinc-200 dark:border-white/10 shadow-sm flex gap-1">
          {Object.values(DemoMode).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setSelectedMode(mode);
                setEditorText("");
              }}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                selectedMode === mode
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md transform scale-105'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              {MODE_LABELS[lang][mode]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* ---------------- LEFT CARD: DEMO VISUALIZER ---------------- */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 overflow-hidden flex flex-col h-[420px] relative group transition-transform duration-700">
           {/* Header */}
           <div className="h-12 border-b border-zinc-100 dark:border-white/5 bg-white/40 dark:bg-white/5 flex items-center justify-between px-6">
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">{ui.analysis}</span>
           </div>

           {/* Content Area */}
           <div className="flex-1 p-8 flex flex-col justify-center relative bg-zinc-50/50 dark:bg-black/20">
              
              {/* Bubble */}
              <div className="relative z-10 mb-4 transition-all duration-500" key={selectedMode}>
                 <div className="bg-blue-50/80 dark:bg-blue-500/20 backdrop-blur-md p-6 rounded-2xl rounded-tl-none shadow-sm border border-blue-100 dark:border-blue-500/10">
                    <div className="flex items-start gap-4">
                       <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                         animStage === 1 ? 'bg-blue-500 animate-pulse' : 'bg-blue-200 dark:bg-blue-500/40'
                       }`}>
                          <Mic className={`w-4 h-4 ${animStage === 1 ? 'text-white' : 'text-blue-600 dark:text-blue-100'}`} />
                       </div>
                       
                       <div className="text-base md:text-lg leading-relaxed text-zinc-700 dark:text-blue-50 font-medium min-h-[3.5rem]">
                          {animStage >= 2 ? (
                             scenario.renderDiff(lang, animStage >= 3)
                          ) : (
                             <span>
                               {displayedRaw}
                               {animStage === 1 && <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 animate-blink align-middle" />}
                             </span>
                          )}
                       </div>
                    </div>
                 </div>
                 {/* Tail */}
                 <div className="absolute -left-1.5 top-4 w-4 h-4 bg-blue-50/80 dark:bg-blue-500/20 rotate-45 rounded-sm border-l border-b border-blue-100 dark:border-blue-500/10 z-0 backdrop-blur-md"></div>
              </div>

              {/* Arrow & Label */}
              <div className={`flex justify-end pr-10 transition-all duration-500 transform ${animStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                 <div className="flex flex-col items-center">
                    <div className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-lg mb-1">
                       {MODE_LABELS[lang][selectedMode]}
                    </div>
                    <svg width="20" height="20" viewBox="0 0 50 50" fill="none" className="text-blue-500 rotate-12">
                       <path d="M25 5 C 25 20, 20 35, 10 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                       <path d="M10 40 L 20 38 M 10 40 L 14 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                 </div>
              </div>

              {/* Final Result */}
              <div className={`mt-2 bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 p-5 rounded-xl shadow-xl transition-all duration-700 transform ${animStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                 <div className="text-zinc-800 dark:text-zinc-200 text-base leading-relaxed whitespace-pre-wrap">
                    {scenario.clean}
                 </div>
              </div>

           </div>
        </div>


        {/* ---------------- RIGHT CARD: USER INTERACTION ---------------- */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 overflow-hidden flex flex-col h-[420px] relative group transition-transform duration-700">
           {/* Header */}
           <div className="h-12 border-b border-zinc-100 dark:border-white/5 bg-white/40 dark:bg-white/5 flex items-center justify-between px-6">
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-400/80 shadow-sm"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80 shadow-sm"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-400/80 shadow-sm"></div>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">Editor</span>
           </div>

           {/* Content Area */}
           <div className="flex-1 p-8 relative bg-white/50 dark:bg-black/20">
              
              {/* Instruction / Reading Area - Remains visible until edited result appears */}
              {!editorText && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700 pointer-events-none">
                   
                  {/* Header - Hides when recording to focus on text */}
                  <div className={`transition-all duration-500 flex flex-col items-center ${isRecording ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100 mb-6'}`}>
                    <div className="bg-zinc-100 dark:bg-white/10 px-4 py-2 rounded-xl mb-3 backdrop-blur-sm">
                      <Keyboard className="w-6 h-6 text-zinc-400" />
                    </div>
                    <h3 className="text-zinc-900 dark:text-white font-medium mb-1">
                      {ui.tryIt}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                      {ui.pressMic}
                    </p>
                  </div>

                  {/* Example Text Card */}
                  <div className={`
                      relative px-6 py-4 rounded-2xl border transition-all duration-500 ease-out flex flex-col items-center max-w-xs md:max-w-sm
                      ${isRecording 
                        ? 'bg-blue-50/90 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30 scale-110 shadow-xl backdrop-blur-md' 
                        : 'bg-white/80 dark:bg-black/40 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 shadow-sm backdrop-blur-md'
                      }
                   `}>
                      <p className={`text-sm md:text-base font-medium italic transition-colors duration-300 leading-relaxed ${isRecording ? 'text-blue-700 dark:text-blue-100' : ''}`}>
                        "{scenario.raw}"
                      </p>
                      
                      {/* Active Recording Indicator */}
                      {isRecording && (
                          <div className="mt-3 flex items-center gap-2 text-blue-600 dark:text-blue-300 animate-in fade-in slide-in-from-top-2">
                             <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                             </span>
                             <span className="text-xs font-bold uppercase tracking-wider">{ui.listening}</span>
                          </div>
                      )}
                   </div>
                </div>
              )}

              {/* Editor Output */}
              {editorText && (
                <div className="h-full flex flex-col">
                   <div className="text-lg text-zinc-800 dark:text-zinc-200 font-light leading-relaxed animate-in fade-in duration-300 whitespace-pre-wrap">
                      {editorText}
                      <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 animate-blink align-middle" />
                   </div>
                </div>
              )}

              {/* Floating Action Button */}
              <div className="absolute bottom-8 right-8 z-20">
                <button
                   onClick={handleMicClick}
                   disabled={isRecording}
                   className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-500 ease-out ${
                     isRecording 
                       ? 'bg-red-500 scale-110 shadow-red-500/30' 
                       : 'bg-zinc-900 dark:bg-white hover:scale-110 hover:-translate-y-1 shadow-zinc-900/20 dark:shadow-white/10'
                   }`}
                >
                   <Mic className={`w-6 h-6 transition-colors duration-300 ${isRecording ? 'text-white' : 'text-white dark:text-black'}`} />
                </button>
              </div>

              {/* Clear Button */}
              {editorText && !isRecording && (
                <div className="absolute bottom-8 left-8 z-20">
                   <button 
                     onClick={() => setEditorText("")}
                     className="text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 flex items-center gap-1.5 transition-colors bg-white/80 dark:bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 hover:border-zinc-300"
                   >
                      <RefreshCw className="w-3 h-3" />
                      {ui.reset}
                   </button>
                </div>
              )}

           </div>
        </div>

      </div>
    </div>
  );
};