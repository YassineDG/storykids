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

    let satisfactoryStory = null;
    let attempts = 0;
    const maxAttempts = 5; // Reduced from 10 to 5

    while (!satisfactoryStory && attempts < maxAttempts) {
      attempts++;
      console.log(`Attempt ${attempts} to generate story`);
      
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

          if (qualityCheck.passesAllCriteria && appropriatenessCheck) {
            satisfactoryStory = formattedStory;
            console.log('Successfully generated and validated story');
            break; // Exit the loop immediately after finding a satisfactory story
          } else {
            console.log('Story did not meet quality or appropriateness criteria. Retrying...');
          }
        }
      } catch (error) {
        console.error(`Error in attempt ${attempts}:`, error);
      }
    }

    if (satisfactoryStory) {
      return NextResponse.json(satisfactoryStory);
    } else {
      return NextResponse.json({ message: 'Unable to generate a satisfactory story. Please try again.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Unexpected error in POST handler:', error);
    return NextResponse.json({ message: 'An unexpected error occurred. Please try again later.' }, { status: 500 });
  }
}

async function getGroqChatCompletion(prompt) {
  return await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are a master storyteller with a gift for creating captivating narratives. Craft an engaging story based on the user's prompt, adhering to these guidelines:

        1. Begin with an intriguing title enclosed in double asterisks (e.g., **The Whispering Shadows**).
        2. Place the title on its own line, followed by a blank line.
        3. Compose a story of 500-800 words, with a well-structured beginning, middle, and end.
        4. Employ rich, vivid language to create a sensory experience. Use powerful adjectives, metaphors, and similes to bring scenes to life.
        5. Incorporate meaningful dialogue that reveals character depth and propels the plot forward.
        6. Develop at least one main character, ensuring they face a compelling conflict or challenge.
        7. If religious themes arise, particularly Islamic ones, represent them accurately and respectfully. For non-religious themes, exercise creative freedom.
        8. Abstain from explicit content, gratuitous violence, or culturally insensitive material.
        9. Weave in elements of surprise, emotional resonance, or profound insight to create a memorable narrative.
        10. Conclude with a satisfying resolution that addresses the main conflict and leaves a lasting impression.
        11. Infuse the story with a clear theme or message, be it a moral lesson, a reflection on the human condition, or a thought-provoking concept.

        Your goal is to craft a story that is not just entertaining, but also emotionally engaging, intellectually stimulating, and respectful of diverse perspectives. Use your mastery of language to transport the reader into a vividly realized world.`
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama-3.1-70b-versatile',
    temperature: 0.75,
    max_tokens: 2048,
    top_p: 0.9,
    frequency_penalty: 0.6,
    presence_penalty: 0.6,
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
  const hasSufficientLength = wordCount >= 500 && wordCount <= 850; // Increased upper limit slightly
  const hasDialogue = (story.match(/[""].*?[""]|[''].*?['']|['"''].*?['"'']/g) || []).length >= 2;
  const hasStructure = story.split('\n').length >= 4;
  
  const vividWords = [
    'vibrant', 'gleaming', 'thunderous', 'savory', 'fragrant', 'melodious', 'velvety', 'shimmering', 'radiant', 'serene',
    'dazzling', 'enchanting', 'lush', 'mesmerizing', 'exquisite', 'captivating', 'breathtaking', 'stunning', 'majestic', 'ethereal',
    'vivid', 'pulsating', 'resonant', 'aromatic', 'tantalizing', 'silky', 'glistening', 'luminous', 'tranquil', 'resplendent',
    'effervescent', 'opulent', 'succulent', 'euphonious', 'gossamer', 'incandescent', 'mellifluous', 'resplendent', 'sumptuous', 'verdant',
    'bright', 'colorful', 'loud', 'quiet', 'smooth', 'rough', 'sweet', 'sour', 'bitter', 'salty',
    'hot', 'cold', 'warm', 'cool', 'soft', 'hard', 'light', 'heavy', 'fast', 'slow'
  ];
  const vividLanguageRegex = new RegExp(`\\b(${vividWords.join('|')})\\b`, 'gi');
  const hasVividLanguage = (story.match(vividLanguageRegex) || []).length >= 3;

  const characterDevelopmentWords = [
    'realized', 'learned', 'understood', 'changed', 'grew', 'decided', 'felt', 'thought', 'discovered', 'transformed',
    'reflected', 'pondered', 'considered', 'questioned', 'doubted', 'believed', 'hoped', 'feared'
  ];
  const characterDevelopmentRegex = new RegExp(`\\b(${characterDevelopmentWords.join('|')})\\b`, 'gi');
  const hasCharacterDevelopment = (story.match(characterDevelopmentRegex) || []).length >= 2;

  const qualityChecks = {
    wordCount,
    hasSufficientLength,
    hasDialogue,
    hasStructure,
    hasVividLanguage,
    hasCharacterDevelopment
  };

  const criteriaMet = [hasSufficientLength, hasDialogue, hasStructure, hasVividLanguage, hasCharacterDevelopment].filter(Boolean).length;
  qualityChecks.passesAllCriteria = criteriaMet >= 4; // Pass if at least 4 out of 5 criteria are met

  return qualityChecks;
}

function isContentAppropriate(story) {
  const lowerCaseStory = story.toLowerCase();
  const inappropriateContent = [
    'explicit sexual content',
    'graphic violence',
    'hate speech',
    'discrimination',
    'illegal activities',
    'profanity',
    'blasphemy'
  ];

  const hasIslamicThemes = lowerCaseStory.includes('islam') || 
                           lowerCaseStory.includes('muslim') || 
                           lowerCaseStory.includes('quran') || 
                           lowerCaseStory.includes('allah') ||
                           (lowerCaseStory.includes('god') && lowerCaseStory.includes('religion'));

  const respectfulToIslam = !lowerCaseStory.includes('anti-islamic') && 
                            !lowerCaseStory.includes('islamophobia');

  return !inappropriateContent.some(term => lowerCaseStory.includes(term)) && 
         (!hasIslamicThemes || (hasIslamicThemes && respectfulToIslam));
}