'use client';

import { Card as CardType } from '@/types/game';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface GameCardProps {
  card: CardType;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  showCard?: boolean; // true = reveal card, false = card back
  size?: 'normal' | 'small';
}

const TYPE_COLORS = {
  evidence: 'from-red-500 to-red-700 border-red-400',
  satire: 'from-yellow-500 to-yellow-700 border-yellow-400',
  sentiment: 'from-green-500 to-green-700 border-green-400',
};

const TYPE_ICONS = {
  evidence: '🔨',
  satire: '✂️',
  sentiment: '🧻',
};

export default function GameCard({
  card,
  selected = false,
  disabled = false,
  onClick,
  showCard = true,
  size = 'normal',
}: GameCardProps) {
  const colorClass = TYPE_COLORS[card.type];

  if (!showCard) {
    return (
      <Card
        className={`
          relative overflow-hidden cursor-pointer transition-all
          bg-gradient-to-br from-gray-700 to-gray-900 border-gray-600
          ${size === 'small' ? 'h-24 w-16' : 'h-48 w-32'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        `}
        onClick={disabled ? undefined : onClick}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl text-gray-500 font-bold opacity-30">?</div>
        </div>
        <div className="absolute inset-0 border-4 border-gray-600 rounded-lg" />
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={selected ? { scale: 1.1, y: -10 } : {}}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`
          relative overflow-hidden cursor-pointer transition-all
          bg-gradient-to-br ${colorClass}
          ${size === 'small' ? 'h-24 w-16 p-2' : 'h-48 w-32 p-3'}
          ${selected ? 'ring-4 ring-white shadow-2xl' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          border-2 border-white/30
        `}
        onClick={disabled ? undefined : onClick}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-black/30 backdrop-blur-sm p-1">
          <div className="text-white text-xs font-bold truncate">
            {card.name}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center h-full pt-6 pb-8">
          <div className="text-3xl mb-2">{card.emoji}</div>
          <div className="text-white text-xs text-center leading-tight line-clamp-3">
            {card.description}
          </div>
        </div>

        {/* Footer - Type icon and weight */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-2">
          <div className="flex items-center justify-between text-white text-xs">
            <span>{TYPE_ICONS[card.type]}</span>
            <span className="font-bold">
              {card.weight}{' pts'}
            </span>
          </div>
        </div>

        {/* Effect badge */}
        {card.effect && size === 'normal' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 text-black text-xs px-2 py-1 rounded-full opacity-0 hover:opacity-100 transition-opacity">
            {card.effect}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
