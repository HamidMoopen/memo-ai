# Memory Lane

Memory Lane is an AI-powered memory collection app that helps loved ones capture and preserve their stories. Stories are tagged, summarized, and searchable – at your fingertips - forever.

## Features

- Voice conversations with an AI agent
- Themed conversation topics (Growing Up, Family, Adult Life, etc.)
- Automatic story generation and analysis
- Beautiful, modern UI
- Real-time conversation feedback
- Story categorization and theme extraction

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- ElevenLabs AI
- OpenAI GPT-4

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/memo-ai.git
cd memo-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```env
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and shared logic
- `/src/types` - TypeScript type definitions

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
