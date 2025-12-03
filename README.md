# SmartDev - Client Portal

Lightweight React + Vite client portal used as a demo frontend for project management, bookings and lightweight AI consultations.

This repo contains a browser SPA built with Vite, TypeScript, Tailwind CSS and a small set of UI components under `components/`. AI integrations are provided as stubs for client builds, see **AI Integration** below.

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

# SmartDev - Client Portal

Lightweight React + Vite client portal used as a demo frontend for project management, bookings and lightweight AI consultations.

This repo is a single-page application (SPA) built with Vite, TypeScript and Tailwind CSS. It contains a set of UI components under `src/components/` and simple client-side services under `src/services/`.

---

## Key Features
- Modern React + TypeScript + Vite starter
- Tailwind CSS for utility-first styling
- Multiple UI pages/components (Dashboard, Booking, AI Consultant, Admin)
- Animated global custom cursor with:
   - Smooth follow ring and dot
   - Click ripple effect
   - Hover enlargement over interactive elements (links, buttons, inputs)
   - Automatic color cycling (respects `prefers-reduced-motion`)
   - Works only on fine-pointer devices (touch devices unaffected)
- Built-in client-side AI service stubs (see `src/services/geminiService.ts`) — replace with a server-side proxy for production

---

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- Optional: Google GenAI (server-side only) — client includes a stub

---

## Quick Start

Prerequisites
- Node.js v18+ (recommended)
- npm (or yarn)

Install dependencies:

```pwsh
npm install
```

Start dev server:

```pwsh
npm run dev
```

Build for production:

```pwsh
npm run build
```

---

## Project Structure (important files)
- `index.html` — App entry
- `src/index.tsx` — React bootstrap
- `src/App.tsx` — Top-level layout and routing/view state
- `src/components/` — UI components
- `src/services/` — Client-side service adapters and stubs
- `src/index.css` — Tailwind + project styles (includes custom cursor CSS)

---

## Custom Cursor — details & customization

Location:
- Component: `src/components/CustomCursor.tsx`
- Styles: appended to `src/index.css`

Behavior summary:
- Shows a small dot and a larger ring that follows the pointer smoothly.
- The dot uses `left`/`top` positioning with CSS `transform: translate(-50%,-50%)` so centering and scale transforms remain consistent.
- Clicking creates a ripple animation at the pointer position.
- Hovering interactive elements (links, buttons, inputs, or elements with `.cursor-pointer`) will grow the ring and change its color to indicate interactivity.
- The ring and dot color cycles automatically via HSL hue rotation. The animation respects `prefers-reduced-motion` and will be disabled if the user has that preference.
- The custom cursor activates only on fine-pointer devices (so touch users keep native touch behavior).

Quick customization (edit these values inside `CustomCursor.tsx`):
- `speed` (degrees/sec) — how quickly the hue cycles. Default is `28`.
- Starting hue (`hueRef` default) — set initial color.
- Change palette: replace HSL usage with an array of color stops and pick/lerp between them.
- Disable color cycling: set `prefersReduced` check or force static color in the component.

CSS customization (edit `src/index.css`):
- `.cursor-dot` — size, shadow, and base color
- `.cursor-ring` — ring size, border-width, transitions
- `.cursor-ripple` — ripple size and animation duration

Examples
- To slow color cycling: set `const speed = 10;` in `CustomCursor.tsx`.
- To lock color on hover: in the hover handler set a fixed color to `ringRef.current.style.borderColor`.

---

## How to test cursor interactions

1. Start the dev server: `npm run dev`.
2. Open the site in a desktop browser (Chrome, Edge, Firefox) on a non-touch device.
3. Move the mouse — the dot should follow instantly; the ring should smoothly follow.
4. Hover a button or link — the ring should grow and change tint.
5. Click or right-click — a ripple animates from the click point and the ring scales briefly.
6. To verify `prefers-reduced-motion`, enable reduced motion in OS accessibility settings and reload the page — color cycling and ripples should be suppressed.

If you notice an offset between the physical pointer and the custom cursor:
- Ensure browser zoom is 100% and OS display scaling is default. High DPI scaling can affect measurement.
- Test in a different browser to rule out browser-specific issues.
- If offset persists, open the devtools console and run `window.devicePixelRatio` — a non-integer DPR may require small adjustments in the component (already handled in most cases).

---

## AI Integration (important)

This project includes a client-side stub for AI interactions in `src/services/geminiService.ts`. The official `@google/genai` SDK must run server-side where API keys are secret.

To enable real AI:
- Implement a small server endpoint (Express, Next.js API route, Azure Function, etc.) that calls `@google/genai` using a server-side `GEMINI_API_KEY` environment variable.
- Have the client call that endpoint instead of importing `@google/genai` directly.

Example server (concept):

```js
// server/index.js
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/ai/chat', async (req, res) => {
   const { message } = req.body;
   const chat = ai.chats.create({ model: 'gemini-2.5-flash' });
   const result = await chat.sendMessage({ message });
   res.json({ text: result.text });
});

app.listen(3000);
```

---

## Troubleshooting & Notes
- If the dev build fails resolving `@google/genai`, ensure you don't import it in client code. Move SDK usage server-side.
- If you see performance issues with the animated cursor, check `prefers-reduced-motion` or disable the color animation by setting `speed = 0` or guarding with the media query.

---

## Contributing
- Fork, create a branch, and open a PR. Include screenshots for UI changes.
- If you add server code to work with real AI, add `.env.example` showing expected variables (do not commit secrets).

## License
- No license file is included. Add `LICENSE` if you plan to open-source this project.