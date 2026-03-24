import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { DramaContext, Card, CardType } from '@/types/game';

// Configure GLM API
const GLM_API_KEY = process.env.GLM_API_KEY;
const GLM_API_BASE_URL = process.env.GLM_API_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';

// Create GLM client
const glm = createOpenAI({
  baseURL: GLM_API_BASE_URL,
  apiKey: GLM_API_KEY,
});

// Zod schema for Drama Context
const dramaContextSchema = z.object({
  title: z.string().describe('Tiêu đề drama ngắn gọn, gây sốc'),
  description: z.string().describe('Mô tả chi tiết tình huống drama'),
  villain: z.string().describe('Tên kẻ gây drama'),
  victim: z.string().optional().describe('Tên nạn nhân (nếu có)'),
  dramaType: z.string().describe('Loại drama: tra nam, sếp quỵt lương, idol phông bạt, chủ nhà toxic, v.v.'),
  emoji: z.string().describe('Emoji đại diện cho drama này'),
});

// Zod schema for Card
const cardSchema = z.object({
  name: z.string().describe('Tên lá bài ngắn gọn, gây ấn tượng'),
  type: z.nativeEnum(CardType).describe('Loại thẻ: evidence, satire, sentiment'),
  weight: z.number().int().min(1).max(3).describe('Độ nặng: 1-3'),
  description: z.string().describe('Mô tả chi tiết nội dung lá bài'),
  emoji: z.string().describe('Emoji đại diện cho lá bài'),
  effect: z.string().optional().describe('Hiệu ứng đặc biệt của lá bài'),
});

// Zod schema for Cards Generation
const cardsGenerationSchema = z.object({
  playerCards: z.array(cardSchema).min(5).max(5).describe('5 lá bài cho Player'),
  aiCards: z.array(cardSchema).min(5).max(5).describe('5 lá bài cho AI'),
});

export async function POST(req: NextRequest) {
  if (!GLM_API_KEY) {
    return NextResponse.json(
      { error: 'GLM_API_KEY is not configured. Please add it to your environment variables.' },
      { status: 500 }
    );
  }

  try {
    // Step 1: Generate Drama Context
    const { object: dramaContext } = await generateObject({
      model: glm('glm-4-flash'),
      schema: dramaContextSchema,
      prompt: `Sinh ra một bối cảnh DRAMA NGẪU NHIÊN về đời sống, showbiz, hoặc workplace.

YÊU CẦU:
1. Chọn một trong các loại drama: tra nam cắm sừng, sếp quỵt lương, chủ nhà trọ toxic, idol phông bạt, bạn bẻ kèn, v.v.
2. Sinh ra kẻ gây drama (villain) và nạn nhân (nếu có)
3. Mô tả chi tiết tình huống drama trong 2-3 câu
4. Tiêu đề gây sốc, thu hút
5. Emoji đại diện cho drama

TRẢ VỀ JSON format:
{
  "title": "Tiêu đề",
  "description": "Mô tả chi tiết",
  "villain": "Tên kẻ gây drama",
  "victim": "Tên nạn nhân (nếu có)",
  "dramaType": "Loại drama",
  "emoji": "🎭"
}

Chỉ trả về JSON, không có text thêm.`,
      temperature: 0.8,
    });

    // Step 2: Generate Cards based on Drama Context
    const { object: cards } = await generateObject({
      model: glm('glm-4-flash'),
      schema: cardsGenerationSchema,
      prompt: `Sinh ra 10 LÁ BÀI CHIẾN THUẬT cho trận đấu DRAMA với bối cảnh:

DRAMA CONTEXT:
- Title: ${dramaContext.title}
- Description: ${dramaContext.description}
- Villain: ${dramaContext.villain}
- Type: ${dramaContext.dramaType}

YÊU CẦU CHO LÁ BÀI:

HỆ BẰNG CHỨNG (EVIDENCE - Màu Đỏ):
- Các bằng chứng thực tế liên quan đến drama này
- Ví dụ: Cap màn hình tin nhắn, Ghi âm, Hóa đơn, Ảnh check-in, Video, v.v.
- Khắc chế hệ Châm Biếm

HỆ CHÂM BIẾM (SATIRE - Màu Vàng):
- Các ngón đòn truyền thông/mạng xã hội
- Ví dụ: Ảnh chế meme, Nhại lại câu nói ngu ngốc, Đặt biệt danh hài hước, v.v.
- Khắc chế hệ Văn Mẫu

HỆ VĂN MẪU (SENTIMENT - Màu Xanh):
- Các lý lẽ ngụy biện, tẩy trắng
- Ví dụ: Khóc lóc kể khổ, Đổ lỗi hoàn cảnh, Gaslighting - thao túng tâm lý, v.v.
- Khắc chế hệ Bằng Chứng

QUY ĐỊNH:
- Sinh 5 lá bài cho Player (người bóc phốt)
- Sinh 5 lá bài cho AI (kẻ bênh vực mù quáng)
- Mỗi lá phải liên quan trực tiếp đến drama này
- Độ nặng (weight): 1-3 (3 là mạnh nhất)
- Tên lá bài ngắn gọn, gây ấn tượng
- Mô tả chi tiết nội dung
- Emoji đại diện phù hợp

TRẢ VỀ JSON format:
{
  "playerCards": [...5 lá bài cho player...],
  "aiCards": [...5 lá bài cho AI...]
}

Mỗi lá bài:
{
  "name": "Tên lá bài",
  "type": "evidence|satire|sentiment",
  "weight": 1-3,
  "description": "Mô tả chi tiết",
  "emoji": "🎯",
  "effect": "Hiệu ứng đặc biệt (nếu có)"
}

Chỉ trả về JSON, không có text thêm.`,
      temperature: 0.8,
    });

    // Add IDs to cards
    const playerCards: Card[] = cards.playerCards.map((card, index) => ({
      ...card,
      id: `player-${index}`,
    }));

    const aiCards: Card[] = cards.aiCards.map((card, index) => ({
      ...card,
      id: `ai-${index}`,
    }));

    const typedDramaContext: DramaContext = {
      title: dramaContext.title,
      description: dramaContext.description,
      villain: dramaContext.villain,
      victim: dramaContext.victim,
      dramaType: dramaContext.dramaType,
      emoji: dramaContext.emoji,
    };

    return NextResponse.json({
      dramaContext: typedDramaContext,
      playerCards,
      aiCards,
    });
  } catch (error) {
    console.error('Error generating drama:', error);
    return NextResponse.json(
      { error: 'Failed to generate drama', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
