'use client';

import { useState } from 'react';
import useGameStore from '@/store/gameStore';

const LANGUAGES = [
  { code: 'english', name: 'English' },
  { code: 'vietnamese', name: 'Tiếng Việt' },
  { code: 'french', name: 'Français' },
  { code: 'russian', name: 'Русский' },
  { code: 'chinese', name: '中文' },
  { code: 'korean', name: '한국어' },
];

export default function Home() {
  const {
    currentRound,
    maxRounds,
    rounds,
    gameStatus,
    winner,
    playerScore,
    aiScore,
    startGame,
    submitPlayerInsult,
    resetGame,
  } = useGameStore();

  const [insult, setInsult] = useState('');
  const [language, setLanguage] = useState('english');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!insult.trim()) return;

    setIsSubmitting(true);
    try {
      await submitPlayerInsult({
        content: insult,
        language,
      });
      setInsult('');
    } catch (error) {
      console.error('Error submitting insult:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRoundData = rounds[currentRound - 1];

  if (gameStatus === 'idle') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🔥 BÃO BÙA KEO 🔥
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Battle of creative insults - AI vs You!
          </p>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3 text-purple-900">How to Play</h2>
            <ul className="text-left text-gray-700 space-y-2">
              <li>• 3 rounds - win 2 to be the champion</li>
              <li>• Submit your creative insult</li>
              <li>• AI will respond</li>
              <li>• Score based on creativity (1-100)</li>
              <li>• Multi-language support!</li>
            </ul>
          </div>
          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
          >
            🚀 START BATTLE
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <h1 className="text-5xl font-bold mb-4">
            {winner === 'player' ? '🏆 YOU WIN! 🏆' : '🤖 AI WINS! 🤖'}
          </h1>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-2xl font-bold text-purple-900">{playerScore}</p>
                <p className="text-gray-700">Your Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-900">{aiScore}</p>
                <p className="text-gray-700">AI Score</p>
              </div>
            </div>
            <div className="space-y-4 text-left">
              <h3 className="font-bold text-lg text-purple-900">Battle History</h3>
              {rounds.map((round, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow">
                  <p className="font-semibold mb-2">Round {index + 1}</p>
                  <p className="text-sm text-gray-700">
                    <strong>You:</strong> {round.playerInsult?.content} ({round.playerScore} pts)
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>AI:</strong> {round.aiInsult?.content} ({round.aiScore} pts)
                  </p>
                  <p className="text-sm font-semibold mt-2">
                    Winner: <span className={round.winner === 'player' ? 'text-green-600' : 'text-red-600'}>
                      {round.winner === 'player' ? 'You' : 'AI'}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={resetGame}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
          >
            🔄 PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  // Game in progress
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Round {currentRound}/{maxRounds}
          </h1>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-900">{playerScore}</p>
              <p className="text-sm text-gray-600">You</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-900">{aiScore}</p>
              <p className="text-sm text-gray-600">AI</p>
            </div>
          </div>
        </div>

        {!currentRoundData ? (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border-2 border-purple-300 rounded-xl focus:border-purple-600 focus:outline-none text-lg"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Your Creative Insult
              </label>
              <textarea
                value={insult}
                onChange={(e) => setInsult(e.target.value)}
                placeholder="Enter your insult in the selected language..."
                className="w-full p-4 border-2 border-purple-300 rounded-xl focus:border-purple-600 focus:outline-none text-lg min-h-[120px]"
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-1">
                {insult.length}/500 characters
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!insult.trim() || isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? '⏳ Processing...' : '🚀 SUBMIT INSULT'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="font-semibold text-lg mb-2 text-purple-900">👤 Your Insult</p>
                  <p className="text-gray-700 text-lg">{currentRoundData.playerInsult?.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Score: <span className="font-bold text-purple-600">{currentRoundData.playerScore}/100</span>
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="font-semibold text-lg mb-2 text-pink-900">🤖 AI Response</p>
                  <p className="text-gray-700 text-lg">{currentRoundData.aiInsult?.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Score: <span className="font-bold text-pink-600">{currentRoundData.aiScore}/100</span>
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xl font-bold">
                    {currentRoundData.winner === 'player' ? '🎉 You Win This Round!' :
                     currentRoundData.winner === 'ai' ? '🤖 AI Wins This Round!' :
                     '🤝 It\'s a Tie!'}
                  </p>
                </div>
              </div>
            </div>

            {gameStatus === 'playing' && (
              <button
                onClick={() => setInsult('')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
              >
                ➡️ NEXT ROUND
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
