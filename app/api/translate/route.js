import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    const { text, targetLang } = await request.json();
    
    try {
        const apiResponse = await axios({
            method: 'POST',
            url: 'https://api.deepl.com/v2/translate',
            headers: {
                'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data: {
                text: [text],
                target_lang: targetLang
            }
        });
        return NextResponse.json({ translatedText: apiResponse.data.translations[0].text });
    } catch (error) {
        console.error('Error translating text:', error);
        return NextResponse.json(
            { message: 'Failed to translate text', details: error.response?.data || error.message },
            { status: 500 }
        );
    }
}