const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const fs = require('fs');

const processTranscription = async (filePath) => {
    try {
        console.log("Groq is transcribing...");
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(filePath), // Local temp file ko read karna
            model: "whisper-large-v3",
            response_format: "verbose_json",
        });
        return transcription.text;
    } catch (error) {
        console.error("Groq Transcription Error:", error.message);
        return "Transcription failed.";
    }
};

module.exports = { processTranscription };