# Fluently — AI speaking practice (portfolio demo)

A frontend demo of a SaaS for language schools: students practise real-life conversations with an AI speaking partner, and teachers follow their progress. **This isn't a real service.** All data, pricing and feedback are illustrative, and conversation replies are scripted locally.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
# or a production build
npm run build && npm start
```

Requires Node 18.18+ (tested on Node 22). Fonts are self-hosted through npm packages, so you don't need network access to Google Fonts.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Marketing landing page: hero, problem and solution, how it works, interactive scenario explorer, voice showcase, progress, schools, pricing, final CTA |
| `/demo/student` | Student dashboard: overview, practice, vocabulary and conversation history views |
| `/demo/teacher` | Teacher dashboard: stats, attention list, activity, a searchable, filterable and sortable roster, a student detail drawer and conversation reviews |

All dialogs (log in, register, onboarding, upgrade, contact, conversation, info) are global and work from every route.

## Stack

Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, Framer Motion and Lucide icons. The charts are plain CSS and SVG, with no chart library.

## Project structure

```
app/                      routes (/, /demo/student, /demo/teacher)
components/ui/            Button, Badge, Dialog, Toast, Field, Charts, Brand (logo, waveform, avatar)
components/layout/        Navbar, Footer, DashboardShell, legal dialogs
components/marketing/     landing page sections
components/chat/          ConversationPanel, MessageBubble, SessionSummary
components/auth/          LoginModal, RegisterModal
components/dialogs/       Onboarding, Upgrade, Contact
components/student|teacher/ dashboards and the student detail panel
components/providers/     AppProvider (modal and conversation state) and ModalRoot
lib/                      scenarios, mock-conversation, mock-data, pricing, teacher helpers, validation
types/                    shared types
```

## What's simulated

- **Authentication** is a deliberate simulation. Any non-empty credentials return `Invalid email or password. Please try again.` Nothing is sent or stored, and the password field is cleared after each attempt. Google sign-in, password recovery and registration show "disabled in this demo" messages.
- **The AI tutor** is a deterministic local engine (`lib/mock-conversation.ts`). It uses scripted, level-aware turns, keyword-based reactions and a small rule set for grammar and natural-expression tips. Voice mode is a labelled preview only: no microphone is used.
- **Payments, contact form, assigning scenarios and exporting reports** validate input and show demo notices or toasts. They don't send anything.
- **Persistence:** only completed demo practice sessions are saved in `localStorage`, so they can appear on the student dashboard. Auth data is never saved.

## Connecting real services later

- **LLM:** implement the `ConversationService` interface in `lib/mock-conversation.ts` (`start`, `reply`, `summarize`) behind a server route, then swap the import in `ConversationPanel`. You don't need to change the UI.
- **Speech:** add speech-to-text and text-to-speech behind the microphone button in `ConversationPanel`.
- **Auth, data and payments:** replace `LoginModal` and `RegisterModal` submit handlers, the `lib/mock-data.ts` reads and the upgrade and contact handlers with real APIs.
