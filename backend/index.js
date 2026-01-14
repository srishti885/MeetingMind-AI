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

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
})); 
app.use(express.json());

// Database Connection
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URL;
mongoose.connect(mongoURI)
  .then(() => console.log("Database Connected Successfully"))
  .catch(err => console.log("DB Connection Error:", err));

// --- 2. Middleware Routes ---
app.use('/api/sales', salesRoutes); 
app.use('/api/medical', medicalRoutes);

// Base Route
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

// --- NEW: Mode-Based Prompt Logic (Detailed) ---
const generateDetailedSummary = async (text, mode = "general") => {
    let systemInstruction = "";
    if (mode === "sales") {
        systemInstruction = "You are a Sales Expert. Provide a detailed report with SPEAKER BREAKDOWN, PAIN POINTS, BUDGET, and NEXT STEPS.";
    } else if (mode === "medical") {
        systemInstruction = "You are a Medical AI. Provide a Clinical Report with SPEAKER BREAKDOWN, SYMPTOMS, DIAGNOSIS, and PRESCRIPTIONS.";
    } else {
        systemInstruction = "You are a Professional Assistant. Provide a report with SPEAKER BREAKDOWN, KEY DISCUSSION POINTS, and ACTION ITEMS.";
    }

    const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemInstruction }, 
            { role: "user", content: text }
        ],
        model: "llama-3.3-70b-versatile", 
    });
    return completion.choices[0]?.message?.content;
};

// Updated General Endpoint
app.post('/api/upload', upload.single('audio'), async (req, res) => {
    const tempFile = path.join(__dirname, `temp_${Date.now()}.mp3`);
    const mode = req.body.mode || "general"; 

    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded!" });
        const response = await axios({ url: req.file.path, method: 'GET', responseType: 'stream' });
        const writer = fs.createWriteStream(tempFile);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            try {
                const text = await processTranscription(tempFile);
                const report = await generateDetailedSummary(text, mode);

                if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
                
                // --- CRITICAL FIX: Frontend Dashboard Sync ---
                res.json({ 
                    success: true,
                    transcription: text, 
                    summary: report,            // For General Mode
                    salesInsights: report,     // For Sales Mode Dashboard
                    medicalInsights: report,   // For Medical Mode Dashboard
                    sentiment: { score: 85, label: "Positive", color: "#007aff" },
                    actionItems: [
                        { id: 1, task: "Review AI Report", owner: "User", status: "High Priority" }
                    ]
                });

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

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
server.timeout = 300000;