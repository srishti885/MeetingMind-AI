require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Groq = require('groq-sdk');

// --- 1. Import Routes ---
const salesRoutes = require('./routes/salesRoutes');
const medicalRoutes = require('./routes/medicalRoutes');

const app = express();

// Middleware: ORIGIN "*" zaroori hai Render deployment ke liye
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
})); 
app.use(express.json());

// Database Connection: MongoDB URL environment variable se lega
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URL;
mongoose.connect(mongoURI)
  .then(() => console.log("Database Connected Successfully"))
  .catch(err => console.log("DB Connection Error:", err));

// --- 2. Middleware Routes ---
app.use('/api/sales', salesRoutes); 
app.use('/api/medical', medicalRoutes);

// Base Route (Render health check ke liye zaroori hai)
app.get('/', (req, res) => {
  res.send('Neural Studio Backend is Live!');
});

// --- 3. General Mode Helpers ---
const { upload } = require('./config/cloudinaryConfig'); 
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const processTranscription = async (filePath) => {
    const transcription = await groq.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-large-v3",
        response_format: "verbose_json", 
    });
    return transcription.text;
};

const generateSummary = async (text) => {
    const completion = await groq.chat.completions.create({
        messages: [{ role: "system", content: "Summarize this meeting transcript." }, { role: "user", content: text }],
        model: "llama-3.3-70b-versatile", 
    });
    return completion.choices[0]?.message?.content;
};

// Original General Endpoint
app.post('/api/upload', upload.single('audio'), async (req, res) => {
    const tempFile = path.join(__dirname, `temp_${Date.now()}.mp3`);
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded!" });
        const response = await axios({ url: req.file.path, method: 'GET', responseType: 'stream' });
        const writer = fs.createWriteStream(tempFile);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            try {
                const text = await processTranscription(tempFile);
                const summary = await generateSummary(text);
                if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
                res.json({ transcription: text, summary: summary });
            } catch (error) {
                if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
                res.status(500).json({ message: "AI Analysis failed." });
            }
        });
    } catch (err) {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        res.status(500).json({ message: "Upload failed." });
    }
});

// --- 4. SERVER START & TIMEOUT FIX ---
// PORT Render process.env se uthayega
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// AI analysis ke liye timeout
server.timeout = 300000;