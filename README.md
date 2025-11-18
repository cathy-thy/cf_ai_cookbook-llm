# LLM Chat Application Template

A simple, ready-to-deploy chat application template powered by Cloudflare Workers AI. This template provides a clean starting point for building AI chat applications with streaming responses.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/llm-chat-app-template)

<!-- dash-content-start -->

## Demo

This template demonstrates how to build an AI-powered chat interface using Cloudflare Workers AI with streaming responses. It features:

- Real-time streaming of AI responses using Server-Sent Events (SSE)
- Easy customization of models and system prompts
- Support for AI Gateway integration
- Clean, responsive UI that works on mobile and desktop

## Features

- 💬 Simple and responsive chat interface
- ⚡ Server-Sent Events (SSE) for streaming responses
- 🧠 Powered by Cloudflare Workers AI LLMs
- 🛠️ Built with TypeScript and Cloudflare Workers
- 📱 Mobile-friendly design
- 🔄 Maintains chat history on the client
- 🔎 Built-in Observability logging
<!-- dash-content-end -->

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- A Cloudflare account with Workers AI access

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/cloudflare/templates.git
   cd templates/llm-chat-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Generate Worker type definitions:
   ```bash
   npm run cf-typegen
   ```

### Development

Start a local development server:

```bash
npm run dev
```

This will start a local server at http://localhost:8787.

Note: Using Workers AI accesses your Cloudflare account even during local development, which will incur usage charges.

### Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

### Monitor

View real-time logs associated with any deployed Worker:

```bash
npm wrangler tail
```

## Project Structure

```
/
├── public/             # Static assets
│   ├── index.html      # Chat UI HTML
│   └── chat.js         # Chat UI frontend script
├── src/
│   ├── index.ts        # Main Worker entry point
│   └── types.ts        # TypeScript type definitions
├── test/               # Test files
├── wrangler.jsonc      # Cloudflare Worker configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # This documentation
```

## How It Works

### Backend

The backend is built with Cloudflare Workers and uses the Workers AI platform to generate responses. The main components are:

1. **API Endpoint** (`/api/chat`): Accepts POST requests with chat messages and streams responses
2. **Streaming**: Uses Server-Sent Events (SSE) for real-time streaming of AI responses
3. **Workers AI Binding**: Connects to Cloudflare's AI service via the Workers AI binding

### Frontend

The frontend is a simple HTML/CSS/JavaScript application that:

1. Presents a chat interface
2. Sends user messages to the API
3. Processes streaming responses in real-time
4. Maintains chat history on the client side

## Customization

### Changing the Model

To use a different AI model, update the `MODEL_ID` constant in `src/index.ts`. You can find available models in the [Cloudflare Workers AI documentation](https://developers.cloudflare.com/workers-ai/models/).

### Using AI Gateway

The template includes commented code for AI Gateway integration, which provides additional capabilities like rate limiting, caching, and analytics.

To enable AI Gateway:

1. [Create an AI Gateway](https://dash.cloudflare.com/?to=/:account/ai/ai-gateway) in your Cloudflare dashboard
2. Uncomment the gateway configuration in `src/index.ts`
3. Replace `YOUR_GATEWAY_ID` with your actual AI Gateway ID
4. Configure other gateway options as needed:
   - `skipCache`: Set to `true` to bypass gateway caching
   - `cacheTtl`: Set the cache time-to-live in seconds

Learn more about [AI Gateway](https://developers.cloudflare.com/ai-gateway/).

### Modifying the System Prompt

The default system prompt can be changed by updating the `SYSTEM_PROMPT` constant in `src/index.ts`.

### Styling

The UI styling is contained in the `<style>` section of `public/index.html`. You can modify the CSS variables at the top to quickly change the color scheme.

## Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/)

# 🪄 Wizard Cookbook  
*A magical recipe assistant powered by Cloudflare Workers AI*

The **Wizard Cookbook** is an immersive AI-powered cooking companion.  
Tell the wizard what ingredients you have, and he will conjure a creative recipe on the spot.  
The UI blends a modern chat interface with magical, fantasy‑inspired visuals, including glowing effects, parchment‑style textures, and wizardly animations.

This project runs entirely on **Cloudflare Workers**, with persistent conversation memory and a responsive, accessible front-end.

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

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Generate Cloudflare Worker typings
```bash
npm run cf-typegen
```

### 3. Start development server
```bash
npm run dev
```

Your local app will run at:

```
http://localhost:8787
```

> **Important:** Workers AI API calls still hit your Cloudflare account during local dev and may incur usage.

---

## ☁️ Deployment

### Deploy to Cloudflare Workers
```bash
npm run deploy
```

### View real-time logs
```bash
npx wrangler tail
```

---

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