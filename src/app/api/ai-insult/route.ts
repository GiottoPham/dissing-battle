import { NextRequest, NextResponse } from 'next/server';

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

const AI_INSULTS: Record<string, string[]> = {
  english: [
    "Your IQ doesn't even have a decimal point",
    "You're not the sharpest tool in the shed - you're not even a tool",
    "Your family tree must be a circle",
    "If ignorance was a sport, you'd be a world champion",
    "You're so slow, you'd get passed by a statue",
  ],
  vietnamese: [
    "Đúng là phế vật từ trên trời rơi xuống",
    "Đầu cậu được thiết kế để trang trí thôi đúng không",
    "Trí tuệ của cậu không đến nỗi, chỉ là nó không tồn tại",
    "Cậu sinh ra là để cho thiên hạ cười đấy",
    "Não cậu chỉ có duy nhất một chức năng: phân chia không gian",
  ],
  french: [
    "Tu es plus stupide qu'une porte en plastique",
    "Ton cerveau est en vacances permanent",
    "Tu ressembles à quelqu'un qui a oublié comment vivre",
    "Ton existence est une blague qui n'a personne à qui raconter",
    "Tu es aussi inutile qu'un parachute en briques",
  ],
  russian: [
    "Ты глупее чем кирпич",
    "Твой мозг — это декоративный элемент",
    "Ты существуешь только для смеха других",
    "Твой интеллект равен нулю",
    "Ты живое доказательство эволюции в обратную сторону",
  ],
  chinese: [
    "你脑子里装的是浆糊吗",
    "你的人生就是个笑话",
    "你的智商欠费了",
    "你是天生的笑料",
    "你的大脑是摆设",
  ],
  korean: [
    "너 머리는 장식용이구나",
    "너는 태어나서 웃음거리가 됐어",
    "너 지능은 마이너스야",
    "너 인생이 개그잡이지",
    "너 뇌는 유지보수 불가능해",
  ],
};

const getRandomInsult = (language: string): string => {
  const insults = AI_INSULTS[language.toLowerCase()] || AI_INSULTS.english;
  return insults[Math.floor(Math.random() * insults.length)];
};

const calculateCreativityScore = (insult: string): number => {
  // Simple heuristic - in real app, use AI/ML
  let score = 50; // Base score

  // Bonus for length (up to a point)
  if (insult.length > 50) score += 10;
  if (insult.length > 100) score += 5;

  // Bonus for vocabulary diversity
  const uniqueWords = new Set(insult.toLowerCase().split(/\s+/)).size;
  score += uniqueWords * 2;

  // Cap at 100
  return Math.min(100, score);
};

export async function POST(req: NextRequest) {
  const body: AIInsultRequest = await req.json();
  const { playerInsult } = body;

  // Generate AI insult in the same language
  const aiContent = getRandomInsult(playerInsult.language);

  // Calculate scores
  const playerScore = calculateCreativityScore(playerInsult.content);
  const aiScore = calculateCreativityScore(aiContent);

  // Determine winner
  let winner: 'player' | 'ai' | 'tie' = 'tie';
  if (playerScore > aiScore) winner = 'player';
  else if (aiScore > playerScore) winner = 'ai';

  const response: AIInsultResponse = {
    aiInsult: {
      id: Math.random().toString(36).substr(2, 9),
      content: aiContent,
      language: playerInsult.language,
      timestamp: Date.now(),
    },
    scores: {
      player: playerScore,
      ai: aiScore,
    },
    winner,
  };

  return NextResponse.json(response);
}
