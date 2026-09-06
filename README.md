# Employee Assistant Dashboard

Orbit Works is a React employee workspace dashboard with employee directory, analytics, an AI assistant, theme switching, and responsive layouts.

## Technologies Used

- React 19
- Vite
- JavaScript with JSX
- Lucide React for icons
- Recharts for charts and analytics
- Google Gemini API for the AI assistant
- CSS with responsive media queries
- Vercel SPA rewrite configuration

## Prerequisites

- Node.js 18 or newer
- npm
- A Google Gemini API key for the AI assistant

## Setup

1. Clone or download the project.
2. Open a terminal in the project directory.
3. Install dependencies:

```bash
npm install
```

4. Configure the Gemini API key using the instructions below.
5. Start the development server:

```bash
npm run dev
```

6. Open the local URL shown by Vite, usually `http://localhost:5173`.

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The generated files are placed in `dist/`. They are build output and normally should not be edited directly.

## Gemini API Setup

The AI assistant uses the `VITE_GEMINI_API_KEY` environment variable.

1. Copy `.env.example` to a new file named `.env` in the project root.
2. Replace the placeholder value with your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

3. Restart the Vite development server after changing `.env`.
4. Open the AI Assistant page and send a message to verify the connection.

The assistant sends the latest conversation context to Gemini and retries temporary failures such as rate limits and server errors. Chat history is stored locally in the browser under the `orbit-chat` key.

### API Key Security

This project is a frontend application, so a `VITE_` environment variable is included in the browser bundle. Do not use this setup for a production application that requires a private API key. For production, move Gemini requests to a backend or serverless function and keep the key in server-side environment variables.


## Project Structure

```text
src/
  components/       Shared layout and UI components
  data/             Employee and chart data
  pages/            Dashboard pages and views
  services/         Gemini API integration
  *.css             Global, landing, responsive, and recovery styles
```

## Available Commands

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
