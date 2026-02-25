const { GoogleAuth } = require('google-auth-library');
require('dotenv').config({ path: '.env' });

async function testImageGen() {
  try {
    const fetch = require('node-fetch') || globalThis.fetch;
    const apiKey = process.env.GEMINI_API_KEYS?.split(',')[0];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Programming python code on screen" }] }],
        generationConfig: { responseMimeType: "image/jpeg" }
      })
    });
    
    const data = await response.json();
    console.log(response.status);
    console.log(data);
  } catch(e) { console.error(e) }
}
testImageGen();
