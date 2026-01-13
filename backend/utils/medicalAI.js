const Groq = require('groq-sdk');
const fs = require('fs');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const processTranscription = async (filePath) => {
    try {
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-large-v3",
            response_format: "verbose_json", 
        });
        return transcription.text;
    } catch (error) {
        console.error("Transcription Error:", error.message);
        return "Transcription failed.";
    }
};

const analyzeMedicalMode = async (text) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "You are a Medical AI Scribe. Convert the transcript into a formal Clinical SOAP Note (Subjective, Objective, Assessment, Plan)." 
                },
                { role: "user", content: text }
            ],
            model: "llama-3.3-70b-versatile", 
        });
        return completion.choices[0]?.message?.content || "Medical analysis failed.";
    } catch (error) {
        return "Medical analysis failed.";
    }
};

const analyzeSentiment = async (text) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Analyze patient sentiment. Return JSON ONLY: { 'score': number, 'label': 'String', 'color': 'hex' }" },
                { role: "user", content: text }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        return JSON.parse(completion.choices[0].message.content);
    } catch (err) {
        return { score: 50, label: "Neutral", color: "#667c99" };
    }
};

module.exports = { processTranscription, analyzeMedicalMode, analyzeSentiment };