'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '@/store/gameStore';
import GameCard from '@/components/GameCard';
import { Card, CardType, Player } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card as UICard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function Home() {
  const {
    status,
    currentRound,
    totalRounds,
    rounds,
    publicOpinion,
    playerHand,
    aiHand,
    selectedPlayerCard,
    selectedAiCard,
    winner,
    aiThinking,
    aiReasoning,
    dramaContext,
    startGame,
    selectCard,
    commitCard,
    nextRound,
    resetGame,
  } = useGameStore();

  const TYPE_COLORS = {
    evidence: 'bg-red-500',
    satire: 'bg-yellow-500',
    sentiment: 'bg-green-500',
  };

  const TYPE_NAMES = {
    evidence: 'Bằng Chứng',
    satire: 'Châm Biếm',
    sentiment: 'Văn Mẫu',
  };

  if (status === 'idle') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
        <UICard className="max-w-3xl w-full p-8 bg-white/10 backdrop-blur-xl border-white/20">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
              🔥 DRAMA DISSING BATTLE 🔥
            </h1>
            <p className="text-white text-xl mb-8">
              Đại Chiến Bóc Phốt - Mỗi trận là một drama mới!
            </p>

            <div className="bg-black/30 rounded-xl p-6 mb-8 text-left">
              <h2 className="text-2xl font-bold mb-4 text-orange-400">📜 Luật Chơi</h2>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">Bạn: Người Bóc Phốt</h3>
                  <ul className="space-y-2 text-white/90 text-sm">
                    <li>• <span className="text-red-400 font-bold">Bằng Chứng</span> (Đỏ) ➡️ Khắc chế Châm Biếm</li>
                    <li>• <span className="text-yellow-400 font-bold">Châm Biếm</span> (Vàng) ➡️ Khắc chế Văn Mẫu</li>
                    <li>• <span className="text-green-400 font-bold">Văn Mẫu</span> (Xanh) ➡️ Khắc chế Bằng Chứng</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-2">AI: Kẻ Bênh Vực Mù Quáng</h3>
                  <ul className="space-y-2 text-white/90 text-sm">
                    <li>• Mỗi bên có 5 lá bài, nhìn thấy bài đối phương</li>
                    <li>• Thắng kéo dư luận về phía mình</li>
                    <li>• Chạm mốc 0% hoặc 100% thì thắng luôn</li>
                    <li>• AI sinh drama ngẫu nhiên mỗi trận</li>
                  </ul>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-4 border border-orange-400/50">
                <p className="text-white text-center">
                  💡 Mỗi trận đấu sẽ có một <span className="font-bold text-orange-400">DRAMA NGẪU NHIÊN</span> với bối cảnh và thẻ bài riêng biệt!
                </p>
              </div>
            </div>

            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 text-white font-bold text-xl px-12 py-6 hover:scale-105 transition-transform"
            >
              🚀 BẮT ĐẦU TRANH CHIẾN
            </Button>
          </motion.div>
        </UICard>
      </div>
    );
  }

  if (status === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="text-center"
        >
          <div className="text-8xl mb-8">🎭</div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Đang tạo DRAMA...
          </h2>
          <p className="text-white/80 text-xl">
            AI đang tìm scandal ngẫu nhiên để bạn bóc phốt
          </p>
        </motion.div>
      </div>
    );
  }

  if (status === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
        <UICard className="max-w-5xl w-full p-8 bg-white/10 backdrop-blur-xl border-white/20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">
              {winner === 'player' ? '🏆 NGƯỜI BÓC PHỐT THẮNG! 🏆' :
               winner === 'ai' ? '🤖 KẺ BÊNH VỰC THẮNG! 🤖' :
               '🤝 HÒA! 🤝'}
            </h1>

            {/* Drama Context Summary */}
            {dramaContext && (
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-6 mb-6 border-2 border-orange-400/50">
                <div className="text-6xl mb-4 text-center">{dramaContext.emoji}</div>
                <h3 className="text-3xl font-bold text-orange-400 mb-2">{dramaContext.title}</h3>
                <p className="text-white/90 text-lg mb-2">{dramaContext.description}</p>
                <p className="text-white/70">
                  <span className="font-bold">Kẻ gây drama:</span> {dramaContext.villain}
                  {dramaContext.victim && (
                    <span> • <span className="font-bold">Nạn nhân:</span> {dramaContext.victim}</span>
                  )}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border-2 border-yellow-400/50">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">Người Bóc Phốt</h3>
                <p className="text-5xl font-bold text-white">{100 - publicOpinion}%</p>
                <p className="text-white/70 mt-2">Dư Luận</p>
              </div>
              <div className="bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-xl p-6 border-2 border-red-400/50">
                <h3 className="text-2xl font-bold text-red-400 mb-2">Kẻ Bênh Vực</h3>
                <p className="text-5xl font-bold text-white">{publicOpinion}%</p>
                <p className="text-white/70 mt-2">Dư Luận</p>
              </div>
            </div>

            <div className="space-y-4 mb-8 text-left max-h-96 overflow-y-auto">
              <h2 className="text-2xl font-bold text-center text-white mb-4">📊 Lịch Sử Trận Đấu</h2>
              {rounds.map((round, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/30 rounded-xl p-4 border border-white/20"
                >
                  <div className="flex justify-between items-center mb-3">
                    <Badge className={round.winner === 'player' ? 'bg-yellow-500' : round.winner === 'ai' ? 'bg-red-500' : 'bg-gray-500'}>
                      Hiệp {index + 1}
                    </Badge>
                    <span className="text-white font-bold">
                      {round.winner === 'player' ? 'Người Bóc Phốt thắng!' :
                       round.winner === 'ai' ? 'Kẻ Bênh Vực thắng!' :
                       'Hòa!'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-white/70 mb-1">Người Bóc Phốt</div>
                      <div className="bg-yellow-500/20 rounded-lg p-3 border border-yellow-400/30">
                        <div className="text-white font-bold">{round.playerCard?.name}</div>
                        <div className="text-white/70 text-sm">{round.playerCard?.description}</div>
                        {round.playerDialogue && (
                          <div className="mt-2 text-sm text-yellow-300 italic">"{round.playerDialogue}"</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/70 mb-1">Kẻ Bênh Vực</div>
                      <div className="bg-red-500/20 rounded-lg p-3 border border-red-400/30">
                        <div className="text-white font-bold">{round.aiCard?.name}</div>
                        <div className="text-white/70 text-sm">{round.aiCard?.description}</div>
                        {round.aiDialogue && (
                          <div className="mt-2 text-sm text-red-300 italic">"{round.aiDialogue}"</div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              onClick={resetGame}
              size="lg"
              className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 text-white font-bold text-xl px-12 py-6 hover:scale-105 transition-transform"
            >
              🔄 CHƠI DRAMA KHÁC
            </Button>
          </motion.div>
        </UICard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Drama Context Header */}
        <AnimatePresence>
          {dramaContext && status === 'playing' && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-xl p-6 mb-6 border-2 border-orange-400/50 backdrop-blur-xl"
            >
              <div className="flex items-center gap-4">
                <div className="text-6xl">{dramaContext.emoji}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-orange-400 mb-1">{dramaContext.title}</h2>
                  <p className="text-white/90 mb-1">{dramaContext.description}</p>
                  <p className="text-white/70 text-sm">
                    <span className="font-bold">Kẻ gây drama:</span> {dramaContext.villain}
                    {dramaContext.victim && (
                      <span> • <span className="font-bold">Nạn nhân:</span> {dramaContext.victim}</span>
                    )}
                  </p>
                </div>
                <Badge className="bg-orange-500 text-lg px-4 py-2">{dramaContext.dramaType}</Badge>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
            🔥 HIỆP {currentRound}/{totalRounds} 🔥
          </h1>
        </div>

        {/* Public Opinion Bar */}
        <div className="bg-black/30 backdrop-blur-xl rounded-xl p-6 mb-6 border-2 border-white/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-yellow-400 font-bold">Người Bóc Phốt</span>
            <span className="text-2xl font-bold text-white">{publicOpinion.toFixed(0)}%</span>
            <span className="text-red-400 font-bold">Kẻ Bênh Vực</span>
          </div>
          <Progress value={publicOpinion} className="h-4" />
          <div className="flex justify-between text-sm text-white/70 mt-1">
            <span>0% (Người Bóc Phốt thắng)</span>
            <span>100% (Kẻ Bênh Vực thắng)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Player Side */}
          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">🎭 Người Bóc Phốt</h2>
            <div className="bg-black/30 backdrop-blur-xl rounded-xl p-6 border-2 border-yellow-400/50">
              <div className="grid grid-cols-3 gap-3 justify-items-center">
                {playerHand.map((card) => (
                  <GameCard
                    key={card.id}
                    card={card}
                    selected={selectedPlayerCard?.id === card.id}
                    disabled={status === 'revealed'}
                    onClick={() => selectCard(card)}
                  />
                ))}
              </div>

              {status === 'playing' && selectedPlayerCard && (
                <Button
                  onClick={commitCard}
                  disabled={aiThinking}
                  className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-6 hover:scale-105 transition-transform"
                  size="lg"
                >
                  {aiThinking ? '⏳ Đối phương đang nghĩ...' : '🚀 ĐÁNH THẺ'}
                </Button>
              )}
            </div>
          </div>

          {/* AI Side */}
          <div>
            <h2 className="text-2xl font-bold text-red-400 mb-4 text-center">🤖 Kẻ Bênh Vực Mù Quáng</h2>
            <div className="bg-black/30 backdrop-blur-xl rounded-xl p-6 border-2 border-red-400/50">
              <div className="grid grid-cols-3 gap-3 justify-items-center">
                {aiHand.map((card) => (
                  <GameCard
                    key={card.id}
                    card={card}
                    disabled={true}
                    showCard={true}
                  />
                ))}
              </div>

              {aiThinking && (
                <div className="mt-4 text-center">
                  <div className="animate-pulse text-white text-lg">
                    🤔 Kẻ Bênh Vực đang tính toán chiến thuật...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reveal Phase */}
        <AnimatePresence>
          {status === 'revealed' && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mt-8"
            >
              <UICard className="bg-black/30 backdrop-blur-xl border-2 border-white/20 p-6">
                <h3 className="text-2xl font-bold text-center text-white mb-4">📜 KẾT QUẢ HIỆP ĐẤU</h3>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-yellow-500/20 rounded-xl p-4 border border-yellow-400/50">
                    <h4 className="text-lg font-bold text-yellow-400 mb-2">Người Bóc Phốt</h4>
                    {rounds[currentRound - 1]?.playerCard && (
                      <>
                        <GameCard
                          card={rounds[currentRound - 1].playerCard!}
                          size="small"
                          disabled={true}
                        />
                        {rounds[currentRound - 1].playerDialogue && (
                          <div className="mt-3 bg-yellow-500/30 rounded-lg p-3 text-center">
                            <div className="text-white text-lg font-bold">"{rounds[currentRound - 1].playerDialogue}"</div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="bg-red-500/20 rounded-xl p-4 border border-red-400/50">
                    <h4 className="text-lg font-bold text-red-400 mb-2">Kẻ Bênh Vực</h4>
                    {rounds[currentRound - 1]?.aiCard && (
                      <>
                        <GameCard
                          card={rounds[currentRound - 1].aiCard!}
                          size="small"
                          disabled={true}
                        />
                        {rounds[currentRound - 1].aiDialogue && (
                          <div className="mt-3 bg-red-500/30 rounded-lg p-3 text-center">
                            <div className="text-white text-lg font-bold">"{rounds[currentRound - 1].aiDialogue}"</div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <Badge
                    className={
                      rounds[currentRound - 1]?.winner === 'player'
                        ? 'bg-yellow-500 text-lg px-6 py-2'
                        : rounds[currentRound - 1]?.winner === 'ai'
                        ? 'bg-red-500 text-lg px-6 py-2'
                        : 'bg-gray-500 text-lg px-6 py-2'
                    }
                  >
                    {rounds[currentRound - 1]?.winner === 'player'
                      ? '🏆 Người Bóc Phốt thắng!'
                      : rounds[currentRound - 1]?.winner === 'ai'
                      ? '🤖 Kẻ Bênh Vực thắng!'
                      : '🤝 Hòa!'}
                  </Badge>
                </div>

                {aiReasoning && (
                  <div className="mt-4 bg-white/10 rounded-lg p-4">
                    <div className="text-sm text-white/70 mb-1">Lý do Kẻ Bênh Vực:</div>
                    <div className="text-white italic">"{aiReasoning}"</div>
                  </div>
                )}

                {currentRound < totalRounds && (
                  <Button
                    onClick={nextRound}
                    className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 hover:scale-105 transition-transform"
                    size="lg"
                  >
                    ➡️ TIẾP TỤC HIỆP {currentRound + 1}
                  </Button>
                )}
              </UICard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
