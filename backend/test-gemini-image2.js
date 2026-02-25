require('dotenv').config({ path: '.env' });

async function testImageGen() {
    try {
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

        console.log(response.status);
        const data = await response.json();
        console.log(data);
    } catch (e) { console.error("Error", e.message) }
}
testImageGen();
