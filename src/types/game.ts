export enum CardType {
  EVIDENCE = 'evidence', // Bằng Chứng - Màu Đỏ
  SATIRE = 'satire',     // Châm Biếm - Màu Vàng
  SENTIMENT = 'sentiment', // Văn Mẫu - Màu Xanh
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  weight: number; // 1-3
  description: string;
  emoji: string;
  effect?: string; // Special effect description
}

export interface DramaContext {
  title: string; // Tiêu đề drama
  description: string; // Mô tả chi tiết tình huống
  villain: string; // Kẻ gây drama (NPC)
  victim?: string; // Nạn nhân (nếu có)
  dramaType: string; // Loại drama (tra nam, sếp, idol, v.v.)
  emoji: string; // Emoji đại diện
}

export type Player = 'player' | 'ai';

export interface Round {
  playerCard?: Card;
  aiCard?: Card;
  winner?: Player | 'tie';
  scoreChange: number;
  playerDialogue?: string; // AI-generated dialogue for player
  aiDialogue?: string; // AI-generated dialogue for AI
}

export interface GameState {
  // Game state
  status: 'idle' | 'generating' | 'playing' | 'revealed' | 'finished';
  currentRound: number;
  totalRounds: number;
  rounds: Round[];

  // Drama context (dynamic per game)
  dramaContext?: DramaContext;

  // Public opinion bar (tug-of-war)
  publicOpinion: number; // 0-100, 50 is neutral

  // Hands
  playerHand: Card[];
  aiHand: Card[];

  // Selected cards (for reveal phase)
  selectedPlayerCard?: Card;
  selectedAiCard?: Card;

  // Results
  winner?: Player | 'tie';
  finalScore?: {
    player: number;
    ai: number;
  };

  // AI thinking state
  aiThinking: boolean;
  aiReasoning?: string;

  // Actions
  generateDrama: () => Promise<void>;
  startGame: () => void;
  selectCard: (card: Card) => void;
  commitCard: () => Promise<void>;
  nextRound: () => void;
  resetGame: () => void;
}

// Khắc chế: Bằng Chứng > Châm Biếm > Văn Mẫu > Bằng Chứng
export const TYPE_ADVANTAGE: Record<CardType, CardType> = {
  [CardType.EVIDENCE]: CardType.SATIRE,
  [CardType.SATIRE]: CardType.SENTIMENT,
  [CardType.SENTIMENT]: CardType.EVIDENCE,
};

export const TYPE_WEAKNESS: Record<CardType, CardType> = {
  [CardType.EVIDENCE]: CardType.SENTIMENT,
  [CardType.SATIRE]: CardType.EVIDENCE,
  [CardType.SENTIMENT]: CardType.SATIRE,
};

export const getWinner = (playerCard: Card, aiCard: Card): Player | 'tie' => {
  if (playerCard.type === aiCard.type) return 'tie';
  if (TYPE_ADVANTAGE[playerCard.type] === aiCard.type) return 'player';
  return 'ai';
};

export const SCORE_CHANGE = {
  WIN: 10, // Bonus for winning a round
  WEIGHT_MULTIPLIER: 5, // Points per weight point
};
