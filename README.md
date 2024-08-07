# StoryKids

StoryKids is an interactive storytelling platform that leverages AI to generate, translate, and narrate stories for children. This project aims to make storytelling more engaging and accessible across different languages and cultures.

## Features

- **AI-powered story generation**
- **Multi-language translation support**
- **Text-to-speech narration**
- **User authentication and personalized story collections**
- **Interactive UI with animations and particle effects**

## Technologies Used

- **Next.js 14**
- **React 18**
- **Tailwind CSS**
- **Prisma ORM**
- **MongoDB**
- **NextAuth.js** for authentication
- **Groq AI** for story generation
- **ElevenLabs API** for text-to-speech
- **DeepL API** for translations
- **Framer Motion** for animations
- **React Toastify** for notifications

## Getting Started

### Prerequisites

- **Node.js 16.x or later**
- **MongoDB database**
- **Groq AI API key**
- **ElevenLabs API key**
- **DeepL API key**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/storykids.git
   cd storykids
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   DATABASE_URL=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GROQ_API_KEY=your_groq_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   DEEPL_API_KEY=your_deepl_api_key
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open the application in your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

- `/app`: Next.js app router and page components
- `/components`: Reusable React components
- `/lib`: Utility functions and shared logic
- `/prisma`: Prisma schema and migrations
- `/public`: Static assets
- `/styles`: Global styles and Tailwind CSS configuration

## API Routes

- `/api/auth`: Authentication endpoints
- `/api/stories`: Story management endpoints
- `/api/generateStory`: AI story generation endpoint
- `/api/translate`: Translation endpoint
- `/api/textToSpeech`: Text-to-speech endpoint

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International Public License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Groq AI](https://www.groq.com/) for providing the AI story generation capabilities
- [ElevenLabs](https://elevenlabs.io/) for the text-to-speech API
- [DeepL](https://www.deepl.com/) for the translation API
- [Vercel](https://vercel.com/) for hosting and deployment