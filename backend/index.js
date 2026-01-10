require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');
const axios = require('axios');
const { upload } = require('./config/cloudinaryConfig'); 

const app = express();
app.use(cors()); 
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected"))
  .catch(err => console.log("DB Connection Error:", err));

// --- 1. Transcription Helper ---
const processTranscription = async (filePath) => {
    try {
        console.log("Processing transcription...");
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-large-v3",
            response_format: "verbose_json", 
        });
        return transcription.text || "No text detected.";
    } catch (error) {
        console.error("Groq Error:", error.message);
        return "Transcription error.";
    }
};

// --- 2. Summary Helper ---
const generateSummary = async (text) => {
    if (!text || text.length < 10 || text.includes("error")) return "Could not generate summary.";
    try {
        console.log("Generating summary...");
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Summarize this meeting transcript into professional bullet points and action items." },
                { role: "user", content: text }
            ],
            model: "llama-3.3-70b-versatile", 
        });
        return completion.choices[0]?.message?.content || "Summary failed.";
    } catch (error) {
        return "Summary failed.";
    }
};

// --- 3. Sentiment Helper (For React State Sync) ---
const analyzeSentiment = async (text) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Analyze sentiment. Return ONLY JSON: { 'score': number, 'label': 'String', 'color': 'hex' }" },
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

// --- Core API Route ---
app.post('/api/upload', upload.single('audio'), async (req, res) => {
    const tempFile = path.join(__dirname, `temp_${Date.now()}.mp3`);
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

        console.log("File received from Cloudinary. Starting analysis...");
        
        const response = await axios({ url: req.file.path, method: 'GET', responseType: 'stream' });
        const writer = fs.createWriteStream(tempFile);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            const text = await processTranscription(tempFile);
            const summary = await generateSummary(text);
            const sentiment = await analyzeSentiment(text);
            
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
            
            console.log("Analysis complete.");
            res.json({ 
                transcription: text, 
                summary: summary,
                sentiment: sentiment,
                fileName: req.file.originalname 
            });
        });

        writer.on('error', (err) => {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
            res.status(500).json({ message: "File processing error." });
        });

    } catch (err) {
        console.error("Route Error:", err.message);
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        res.status(500).json({ message: "Upload and analysis failed." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});