const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { processTranscription, analyzeMedicalMode, analyzeSentiment } = require('../utils/medicalAI');

exports.handleMedicalUpload = async (req, res) => {
    const tempFile = path.join(__dirname, `../temp_med_${Date.now()}.mp3`);
    
    try {
        if (!req.file) return res.status(400).json({ message: "File missing!" });

        const response = await axios({ url: req.file.path, method: 'GET', responseType: 'stream' });
        const writer = fs.createWriteStream(tempFile);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            try {
                const text = await processTranscription(tempFile);
                const medicalSummary = await analyzeMedicalMode(text); 
                const sentiment = await analyzeSentiment(text);
                
                if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

                res.json({ 
                    transcription: text, 
                    summary: medicalSummary, 
                    sentiment: sentiment,
                    status: "Medical Analysis Complete"
                });
            } catch (error) {
                if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
                res.status(500).json({ message: "AI Logic Error" });
            }
        });
    } catch (err) {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        res.status(500).json({ message: "Server Error" });
    }
};