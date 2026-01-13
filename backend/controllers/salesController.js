const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Dhyaan dein: Humein '../utils/salesAI' se functions import karne hain
const { 
    processTranscription, 
    analyzeSalesMode, 
    analyzeSentiment 
} = require('../utils/salesAI');

/**
 * Handle Sales Audio/Video Upload and AI Analysis
 */
exports.handleSalesUpload = async (req, res) => {
    // Temp file path: Root folder me ek unique mp3 file banayega
    const tempFile = path.join(__dirname, `../temp_sales_${Date.now()}.mp3`);
    
    try {
        // 1. Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: "Sales file missing!" });
        }

        console.log("Downloading file from Cloudinary...");
        
        // 2. Cloudinary URL se file stream ke zariye download karna
        const response = await axios({ 
            url: req.file.path, 
            method: 'GET', 
            responseType: 'stream' 
        });

        const writer = fs.createWriteStream(tempFile);
        response.data.pipe(writer);

        // 3. Jab file poori tarah write ho jaye, tab AI processing start hogi
        writer.on('finish', async () => {
            try {
                console.log("File saved. Starting AI Analysis...");

                // STEP A: Speech to Text (Groq Whisper)
                const text = await processTranscription(tempFile);
                
                // STEP B: Sales Specific Insights (Deal status, pain points, etc.)
                const salesInsights = await analyzeSalesMode(text); 
                
                // STEP C: Customer Sentiment Analysis
                const sentiment = await analyzeSentiment(text);
                
                // 4. Processing ke baad temp file delete karna (Storage bachane ke liye)
                if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                }

                console.log("Sales Analysis Complete.");

                // 5. Frontend ko final structured data bhejna
                res.json({ 
                    transcription: text, 
                    salesInsights: salesInsights, // JSON Object for Dashboard
                    sentiment: sentiment,         // Score, Label, Color
                    summary: "Sales Insights Generated Successfully.", // Key for UI Box
                    status: "Success"
                });

            } catch (error) {
                console.error("AI Processing Error:", error);
                if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
                res.status(500).json({ message: "AI Analysis failed inside controller" });
            }
        });

        // Handle stream errors
        writer.on('error', (err) => {
            console.error("File Stream Error:", err);
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
            res.status(500).json({ message: "File processing error." });
        });

    } catch (err) {
        console.error("Controller Main Error:", err.message);
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        res.status(500).json({ message: "Sales upload and analysis failed" });
    }
};