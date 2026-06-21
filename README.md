# Spur - AI Support Chat Agent

A full-stack web application simulating a customer support live chat widget powered by a real LLM. This project was built as part of the founding engineer assignment. 

It provides an interactive UI, persists chat sessions so users can reload without losing history, and uses Gemini to answer e-commerce support questions based on a predefined prompt.

## Features Covered

- **AI Live Chat Interface**: Responsive widget mimicking standard support systems. Auto-scrolls, distinctly styles user vs. bot messages, and provides loading/typing indicators. Includes session management (New Chat button).
- **Backend APIs**: `POST /api/chat/message` and `GET /api/chat/message` to send messages and retrieve conversation history.
- **Robust Persistence**: Chats and sessions are persisted to the database via Prisma ORM. On page reload, a cookie is used to fetch and restore the past messages for that session seamlessly.
- **LLM Integration**: Interacts with the Gemini API to construct helpful, domain-specific responses.
- **Input Validation & Safety**: Uses `zod` for request validation. The backend handles edge cases and returns friendly errors if the LLM or Database encounters issues, ensuring the app doesn't crash on bad input.

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes, TypeScript
- **Database**: PostgreSQL (managed via Prisma ORM)
- **Validation**: Zod
- **LLM Provider**: Google Gemini (`@google/genai`)
- **Cache/Rate Limiting**: Upstash Redis 

---

## Getting Started

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and npm/yarn/pnpm installed on your machine.

### 2. Environment Variables

Create a `.env` file in the root directory and add the following keys. A `.env.example` is provided in the repository.

```env
# Database connection string (e.g., PostgreSQL or SQLite)
DATABASE_URL="postgresql://user:password@host:port/dbname"

# Gemini API Key for LLM processing
GEMINI_API_KEY="your_google_gemini_api_key_here"

# Upstash Redis for caching/rate limiting
UPSTASH_REDIS_REST_URL="your_upstash_redis_rest_url_here"
UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_rest_token_here"
```

### 3. Database Setup (Migrations & Seed)

This project uses Prisma. To initialize your database and push the schema:

```bash
# Install dependencies
npm install

# Push the schema to the database
npx prisma db push

# (Optional) If you have a Prisma seed script configured for mock data:
npx prisma db seed
```

### 4. Running Locally

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Click the chat widget in the bottom right to start interacting.

---

## Architecture Overview

The app follows a clear separation of concerns, divided into modular layers:

1. **Presentation Layer (Components)**: 
   - `ChatWidget`, `ChatMessageList`, `ChatInputArea`: React components dealing strictly with UI and user interactions.
   - Custom hooks (`useChat.ts`) encapsulate the state logic, API fetching, and cookie handling to keep the components clean.
2. **API Route Layer**: 
   - Next.js Route Handlers (`app/api/chat/message/route.ts`) act as controllers. They use **Zod** (`validations/chat.validations.ts`) to strictly validate incoming payloads and return structured JSON responses via utility helpers (`createResponse`, `createError`).
3. **Service Layer**: 
   - `gemini.service.ts`: Encapsulates all LLM-specific logic. 
   - `message.service.ts` & `session.service.ts`: Handles DB operations. This isolates business logic from the routing layer, making it easy to swap providers (e.g., moving from Gemini to Claude) or swap databases.
4. **Data Access Layer**: 
   - Managed entirely by **Prisma**, ensuring type-safety from the DB to the frontend.

---

## LLM Notes & Decisions

- **Provider**: Google Gemini was chosen because it was free.
- **Prompting Strategy**: The system is seeded with a `SUPPORT_AGENT_PROMPT` that defines the agent's persona (E-commerce support), tone, and bounds of knowledge. Conversation history is explicitly formatted into the prompt (e.g., `User: ... \n Assistant: ...`) to maintain context across multi-turn interactions.
- **Why no tools/function calling yet?**: Kept simple for the scope. If more complex domain tasks were needed (e.g., "track my order 123"), the LLM could easily be updated to use structured tool calling.

## Trade-offs & "If I had more time..."

- I was not able to test how the application behaves when the LLM runs out of tokens during an exceptionally long conversation.