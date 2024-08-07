import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ message: 'No prompt provided' }, { status: 400 });
    }

    const story = await generateStory(prompt);
    return NextResponse.json(story);
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ message: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}

async function generateStory(prompt) {
  try {
    const chatCompletion = await getGroqChatCompletion(prompt);
    const storyContent = chatCompletion.choices[0]?.message?.content;
    
    if (storyContent) {
      const formattedStory = formatStoryContent(storyContent);
      const qualityCheck = checkStoryQuality(formattedStory.story);
      const appropriatenessCheck = isContentAppropriate(formattedStory.story);

      console.log('Quality check results:', qualityCheck);
      console.log('Appropriateness check result:', appropriatenessCheck);
      console.log(`Generated story word count: ${qualityCheck.wordCount}`);

      return {
        ...formattedStory,
        qualityScore: calculateQualityScore(qualityCheck, appropriatenessCheck),
        isAppropriate: appropriatenessCheck
      };
    }
    
    throw new Error('Failed to generate story content');
  } catch (error) {
    console.error('Error generating story:', error);
    throw error;
  }
}

async function getGroqChatCompletion(prompt) {
  return await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are a master storyteller. Create an engaging, high-quality story based on the given prompt, adhering to these guidelines:
        1. Begin with a title enclosed in double asterisks.
        2. Write 500-800 words with a clear beginning, middle, and end.
        3. Use vivid language and sensory details.
        4. Include meaningful dialogue and character development.
        5. Incorporate a compelling conflict or challenge.
        6. Avoid explicit content, violence, or culturally insensitive material.
        7. Conclude with a satisfying resolution.
        8. Infuse the story with a clear theme or message.`
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama-3.1-70b-versatile',
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0.5,
  });
}

function formatStoryContent(content) {
  const titleRegex = /\*\*(.*?)\*\*/;
  const titleMatch = content.match(titleRegex);
  let title = 'Untitled Story';
  let story = content;

  if (titleMatch) {
    title = titleMatch[1].trim();
    story = content.replace(titleRegex, '').trim();
  }

  story = story.replace(/^\*+/, '').trim();
  story = story.replace(/^\n+/, '\n\n');

  return { title: `**${title}**`, story };
}

function checkStoryQuality(story) {
  const wordCount = story.split(/\s+/).length;
  const hasSufficientLength = wordCount >= 500 && wordCount <= 850;
  const hasDialogue = (story.match(/[""].*?[""]|[''].*?['']|['"''].*?['"'']/g) || []).length >= 2;
  const hasStructure = story.split('\n').length >= 4;
  
  const vividWords = ['vibrant', 'gleaming', 'thunderous', 'savory', 'fragrant', 'melodious', 'velvety', 'shimmering', 'radiant', 'serene', 'dazzling', 'enchanting', 'lush', 'mesmerizing', 'exquisite'];
  const vividLanguageRegex = new RegExp(`\\b(${vividWords.join('|')})\\b`, 'gi');
  const hasVividLanguage = (story.match(vividLanguageRegex) || []).length >= 2;

  const characterDevelopmentWords = ['realized', 'learned', 'understood', 'changed', 'grew', 'decided', 'felt', 'thought', 'discovered', 'transformed'];
  const characterDevelopmentRegex = new RegExp(`\\b(${characterDevelopmentWords.join('|')})\\b`, 'gi');
  const hasCharacterDevelopment = (story.match(characterDevelopmentRegex) || []).length >= 1;

  return {
    wordCount,
    hasSufficientLength,
    hasDialogue,
    hasStructure,
    hasVividLanguage,
    hasCharacterDevelopment
  };
}

function isContentAppropriate(story) {
  const lowerCaseStory = story.toLowerCase();
  const inappropriateContent = ['explicit sexual content', 'graphic violence', 'hate speech', 'discrimination', 'illegal activities', 'profanity', 'blasphemy'];
  return !inappropriateContent.some(term => lowerCaseStory.includes(term));
}

function calculateQualityScore(qualityCheck, appropriatenessCheck) {
  let score = 0;
  if (qualityCheck.hasSufficientLength) score += 20;
  if (qualityCheck.hasDialogue) score += 20;
  if (qualityCheck.hasStructure) score += 20;
  if (qualityCheck.hasVividLanguage) score += 20;
  if (qualityCheck.hasCharacterDevelopment) score += 20;
  if (appropriatenessCheck) score += 20;
  return Math.min(score, 100); // Cap the score at 100
}