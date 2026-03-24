import { create } from 'zustand';
import { GameState, Player, Round, Card, getWinner, SCORE_CHANGE, DramaContext } from '@/types/game';

const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  status: 'idle',
  currentRound: 0,
  totalRounds: 5,
  rounds: [],
  publicOpinion: 50,
  playerHand: [],
  aiHand: [],
  selectedPlayerCard: undefined,
  selectedAiCard: undefined,
  winner: undefined,
  finalScore: undefined,
  aiThinking: false,
  aiReasoning: undefined,
  dramaContext: undefined,

  generateDrama: async () => {
    set({ status: 'generating' });

    try {
      const response = await fetch('/api/generate-drama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const { dramaContext, playerCards, aiCards } = await response.json();

      set({
        dramaContext,
        playerHand: playerCards,
        aiHand: aiCards,
        status: 'playing',
        currentRound: 1,
        rounds: [],
        publicOpinion: 50,
        selectedPlayerCard: undefined,
        selectedAiCard: undefined,
        winner: undefined,
        finalScore: undefined,
        aiThinking: false,
        aiReasoning: undefined,
      });
    } catch (error) {
      console.error('Error generating drama:', error);
      set({ status: 'idle' });
    }
  },

  startGame: () => {
    // Trigger drama generation
    get().generateDrama();
  },

  selectCard: (card: Card) => {
    set({ selectedPlayerCard: card });
  },

  commitCard: async () => {
    const state = get();
    if (!state.selectedPlayerCard || state.status !== 'playing') return;

    set({ aiThinking: true });

    try {
      // Get AI response from API
      const response = await fetch('/api/ai-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'move',
          playerCard: state.selectedPlayerCard,
          aiHand: state.aiHand,
          round: state.currentRound,
          publicOpinion: state.publicOpinion,
          dramaContext: state.dramaContext,
        }),
      });

      const { selectedCard, reasoning, dialogue } = await response.json();

      // Get player dialogue from AI
      const dialogueResponse = await fetch('/api/ai-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'dialogue',
          playerCard: state.selectedPlayerCard,
          aiCard: selectedCard,
          round: state.currentRound,
          dramaContext: state.dramaContext,
        }),
      });

      const { dialogue: playerDialogue } = await dialogueResponse.json();

      const playerCard = state.selectedPlayerCard;
      const aiCard = selectedCard;

      // Remove played cards from hands
      const newPlayerHand = state.playerHand.filter(c => c.id !== playerCard.id);
      const newAiHand = state.aiHand.filter(c => c.id !== aiCard.id);

      // Determine winner
      const winner = getWinner(playerCard, aiCard);

      // Calculate score change
      let scoreChange = 0;
      if (winner === 'player') {
        // Player wins, move bar towards player (lower number)
        scoreChange = -(SCORE_CHANGE.WIN + (playerCard.weight * SCORE_CHANGE.WEIGHT_MULTIPLIER));
      } else if (winner === 'ai') {
        // AI wins, move bar towards AI (higher number)
        scoreChange = SCORE_CHANGE.WIN + (aiCard.weight * SCORE_CHANGE.WEIGHT_MULTIPLIER);
      }
      // Tie: no change

      // Update public opinion
      const newPublicOpinion = Math.max(0, Math.min(100, state.publicOpinion + scoreChange));

      // Create round
      const round: Round = {
        playerCard,
        aiCard,
        winner,
        scoreChange,
        playerDialogue,
        aiDialogue: dialogue,
      };

      const newRounds = [...state.rounds, round];

      // Check game end conditions
      const isFinalRound = state.currentRound >= state.totalRounds;
      const isInstantWin = newPublicOpinion <= 0 || newPublicOpinion >= 100;

      let gameStatus: 'idle' | 'generating' | 'playing' | 'revealed' | 'finished' = 'revealed';
      let gameWinner: Player | 'tie' | undefined = undefined;

      if (isInstantWin) {
        gameStatus = 'finished';
        gameWinner = newPublicOpinion <= 0 ? 'player' : 'ai';
      } else if (isFinalRound) {
        gameStatus = 'finished';
        if (newPublicOpinion < 50) {
          gameWinner = 'player';
        } else if (newPublicOpinion > 50) {
          gameWinner = 'ai';
        } else {
          gameWinner = 'tie';
        }
      }

      set({
        playerHand: newPlayerHand,
        aiHand: newAiHand,
        selectedPlayerCard: undefined,
        selectedAiCard: undefined,
        rounds: newRounds,
        publicOpinion: newPublicOpinion,
        status: gameStatus,
        winner: gameWinner,
        aiThinking: false,
        aiReasoning: reasoning,
        finalScore: gameStatus === 'finished' ? {
          player: 100 - newPublicOpinion,
          ai: newPublicOpinion,
        } : undefined,
      });
    } catch (error) {
      console.error('Error committing card:', error);
      set({ aiThinking: false });
    }
  },

  nextRound: () => {
    const state = get();
    if (state.status !== 'revealed') return;

    const nextRound = state.currentRound + 1;

    set({
      currentRound: nextRound,
      status: 'playing',
      selectedPlayerCard: undefined,
      selectedAiCard: undefined,
      aiReasoning: undefined,
    });
  },

  resetGame: () => {
    set({
      status: 'idle',
      currentRound: 0,
      rounds: [],
      publicOpinion: 50,
      playerHand: [],
      aiHand: [],
      selectedPlayerCard: undefined,
      selectedAiCard: undefined,
      winner: undefined,
      finalScore: undefined,
      aiThinking: false,
      aiReasoning: undefined,
      dramaContext: undefined,
    });
  },
}));

export default useGameStore;
