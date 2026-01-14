const { processTranscription, analyzeSalesMode, analyzeSentiment } = require('../utils/salesAI');

exports.handleSalesUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File missing!" });
        }

        // Hum download nahi karenge, seedha Cloudinary ka URL processTranscription ko bhejenge
        const fileUrl = req.file.path; 
        console.log("Processing direct URL:", fileUrl);

        // Step 1: Transcription
        const text = await processTranscription(fileUrl);
        
        // Step 2: Analysis
        const salesInsights = await analyzeSalesMode(text);
        const sentiment = await analyzeSentiment(text);

        res.json({
            success: true,
            transcription: text,
            salesInsights: salesInsights,
            sentiment: sentiment,
            summary: salesInsights,
            status: "Success"
        });

    } catch (err) {
        console.error("Controller Error:", err.message);
        res.status(500).json({ message: "Processing failed: " + err.message });
    }
};