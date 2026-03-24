import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { Card, DramaContext, Player } from '@/types/game';

// Configure GLM API
const GLM_API_KEY = process.env.GLM_API_KEY;
const GLM_API_BASE_URL = process.env.GLM_API_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';

// Create GLM client
const glm = createOpenAI({
  baseURL: GLM_API_BASE_URL,
  apiKey: GLM_API_KEY,
});

// Zod schema for AI response
const aiResponseSchema = z.object({
  selectedCardId: z.string().describe('The ID of card to play'),
  reasoning: z.string().describe('Brief reasoning (1-2 sentences) why this card was chosen'),
  dialogue: z.string().describe('A provocative, dramatic dialogue line when revealing this card'),
});

// Zod schema for Player dialogue generation
const playerDialogueSchema = z.object({
  dialogue: z.string().describe('A sharp, dramatic dialogue line for player'),
});

interface AIMoveRequest {
  playerCard: Card;
  aiHand: Card[];
  round: number;
  publicOpinion: number;
  dramaContext?: DramaContext;
}

interface DialogueRequest {
  playerCard: Card;
  aiCard: Card;
  round: number;
  dramaContext?: DramaContext;
}

export async function POST(req: NextRequest) {
  const { action } = await req.json();

  if (action === 'move') {
    return handleAIMove(req);
  } else if (action === 'dialogue') {
    return handleDialogue(req);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

async function handleAIMove(req: NextRequest) {
  const body: AIMoveRequest = await req.json();
  const { playerCard, aiHand, round, publicOpinion, dramaContext } = body;

  // Format hand for AI
  const handDescription = aiHand.map((card, index) =>
    `${index + 1}. ${card.name} (${card.type}) - ${card.description} - Độ nặng: ${card.weight}`
  ).join('\n');

  try {
    const { object } = await generateObject({
      model: glm('glm-4-flash'),
      schema: aiResponseSchema,
      prompt: `Bạn là "Kẻ Bênh Vực Mù Quáng" - một fan cứng hoặc người thân đang bênh vực ${dramaContext?.villain || 'kẻ gây drama'} trước ${dramaContext?.dramaType || 'scandal này'}.

Bối cảnh Drama:
- Title: ${dramaContext?.title || 'Drama nặc danh'}
- Description: ${dramaContext?.description || ''}
- Villain: ${dramaContext?.villain || 'Người gây drama'}
- Victim: ${dramaContext?.victim || 'Nạn nhân'}

Hiệp đấu thứ ${round} / 5
- Thanh dư luận: ${publicOpinion}% (${publicOpinion > 50 ? 'lệch về phía Kẻ Bênh Vực (AI)' : publicOpinion < 50 ? 'lệch về phía Người Bóc Phốt (Player)' : 'cân bằng'})
- Đối phương vừa đánh: ${playerCard.name} (${playerCard.type}) - ${playerCard.description}

Bài trên tay bạn:
${handDescription}

YÊU CẦU:
1. Chọn 1 lá bài để đánh (trả về ID chính xác, không phải tên)
2. Phân tích kỹ:
   - Nếu bài đối phương là "Bằng Chứng" (EVIDENCE) -> chọn bài "Châm Biếm" (SATIRE) để khắc chế
   - Nếu bài đối phương là "Châm Biếm" (SATIRE) -> chọn bài "Văn Mẫu" (SENTIMENT) để khắc chế
   - Nếu bài đối phương là "Văn Mẫu" (SENTIMENT) -> chọn bài "Bằng Chứng" (EVIDENCE) để khắc chế
   - Nếu cùng hệ -> chọn bài có độ nặng cao nhất
3. Viết lý do ngắn gọn (1-2 câu) bằng tiếng Việt, dùng ngôn ngữ gay gắt, drama
4. Viết một câu dialogue cực gắt khi lật bài - kiểu tranh cãi gay gắt

TRẢ VỀ JSON format:
{
  "selectedCardId": "ID của bài đã chọn (ví dụ: ai-0, ai-1, ai-2, ai-3, ai-4)",
  "reasoning": "Lý do ngắn gọn",
  "dialogue": "Câu dialogue cực gắt"
}

Chỉ trả về JSON, không có text thêm.`,
      temperature: 0.7,
    });

    // Find selected card
    const selectedCard = aiHand.find(card => card.id === object.selectedCardId);

    if (!selectedCard) {
      // Fallback to first card if AI returns invalid ID
      return NextResponse.json({
        selectedCard: aiHand[0],
        reasoning: object.reasoning || 'Tao chọn cái này cho có lý',
        dialogue: object.dialogue || 'Mày cứ nói đi, ai biết đâu ai đúng ai sai!',
      });
    }

    return NextResponse.json({
      selectedCard,
      reasoning: object.reasoning,
      dialogue: object.dialogue,
    });
  } catch (error) {
    console.error('Error generating AI move:', error);

    // Fallback: select random card
    const randomCard = aiHand[Math.floor(Math.random() * aiHand.length)];
    return NextResponse.json({
      selectedCard: randomCard,
      reasoning: 'Tao chọn cái này thử xem',
      dialogue: 'Mày cứ nói đi!',
    });
  }
}

async function handleDialogue(req: NextRequest) {
  const body: DialogueRequest = await req.json();
  const { playerCard, aiCard, round, dramaContext } = body;

  try {
    const { object } = await generateObject({
      model: glm('glm-4-flash'),
      schema: playerDialogueSchema,
      prompt: `Bạn là "Người Bóc Phốt" - đang tranh cãi gay gắt với "Kẻ Bênh Vực Mù Quáng" về drama: ${dramaContext?.title || 'Drama nặc danh'}

Bối cảnh:
- Drama: ${dramaContext?.description || ''}
- Villain: ${dramaContext?.villain || 'Người gây drama'}
- Hiệp đấu thứ ${round}

Đối phương vừa đánh lá bài: ${aiCard.name} (${aiCard.type})
Bạn vừa đánh lá bài: ${playerCard.name} (${playerCard.type})

YÊU CẦU:
Viết một câu dialogue cực gắt, drama, gay cấn khi lật bài của bạn. Câu này phải:
1. Gây áp lực, đả kích mạnh
2. Dùng ngôn ngữ đời thường, thô mạn
3. Phản bác đối phương
4. Liên quan đến lá bài vừa đánh
5. 1 câu ngắn gọn (dưới 20 chữ)

TRẢ VỀ JSON format:
{
  "dialogue": "Câu dialogue cực gắt"
}

Chỉ trả về JSON, không có text thêm.`,
      temperature: 0.8,
    });

    return NextResponse.json({
      dialogue: object.dialogue || 'Mày cứ nói đi!',
    });
  } catch (error) {
    console.error('Error generating dialogue:', error);
    return NextResponse.json({
      dialogue: 'Mày cứ nói đi!',
    });
  }
}
