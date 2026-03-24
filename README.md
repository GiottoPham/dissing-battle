# 🔥 Multi Language Dissing Battle

A fun and creative insult battle game where you compete against AI in 3 rounds! Choose from 6 languages and see who can come up with the most creative insults.

## 🎮 How to Play

1. Select your preferred language (English, Vietnamese, French, Russian, Chinese, or Korean)
2. Enter your creative insult
3. Submit and watch AI respond with its own insult
4. Score based on creativity (1-100 points)
5. Win 2 out of 3 rounds to become the champion!

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Deployment:** Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/GiottoPham/dissing-battle.git
cd dissing-battle

# Install dependencies
npm install

# Run development server
npm run dev
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
- ✅ Creativity scoring (1-100 points)
- ✅ Real-time AI responses
- ✅ Beautiful gradient UI
- ✅ Responsive design
- ✅ Zustand state management

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

## 🔧 Future Improvements

- [ ] Integrate real AI API (OpenAI, Anthropic, etc.) for better insults
- [ ] Add more languages
- [ ] Player vs Player mode
- [ ] Sound effects
- [ ] Leaderboard
- [ ] Insult history database
- [ ] Advanced creativity scoring using ML

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Made with 🔥 and creative insults! 🎉
