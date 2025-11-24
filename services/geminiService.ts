import { GoogleGenAI } from "@google/genai";
import { DemoMode, Language } from '../types';

const getSystemInstruction = (mode: DemoMode, lang: Language): string => {
  const baseInstruction = `You are Villdo, an advanced voice-to-text refinement engine. 
  Your goal is to take raw, spoken transcriptions (which may include fillers like 'um', 'uh', repetitions, and informal grammar) 
  and transform them into perfectly polished text suitable for a specific context.`;

  let langInstruction = "";
  if (lang === 'zh') {
    langInstruction = "The user input will likely be in Chinese. You MUST output the refined text in Simplified Chinese.";
  } else if (lang === 'ja') {
    langInstruction = "The user input will likely be in Japanese. You MUST output the refined text in Japanese.";
  } else {
    langInstruction = "The user input will be in English. Output the refined text in English.";
  }

  switch (mode) {
    case DemoMode.PROFESSIONAL_EMAIL:
      return `${baseInstruction} ${langInstruction} Context: Professional Email. Tone: Formal, polite, concise. Fix grammar, remove fillers, structured properly.`;
    case DemoMode.SLACK_MESSAGE:
      return `${baseInstruction} ${langInstruction} Context: Slack/Teams Message. Tone: Casual but professional, direct, maybe use emojis if appropriate for a team update.`;
    case DemoMode.PERSONAL_NOTE:
      return `${baseInstruction} ${langInstruction} Context: Personal Notes/Journal. Tone: Neutral, organized, bullet points if applicable.`;
    case DemoMode.CODE_COMMENT:
      return `${baseInstruction} ${langInstruction} Context: Code Documentation. Tone: Technical, precise, concise.`;
    case DemoMode.CREATIVE_WRITING:
      return `${baseInstruction} ${langInstruction} Context: Creative Writing. Tone: Descriptive, flowing, evocative.`;
    default:
      return `${baseInstruction} ${langInstruction}`;
  }
};

export const transformText = async (input: string, mode: DemoMode, lang: Language): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key is missing");
      if (lang === 'zh') return "错误：缺少 API Key。";
      if (lang === 'ja') return "エラー：APIキーが見つかりません。";
      return "Error: API Key is missing.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: input,
      config: {
        systemInstruction: getSystemInstruction(mode, lang),
        temperature: 0.7,
      }
    });

    return response.text || (lang === 'zh' ? "无法生成响应。" : lang === 'ja' ? "応答を生成できませんでした。" : "Could not generate response.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (lang === 'zh') return "抱歉，暂时无法处理该请求。";
    if (lang === 'ja') return "申し訳ありませんが、現在リクエストを処理できません。";
    return "Sorry, I couldn't process that request right now.";
  }
};