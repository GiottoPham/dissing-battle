import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

interface AIInsultRequest {
  playerInsult: {
    content: string;
    language: string;
  };
  language: string;
}

interface AIInsultResponse {
  aiInsult: {
    id: string;
    content: string;
    language: string;
    timestamp: number;
  };
  scores: {
    player: number;
    ai: number;
  };
  winner: 'player' | 'ai' | 'tie';
}

// GLM API configuration
const GLM_API_KEY = process.env.GLM_API_KEY;
const GLM_API_URL = process.env.GLM_API_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';

// Generate AI insult using Vercel AI SDK with GLM
async function generateAIInsult(playerInsult: string, language: string): Promise<string> {
  if (!GLM_API_KEY) {
    // Fallback to pre-defined insults if no API key
    return getFallbackInsult(language);
  }

  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Generate a creative, clever insult in ${language} as a response to: "${playerInsult}".

Requirements:
- Be creative, not vulgar
- Use ${language} cultural context
- Keep it under 50 words
- Make it witty and clever
- ${language === 'vietnamese' ? 'Use chợ búa style (mày tao, not cậu tớ)' : ''}

Only return the insult, no explanations.`,
      maxTokens: 100,
    });

    return text.trim();
  } catch (error) {
    console.error('Error generating AI insult:', error);
    return getFallbackInsult(language);
  }
}

// Score insults using GLM API
async function scoreInsults(playerInsult: string, aiInsult: string, language: string): Promise<{ player: number; ai: number }> {
  if (!GLM_API_KEY) {
    // Fallback to simple scoring if no API key
    return {
      player: calculateFallbackScore(playerInsult),
      ai: calculateFallbackScore(aiInsult),
    };
  }

  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Score these two insults on creativity (1-100) and provide JSON output:

Player insult: "${playerInsult}"
AI insult: "${aiInsult}"
Language: ${language}

Requirements:
- Score based on creativity, wit, and originality
- Range: 1-100
- ${language === 'vietnamese' ? 'Chợ búa style should get bonus points' : ''}

Return only JSON format:
{
  "player": <score>,
  "ai": <score>
}`,
      maxTokens: 200,
    });

    const scores = JSON.parse(text.trim());
    return {
      player: Math.min(100, Math.max(1, scores.player || 50)),
      ai: Math.min(100, Math.max(1, scores.ai || 50)),
    };
  } catch (error) {
    console.error('Error scoring insults:', error);
    return {
      player: calculateFallbackScore(playerInsult),
      ai: calculateFallbackScore(aiInsult),
    };
  }
}

// Fallback insults for when API is unavailable
const FALLBACK_INSULTS: Record<string, string[]> = {
  english: [
    "You're not the sharpest tool in the shed - you're not even a tool",
    "If ignorance was a sport, you'd be a world champion",
    "You're so slow, you'd get passed by a statue",
  ],
  vietnamese: [
    "Đúng là phế vật từ trên trời rơi xuống",
    "Trí tuệ của mày không đến nỗi, chỉ là nó không tồn tại",
    "Mày sinh ra là để cho thiên hạ cười đấy",
  ],
  french: [
    "Tu es plus stupide qu'une porte en plastique",
    "Ton cerveau est en vacances permanent",
  ],
  russian: [
    "Ты глупее чем кирпич",
    "Твой мозг — это декоративный элемент",
  ],
  chinese: [
    "你脑子里装的是浆糊吗",
    "你的人生就是个笑话",
  ],
  korean: [
    "너 머리는 장식용이구나",
    "너는 태어나서 웃음거리가 됐어",
  ],
};

function getFallbackInsult(language: string): string {
  const insults = FALLBACK_INSULTS[language.toLowerCase()] || FALLBACK_INSULTS.english;
  return insults[Math.floor(Math.random() * insults.length)];
}

// Simple fallback scoring
function calculateFallbackScore(insult: string): number {
  let score = 50; // Base score
  if (insult.length > 50) score += 10;
  if (insult.length > 100) score += 5;
  const uniqueWords = new Set(insult.toLowerCase().split(/\s+/)).size;
  score += uniqueWords * 2;
  return Math.min(100, score);
}

export async function POST(req: NextRequest) {
  const body: AIInsultRequest = await req.json();
  const { playerInsult } = body;

  // Generate AI insult in the same language
  const aiContent = await generateAIInsult(playerInsult.content, playerInsult.language);

  // Calculate scores
  const scores = await scoreInsults(playerInsult.content, aiContent, playerInsult.language);

  // Determine winner
  let winner: 'player' | 'ai' | 'tie' = 'tie';
  if (scores.player > scores.ai) winner = 'player';
  else if (scores.ai > scores.player) winner = 'ai';

  const response: AIInsultResponse = {
    aiInsult: {
      id: Math.random().toString(36).substr(2, 9),
      content: aiContent,
      language: playerInsult.language,
      timestamp: Date.now(),
    },
    scores,
    winner,
  };

  return NextResponse.json(response);
}
