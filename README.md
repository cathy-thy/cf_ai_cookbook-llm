# 🪄 Wizard Cookbook  
![Workers AI](https://img.shields.io/badge/Workers%20AI-TECH-1E90FF?style=for-the-badge)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-TECH-F38020?style=for-the-badge)
![CSS](https://img.shields.io/badge/CSS-TECH-1572B6?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-TECH-F7DF1E?style=for-the-badge)

This project runs entirely on **Cloudflare Workers**, with persistent conversation memory and a responsive, accessible front-end.

---

## 🌐 Try It Online

No setup is required — simply open the live demo:

👉 **https://cookbook-llm.cathytsui-git.workers.dev/**

The wizard is already deployed using Cloudflare Workers and ready to brew recipes for you.

https://github.com/user-attachments/assets/05c4c0e5-fefb-4603-97b1-4d8f50ef69ca

---

## ✨ Features

### 🔮 AI Recipe Wizard (Workers AI)

Powered by:

```
@cf/meta/llama-3.3-70b-instruct-fp8-fast
```

The wizard:
- Reads your ingredients  
- Suggests a recipe  
- Updates the dish as you add more items  
- Maintains context across messages  

### 🧠 Conversation Memory (KV)

Each session is tracked using a unique `sessionId` and stored inside Cloudflare KV:

- Multi-turn conversations  
- Memory persists across page refreshes  
- Automatically trims older messages  

### 🧙 Magical UI

A completely custom-designed wizarding interface featuring:

- Floating magical hints  
- Wizard avatar with animated glow  
- Fantasy fonts (Cormorant, Cinzel Decorative)  
- A parchment‑style recipe scroll  
- Smooth animated accents & themed scrollbars  

### 📱 Responsive & Accessible

- Fully mobile‑friendly layout  
- Wizard + guide reposition on small screens  
- Keyboard navigation ready  
- Clear focus outlines  
- High-contrast readable typography  

---

## 🧪 Tech Stack

### **Frontend**
- HTML + CSS (custom magical theme)
- Vanilla JavaScript
- Responsive flex layout
- Keyboard accessibility

### **Backend**
- Cloudflare Workers
- Workers AI for LLM inference
- KV storage for conversation memory
- TypeScript

## 📁 Project Structure

```
/
├── public/
│   ├── index.html      # UI
│   ├── magic.css       # Magical styling
│   └── chat.js         # Frontend logic
│
├── src/
│   ├── index.ts        # Cloudflare Worker backend
│   └── types.ts        # Type definitions
│
├── wrangler.jsonc      # Cloudflare Worker config
├── tsconfig.json
└── README.md
```

---

## 🧙 How It Works

### 1. User sends ingredients → `/api/chat`
The frontend sends a message such as:

```json
{ "messages": [{ "role": "user", "content": "chicken + rice" }] }
```

### 2. Worker restores conversation memory  
Messages from KV are merged with the new input.

### 3. Worker calls Workers AI  
The LLM returns the wizard’s updated recipe suggestion.

### 4. Worker saves updated memory  
Conversation state is persisted in KV for the session.

### 5. Frontend displays the wizard’s response  
Messages appear with styled assistant/user formatting.

---

## 🛠 Customization

### Modify system prompt  
Edit in `src/index.ts`:

```ts
const SYSTEM_PROMPT = "Your task is to help the user prepare a meal...";
```

### Change AI model  
Update:

```ts
const MODEL_ID = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
```

### Customize theme  
Modify `/public/magic.css` to adjust:
- Colors  
- Wizard glow  
- Borders  
- Chat layout  
- Scroll effects  

---

## ❤️ Contributing

Pull requests, spellbooks, and magical enchantments are welcome.  
Feel free to enhance the wizard, improve UI effects, or add new magical interactions.

---

## 🧙 License
MIT — Magic is best when shared.
