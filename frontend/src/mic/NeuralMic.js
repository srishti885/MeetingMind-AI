// src/mic/NeuralMic.js
let recognitionInstance = null; 

// --- NEW: Helper function to call Backend (Original logic preserved) ---
const fetchAIReport = async (text, mode, setSummary, setActionItems) => {
    try {
        const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: text, 
                mode: mode || 'general',
                isRawText: true 
            })
        });
        const data = await response.json();
        if (data.success || data.summary) {
            if (typeof setSummary === 'function') setSummary(data.summary);
            if (typeof setActionItems === 'function' && data.actionItems) setActionItems(data.actionItems);
        }
    } catch (err) {
        console.error("AI Analysis failed to trigger:", err);
    }
};

export const stopNeuralMic = () => {
    if (recognitionInstance) {
        recognitionInstance.onend = null; 
        recognitionInstance.stop();
        recognitionInstance = null;
    }
};

export const startNeuralMic = (setIsListening, setStatus, setSummary, setCurrentView, setSentiment, setActionItems, selectedMode) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    const safeUpdate = (func, value) => {
        if (typeof func === 'function') func(value);
    };

    if (!SpeechRecognition) {
        safeUpdate(setStatus, "Neural Engine: Browser not supported.");
        return;
    }

    if (recognitionInstance) {
        recognitionInstance.onend = null;
        recognitionInstance.stop();
    }

    recognitionInstance = new SpeechRecognition();
    const recognition = recognitionInstance;
    
    recognition.lang = 'en-US'; 
    recognition.interimResults = true; 
    recognition.continuous = true; 

    recognition.onstart = () => {
        safeUpdate(setIsListening, true);
        safeUpdate(setStatus, "Listening...");
    };

    recognition.onresult = (event) => {
        let transcript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        if (interimTranscript) {
            safeUpdate(setStatus, interimTranscript);
        }

        const lowerTranscript = (transcript || interimTranscript).toLowerCase();

        if (lowerTranscript.includes("open vault")) safeUpdate(setCurrentView, 'storage');
        if (lowerTranscript.includes("go home")) safeUpdate(setCurrentView, 'home');

        if (event.results[event.results.length - 1].isFinal) {
            const finalSpeech = event.results[event.results.length - 1][0].transcript;
            
            if (typeof setSummary === 'function') {
                setSummary((prev) => (prev ? prev + " " + finalSpeech.trim() : finalSpeech.trim()));
            }

            // --- FIXED: Trigger AI Report when user finishes a sentence ---
            if (finalSpeech.trim().length > 5) {
                fetchAIReport(finalSpeech.trim(), selectedMode, setSummary, setActionItems);
            }
            
            if ((lowerTranscript.includes("will") || lowerTranscript.includes("need to")) && typeof setActionItems === 'function') {
                const newTask = { id: Date.now(), task: finalSpeech.trim(), owner: "User" };
                setActionItems((prev) => [...prev, newTask]);
            }
        }
    };

    recognition.onerror = (event) => {
        if (event.error === 'no-speech') return;
        safeUpdate(setIsListening, false);
        safeUpdate(setStatus, "Mic " + event.error);
    };

    recognition.onend = () => {
        if (recognitionInstance === recognition) {
            safeUpdate(setIsListening, false);
            setTimeout(() => safeUpdate(setStatus, "Ready"), 1500);
        }
    };

    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            const ctx = new AudioContext();
            if (ctx.state === 'suspended') ctx.resume();
        }
        recognition.start();
    } catch (e) {
        safeUpdate(setStatus, "System Offline");
    }
};