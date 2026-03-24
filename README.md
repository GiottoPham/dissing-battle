# 🔥 Drama Dissing Battle

**Đại Chiến Bóc Phốt - Dynamic Drama Generator**

Trận chiến ngôn từ giữa **Người Bóc Phốt** (Player) và **Kẻ Bênh Vực Mù Quáng** (AI).

Mỗi trận đấu, AI sẽ tự động sinh ra một **Drama ngẫu nhiên** với bối cảnh và thẻ bài riêng biệt!

Thể loại: **Open-Hand Card Battler** với cơ chế Kéo Co Dư Luận.

## 🎮 How to Play

1. Click **BẮT ĐẦU TRANH CHIẾN** để AI sinh ra một Drama ngẫu nhiên
2. Xem bối cảnh Drama (villain, victim, situation)
3. Nhìn thẳng vào bài của AI - cả 2 đều nhìn thấy bài của nhau (Open-Hand)
4. Chọn 1 lá bài để đánh
5. Đối chiếu:
   - 🔨 **Bằng Chứng** (Đỏ) > ✂️ Châm Biếm
   - ✂️ **Châm Biếm** (Vàng) > 🧻 Văn Mẫu
   - 🧻 **Văn Mẫu** (Xanh) > 🔨 Bằng Chứng
6. Thắng hiệp = kéo dư luận về phía mình (điểm = weight * 5 + 10)
7. Thắng nếu dư luận chạm 0% hoặc 100%, hoặc có % cao hơn sau 5 hiệp

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **State Management:** Zustand
- **AI Engine:** Vercel AI SDK (generateObject + zod schema) + **GLM Coding Plan API**
- **AI Model:** GLM-4-Flash
- **Animations:** Framer Motion
- **Package Manager:** Bun
- **Deployment:** Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/GiottoPham/dissing-battle.git
cd dissing-battle

# Install dependencies with bun
bun install

# Create .env.local with GLM API key
echo "GLM_API_KEY=your_key_here" > .env.local

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your repository `GiottoPham/dissing-battle`
4. Add Environment Variable:
   - `GLM_API_KEY`: Your GLM API key from https://open.bigmodel.cn/
5. Click **Deploy**

That's it! Vercel will automatically build and deploy your app.

## 🎯 Features

- ✅ **Dynamic Drama Generation**: AI creates unique drama context each game
- ✅ **Dynamic Card System**: Cards generated to match drama story
- ✅ **Open-Hand Gameplay**: Both players see each other's cards
- ✅ **3 Card Types**: Evidence (Red), Satire (Yellow), Sentiment (Green)
- ✅ **Rock-Paper-Scissors Mechanics**: Type advantages
- ✅ **Weight System**: Cards have 1-3 weight points
- ✅ **Tug-of-War**: Public opinion bar (0-100%)
- ✅ **AI Strategic Thinking**: AI analyzes and chooses optimal cards
- ✅ **Dynamic Dialogue**: AI generates dramatic arguments for both sides
- ✅ **Instant Win**: Hit 0% or 100% to win immediately
- ✅ **Beautiful UI**: Gradient backgrounds, animations, cards

## 📝 Project Structure

```
dissing-battle/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-drama/route.ts  # AI generates drama + cards
│   │   │   └── ai-move/route.ts         # AI strategy + dialogue
│   │   ├── layout.tsx
│   │   ├── page.tsx                     # Main game UI
│   │   └── globals.css
│   ├── components/
│   │   ├── GameCard.tsx                # Card component with animations
│   │   └── ui/                         # Shadcn UI components
│   ├── store/
│   │   └── gameStore.ts                # Zustand state management
│   └── types/
│       └── game.ts                     # TypeScript definitions
├── public/
├── bun.lock
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🎨 Card Types

### 🔨 Bằng Chứng (Evidence) - Màu Đỏ
- Khắc chế Châm Biếm
- Examples: Cap màn hình, Ghi âm, Hóa đơn, Video
- Direct, factual evidence

### ✂️ Châm Biếm (Satire) - Màu Vàng
- Khắc chế Văn Mẫu
- Examples: Meme, Nhại lời, Đặt biệt danh
- Social media attacks, mockery

### 🧻 Văn Mẫu (Sentiment) - Màu Xanh
- Khắc chế Bằng Chứng
- Examples: Khóc lóc, Đổ lỗi, Gaslighting
- Emotional manipulation, playing victim

## 🎭 AI Features

### Drama Generation
- Random drama type (tra nam, sếp, idol, etc.)
- AI-generated villain and victim names
- Detailed situation description
- Context-appropriate emoji

### Card Generation
- 10 unique cards (5 for each side)
- AI creates names and descriptions matching drama
- Weight distribution (1-3) for strategy
- Type balancing across evidence/satire/sentiment

### Strategic AI
- Analyzes opponent's card type
- Chooses counter-type based on advantage matrix
- Considers weight for tie situations
- Generates reasoning for choice

### Dynamic Dialogue
- Dramatic arguments when cards are revealed
- Context-aware responses
- Vietnamese "chợ búa" style
- Emotional tension

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```bash
# GLM Coding Plan API Key (REQUIRED)
GLM_API_KEY=your_glm_api_key_here

# GLM API Base URL (optional, defaults to ZhipuAI)
GLM_API_BASE_URL=https://open.bigmodel.cn/api/paas/v4
```

**Get your GLM API key from:** https://open.bigmodel.cn/

**Important:** The app uses GLM-4-Flash model from GLM Coding Plan API. Make sure your API key has access to this model.

## 🔧 Future Improvements

- [ ] Add more drama types
- [ ] Player vs Player mode
- [ ] Leaderboard system
- [ ] Battle replay sharing
- [ ] More card effects
- [ ] Sound effects
- [ ] Battle history database
- [ ] Advanced AI difficulty levels

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Made with 🔥 and endless drama! 🎭
