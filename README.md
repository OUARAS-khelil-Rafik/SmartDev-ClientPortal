# SmartDev - Client Portal

Lightweight React + Vite client portal used as a demo frontend for project management, bookings and lightweight AI consultations.

This repo contains a browser SPA built with Vite, TypeScript, Tailwind CSS and a small set of UI components under `components/`. AI integrations are provided as stubs for client builds — see **AI Integration** below.

**Quick links:**
- **Source:** `.` (project root)
- **Main entry:** `index.tsx`
- **Components:** `components/`
- **Services:** `services/`

**Prerequisites**
- **Node.js:** v18+ recommended
- **npm** or yarn

**Local development**
- Install dependencies:

```powershell
npm install
```

- Start dev server (PowerShell):

```powershell
npm run dev
```

- Build for production:

```powershell
npm run build
```

**Project structure (key files)**
- **`index.tsx`**: App bootstrap and router
- **`App.tsx`**: Top-level app layout and state
- **`components/`**: UI components and pages (Dashboard, Booking, AIConsultant, etc.)
- **`services/`**: Client-side data/AI adapters (`mockApi.ts`, `geminiService.ts`)
- **`types.ts`**: Shared TypeScript interfaces and enums
- **`src/types/google-genai.d.ts`**: Local ambient types for `@google/genai` (development only)

**What I fixed (current branch)**
- TypeScript: added `src/types/google-genai.d.ts` to silence missing SDK types.
- Build: replaced direct `@google/genai` import in `services/geminiService.ts` with a browser-safe stub so the app can be bundled by Vite.

**AI Integration (important)**
- The official `@google/genai` SDK is intended for server-side usage and must not be bundled into browser code (security and compatibility). This repo currently ships a client-side stub in `services/geminiService.ts` that returns friendly messages prompting you to use a server API.

- To enable real AI responses, implement a server-side proxy or API route that calls `@google/genai` with your secret API key. Example approaches:
   - Add an API route in Node/Express or Vercel/Azure Function that reads `process.env.GEMINI_API_KEY` and uses `@google/genai`.
   - Use server-side rendering (SSR) or a backend-for-frontend pattern to keep keys secret.

Example minimal server (concept):

```javascript
// server/index.js (Express)
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(express.json());
app.post('/api/ai/chat', async (req, res) => {
   const { message } = req.body;
   const chat = ai.chats.create({ model: 'gemini-2.5-flash' });
   const result = await chat.sendMessage({ message });
   res.json({ text: result.text });
});

app.listen(3000);
```

Then call `/api/ai/chat` from the client instead of using `@google/genai` directly.

**Environment variables**
- Use `.env` or your deployment platform to set `GEMINI_API_KEY` (server only). Do NOT commit API keys.

**Troubleshooting**
- Build fails resolving `@google/genai`: this is expected if the SDK is imported in client code. Keep SDK usage on server-side only or add it to `build.rollupOptions.external` and provide a runtime shim.
- Large single bundle: Vite built some large chunks. Consider code-splitting with dynamic `import()` or configure `build.rollupOptions.output.manualChunks` in `vite.config.ts`.

**Tests & Linters**
- This project does not include automated tests by default. If you add `eslint` / `vitest`, update `package.json` accordingly and I can help wire them.

**License & Contributing**
- This repo does not include an explicit license file. Add a `LICENSE` if you plan to open-source it.
- To contribute, fork and open a PR; please include a short description of changes and relevant screenshots if UI-related.

If you want, I can:
- Implement a minimal server API that proxies requests to `@google/genai` and wire the client to use it.
- Add ESLint/Prettier and basic tests.