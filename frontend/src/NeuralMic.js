// NeuralMic.js - High Sensitivity Voice Engine
let recognitionInstance = null; 

/**
 * Mic ko manually band karne ke liye function
 */
export const stopNeuralMic = () => {
    if (recognitionInstance) {
        recognitionInstance.stop();
        recognitionInstance = null;
    }
};

/**
 * Mic ko start karne ke liye main function
 */
export const startNeuralMic = (setIsListening, setStatus, setSummary, setCurrentView, setSentiment, setActionItems) => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    
    if (!SpeechRecognition) {
        alert("Please use Chrome browser for Neural Mic to work.");
        return;
    }

    // Safety: Agar pehle se koi instance chal raha ho toh use khatam karo
    if (recognitionInstance) {
        recognitionInstance.stop();
    }

    recognitionInstance = new SpeechRecognition();
    const recognition = recognitionInstance;
    
    // Configuration for maximum sensitivity
    recognition.lang = 'en-US'; 
    recognition.interimResults = true; 
    recognition.continuous = true; 
    recognition.maxAlternatives = 1;

    // --- EVENT: Mic Start ---
    recognition.onstart = () => {
        setIsListening(true);
        setStatus("Neural Mic: System Active. Speak Loudly...");
        console.log("Mic system is recording...");
    };

    // --- EVENT: Result Processing ---
    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        const transcript = finalTranscript || interimTranscript;
        
        // Status Update (Live feedback)
        if (transcript) {
            setStatus(`Hearing: ${transcript}`);
        }

        const lowerTranscript = transcript.toLowerCase();

        // 1. Navigation Logic (Your Original Logic - Untouched)
        if (lowerTranscript.includes("open vault") || lowerTranscript.includes("storage")) {
            setCurrentView('storage');
        } else if (lowerTranscript.includes("go home")) {
            setCurrentView('home');
        } else if (lowerTranscript.includes("workspace") || lowerTranscript.includes("studio")) {
            setCurrentView('workspace');
        }

        // 2. Final Sentence & Task Processing (Your Original Logic - Optimized)
        if (finalTranscript) {
            // Update Summary
            setSummary((prev) => prev + " " + finalTranscript);
            
            // Task Detection: "will" or "need to"
            if (lowerTranscript.includes("will") || lowerTranscript.includes("need to")) {
                const newTask = { 
                    id: Date.now(), 
                    task: finalTranscript.trim(), 
                    owner: "User",
                    timestamp: new Date().toLocaleTimeString() 
                };
                
                // Spread operator used to keep existing tasks
                if(setActionItems) {
                    setActionItems((prev) => [...prev, newTask]);
                }
            }
            setStatus("Neural Mic: Captured");
        }
    };

    // --- EVENT: Error Handling ---
    recognition.onerror = (event) => {
        setIsListening(false);
        recognitionInstance = null;
        
        if (event.error === 'no-speech') {
            setStatus("No sound detected. Is your mic muted?");
        } else if (event.error === 'not-allowed') {
            setStatus("Permission Denied: Allow Mic in Browser.");
        } else {
            setStatus("Mic Error: " + event.error);
        }
    };

    // --- EVENT: Mic End ---
    recognition.onend = () => {
        setIsListening(false);
        recognitionInstance = null;
    };

    // --- Execution ---
    try {
        recognition.start();
    } catch (e) {
        console.log("Recognition restart attempt...");
    }
};