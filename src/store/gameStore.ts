import { create } from 'zustand';

interface Insult {
  id: string;
  content: string;
  language: string;
  timestamp: number;
}

interface Round {
  playerInsult?: Insult;
  aiInsult?: Insult;
  playerScore?: number;
  aiScore?: number;
  winner?: 'player' | 'ai' | 'tie';
}

interface GameState {
  currentRound: number;
  maxRounds: number;
  rounds: Round[];
  gameStatus: 'idle' | 'playing' | 'finished';
  winner?: 'player' | 'ai';
  playerScore: number;
  aiScore: number;

  // Actions
  startGame: () => void;
  submitPlayerInsult: (insult: Omit<Insult, 'id' | 'timestamp'>) => Promise<void>;
  resetGame: () => void;
}

const useGameStore = create<GameState>((set, get) => ({
  currentRound: 1,
  maxRounds: 3,
  rounds: [],
  gameStatus: 'idle',
  playerScore: 0,
  aiScore: 0,

  startGame: () => {
    set({
      currentRound: 1,
      rounds: [],
      gameStatus: 'playing',
      playerScore: 0,
      aiScore: 0,
      winner: undefined,
    });
  },

  submitPlayerInsult: async (insult) => {
    const state = get();
    if (state.gameStatus !== 'playing') return;

    const newInsult: Insult = {
      ...insult,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    // Get AI response from API
    const response = await fetch('/api/ai-insult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerInsult: newInsult,
        language: insult.language,
      }),
    });

    const { aiInsult, scores, winner } = await response.json();

    const updatedRounds = [...state.rounds];
    updatedRounds[state.currentRound - 1] = {
      playerInsult: newInsult,
      aiInsult: aiInsult,
      playerScore: scores.player,
      aiScore: scores.ai,
      winner,
    };

    const newPlayerScore = state.playerScore + scores.player;
    const newAiScore = state.aiScore + scores.ai;
    const isFinalRound = state.currentRound === state.maxRounds;

    let gameWinner: 'player' | 'ai' | undefined;
    if (isFinalRound) {
      if (newPlayerScore > newAiScore) {
        gameWinner = 'player';
      } else if (newAiScore > newPlayerScore) {
        gameWinner = 'ai';
      } else {
        gameWinner = 'player'; // Tie goes to player for now
      }
    }

    set({
      rounds: updatedRounds,
      playerScore: newPlayerScore,
      aiScore: newAiScore,
      currentRound: isFinalRound ? state.currentRound : state.currentRound + 1,
      gameStatus: isFinalRound ? 'finished' : 'playing',
      winner: gameWinner,
    });
  },

  resetGame: () => {
    set({
      currentRound: 1,
      rounds: [],
      gameStatus: 'idle',
      playerScore: 0,
      aiScore: 0,
      winner: undefined,
    });
  },
}));

export default useGameStore;
