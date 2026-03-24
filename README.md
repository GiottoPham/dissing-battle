# 🔥 Showbiz Dissing Battle

**Parody Game về Scandal "Dzách - Z98" Chu Cấp 5 Củ**

Trận chiến giữa **Chiến Thần Antifan** (Player) và **FC Đốm Đốm** (AI) bảo vệ Idol **Dzách - Z98**.

Thể loại: **Open-Hand Card Battler** với cơ chế Kéo Co Dư Luận.

## 🎮 How to Play

1. Select your preferred language (English, Vietnamese, French, Russian, Chinese, or Korean)
2. Enter your creative insult
3. Submit and watch AI respond with its own insult
4. Score based on creativity (1-100 points)
5. Win 2 out of 3 rounds to become the champion!

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **AI:** Vercel AI SDK + GLM Coding Plan API
- **Package Manager:** Bun
- **Deployment:** Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/GiottoPham/dissing-battle.git
cd dissing-battle

# Install dependencies with bun
bun install

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your repository `GiottoPham/dissing-battle`
4. Click **Deploy**

That's it! Vercel will automatically build and deploy your app.

## 🎯 Features

- ✅ Multi-language support (6 languages)
- ✅ 3-round battle system
- ✅ Creativity scoring (1-100 points) via GLM AI Model
- ✅ Real-time AI responses using Vercel AI SDK
- ✅ Vietnamese insults use chợ búa style (mày tao, not cậu tớ)
- ✅ Beautiful gradient UI
- ✅ Responsive design
- ✅ Zustand state management
- ✅ GLM Coding Plan API integration

## 📝 Project Structure

```
dissing-battle/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ai-insult/route.ts    # AI insult generation API
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Main game UI
│   └── store/
│       └── gameStore.ts               # Zustand store for game state
├── public/
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🎨 Languages Supported

- 🇬🇧 English
- 🇻🇳 Tiếng Việt
- 🇫🇷 Français
- 🇷🇺 Русский
- 🇨🇳 中文
- 🇰🇷 한국어

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```bash
# GLM Coding Plan API Key
GLM_API_KEY=your_glm_api_key_here

# GLM API Base URL (optional, defaults to standard endpoint)
GLM_API_BASE_URL=https://api.zhipuai.cn
```

Get your GLM API key from: https://open.bigmodel.cn/

## 🔧 Future Improvements

- [x] Integrate Vercel AI SDK for AI responses
- [x] Add GLM Coding Plan API for advanced insults and scoring
- [x] Vietnamese chợ búa style (mày tao, not cậu tớ)
- [ ] Add more languages
- [ ] Player vs Player mode
- [ ] Sound effects
- [ ] Leaderboard
- [ ] Insult history database
- [ ] Battle replay history

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Made with 🔥 and creative insults! 🎉
