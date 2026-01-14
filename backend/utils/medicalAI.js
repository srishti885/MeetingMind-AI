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
                    content: `You are a Medical AI Scribe. Analyze the transcript and generate a highly detailed report in this format:
                    
                    1. CONVERSATION BREAKDOWN: (Identify who said what - e.g., Doctor, Patient, Attendant).
                    2. PATIENT SYMPTOMS & CONCERNS: (List all symptoms discussed).
                    3. CLINICAL OBSERVATIONS: (Key points from the doctor's perspective).
                    4. DIAGNOSIS & PLAN: (A formal SOAP note summary).
                    5. MEDICATIONS/TESTS: (List any prescriptions or lab tests mentioned).
                    6. ACTION ITEMS: (Follow-up dates or immediate next steps).
                    
                    Use clear headings and bullet points for readability.` 
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
                { 
                    role: "system", 
                    content: "Analyze the patient's emotional state from the transcript. Return JSON ONLY: { 'score': number, 'label': 'Positive/Concerned/Neutral', 'color': 'hex' }" 
                },
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