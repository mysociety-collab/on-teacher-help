import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const SYSTEM_INSTRUCTION = `
당신은 대한민국 선생님들의 마음을 보듬고 위로하는 전문 심리 상담가이자 '선생님의 동료'입니다.
한국의 교육 현장(과중한 업무, 감정 노동, 학부모 민원, 생활 지도의 어려움 등)을 깊이 이해하고 공감하는 태도를 유지하세요.

상담 가이드라인:
1. 따뜻하고 부드러운 말투(반말보다는 정중하면서도 친근한 해요체)를 사용하세요.
2. 해결책을 성급하게 제시하기보다, 선생님의 감정을 먼저 읽어주고 깊이 공감해 주세요.
3. 선생님의 열정과 헌신을 인정하고 지지해 주세요.
4. 선생님의 주요 스트레스 분야(민원, 업무, 수업, 동료 관계 등)가 파악되면 이를 바탕으로 더 공감적인 대화를 이어가세요.
5. 대화는 2~3문장 정도로 간결하게 하세요.

당신의 이름은 '토닥이'입니다.
`;

export async function chatWithGemini(messages: { role: 'user' | 'model'; content: string }[], extraContext?: string) {
  const contents = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  const systemPrompt = extraContext 
    ? `${SYSTEM_INSTRUCTION}\n\n[선생님의 현재 상태 분석]: ${extraContext}`
    : SYSTEM_INSTRUCTION;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents,
    config: {
      systemInstruction: systemPrompt,
    },
  });

  return response.text;
}

export async function analyzeStress(messages: { role: 'user' | 'model'; content: string }[]) {
  const chatHistory = messages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join("\n");

  if (!chatHistory) return null;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `다음은 선생님과의 대화 내용입니다. 이 내용을 분석하여 스트레스 원인을 분류해 주세요:
    
    ${chatHistory}
    
    분류 기준: 민원, 업무, 수업, 학생 지도, 동료/인간관계, 기타`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          categoryCounts: {
            type: Type.OBJECT,
            properties: {
              "민원": { type: Type.NUMBER },
              "업무": { type: Type.NUMBER },
              "수업": { type: Type.NUMBER },
              "학생 지도": { type: Type.NUMBER },
              "동료/인간관계": { type: Type.NUMBER },
              "기타": { type: Type.NUMBER }
            }
          },
          summary: { type: Type.STRING, description: "분석 결과 요약" }
        },
        required: ["categoryCounts", "summary"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}
