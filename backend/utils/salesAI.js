const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const fs = require('fs');

// 1. Awaaz ko Text mein badalna
const processTranscription = async (filePath) => {
    try {
        console.log("Groq is transcribing...");
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-large-v3",
            response_format: "verbose_json",
        });
        return transcription.text;
    } catch (error) {
        console.error("Groq Transcription Error:", error.message);
        return "Transcription failed.";
    }
};

// 2. Sales Report Generate karna (Jo pehle breakdown deta tha)
const analyzeSalesMode = async (text) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `You are a Sales AI Expert. Analyze the meeting transcript and provide a structured report:
                    - WHO SAID WHAT: (Identify speakers and their main points)
                    - KEY SALES POINTS: (Budget, Pricing, Deal status)
                    - CLIENT PAIN POINTS: (What problems did they mention?)
                    - ACTION ITEMS: (Follow-ups and next steps)
                    Format the output clearly with bullet points.` 
                },
                { role: "user", content: text }
            ],
            model: "llama-3.3-70b-versatile",
        });
        return completion.choices[0]?.message?.content || "No insights generated.";
    } catch (error) {
        console.error("Sales Analysis Error:", error.message);
        return "Analysis failed.";
    }
};

// 3. Sentiment Check karna
const analyzeSentiment = async (text) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "Analyze the sentiment of this transcript. Return a JSON object with: { score: (0-100), label: ('Positive', 'Neutral', 'Negative'), color: (hex code) }" 
                },
                { role: "user", content: text }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" } // Isse structured data milega
        });
        return JSON.parse(completion.choices[0]?.message?.content);
    } catch (error) {
        return { score: 50, label: 'Neutral', color: '#667c99' };
    }
};

// Teeno ko export karna zaroori hai
module.exports = { processTranscription, analyzeSalesMode, analyzeSentiment };