const axios = require('axios');

const transcribeAudio = async (audioUrl) => {
    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
            { inputs: audioUrl },
            { headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` } }
        );
        return response.data.text;
    } catch (error) {
        console.error("AI Error:", error);
        return "Transcription failed.";
    }
};

module.exports = { transcribeAudio };