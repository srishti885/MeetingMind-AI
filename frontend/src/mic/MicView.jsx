import React from 'react';
import { startNeuralMic, stopNeuralMic } from './NeuralMic';
import './NeuralMic.css';

const MicView = ({ 
    isListening, 
    setIsListening, 
    status, 
    setStatus, 
    setSummary, 
    setCurrentView, 
    setSentiment, 
    setActionItems 
}) => {
    return (
        <div className={`neural-mic-container ${isListening ? 'active' : ''}`} 
             style={{ 
                borderRadius: '28px', 
                padding: '25px 35px', 
                position: 'relative',
                overflow: 'hidden',
                margin: '0 auto',
                width: '100%',
                maxWidth: '800px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                // White Theme Specifics
                background: isListening ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                border: isListening ? '1px solid #007aff' : '1px solid #e5e5e7',
                boxShadow: isListening ? '0 20px 40px rgba(0, 122, 255, 0.1)' : '0 10px 30px rgba(0,0,0,0.04)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
             }}>
            
            {/* Subtle Blue Aura for White Theme */}
            {isListening && <div className="mic-aura-white" style={{ position: 'absolute', left: '-50px', opacity: 0.1 }} />}

            <div style={{ display: 'flex', alignItems: 'center', gap: '22px', position: 'relative', zIndex: 1 }}>
                
                {/* Main Pro Button */}
                <div 
                    onClick={() => {
                        if (isListening) {
                            stopNeuralMic();
                            setIsListening(false);
                        } else {
                            startNeuralMic(setIsListening, setStatus, setSummary, setCurrentView, setSentiment, setActionItems);
                        }
                    }}
                    className={isListening ? "mic-btn-active" : "mic-btn-idle"}
                    style={{
                        width: '68px', height: '68px', borderRadius: '20px',
                        background: isListening ? '#007aff' : '#f5f5f7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                >
                    {isListening ? (
                        <div className="wave-bars-container">
                            {[...Array(5)].map((_, i) => <div key={i} className="wave-bar-pro"></div>)}
                        </div>
                    ) : (
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2.5">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        </svg>
                    )}
                </div>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 style={{ margin: 0, color: '#1d1d1f', fontSize: '19px', fontWeight: '700', letterSpacing: '-0.3px' }}>
                            {isListening ? "Neural Engine" : "Voice Intelligence"}
                        </h4>
                        {isListening && (
                            <div style={{ 
                                background: '#007aff', color: '#fff', padding: '2px 8px', 
                                borderRadius: '6px', fontSize: '10px', fontWeight: '900' 
                            }}>LIVE</div>
                        )}
                    </div>
                    <p style={{ 
                        margin: '4px 0 0', fontSize: '14px', 
                        color: isListening ? '#007aff' : '#86868b', 
                        fontWeight: '500', maxWidth: '450px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                        {status || "Ready to assist..."}
                    </p>
                </div>
            </div>

            <div style={{ textAlign: 'right', paddingLeft: '30px', position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '10px', color: '#86868b', fontWeight: '800', letterSpacing: '0.5px' }}>SAMPLING</div>
                <div style={{ color: isListening ? '#007aff' : '#1d1d1f', fontSize: '15px', fontWeight: '700' }}>
                    {isListening ? "Hi-Res" : "Standby"}
                </div>
            </div>
        </div>
    );
};

export default MicView;