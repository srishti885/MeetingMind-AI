// src/features/medical/MedicalDashboard.js
import React from 'react';

const MedicalDashboard = ({ file, handleFileChange, uploadAudio, loading, progress, status }) => {
  return (
    <div className="medical-container" style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease', width: '100%' }}>
      <div style={{ 
        padding: '50px 40px', 
        background: '#ffffff', 
        borderRadius: '30px', 
        border: '1.5px dashed #ff3b30',
        boxShadow: '0 20px 40px rgba(255, 59, 48, 0.03)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        
        {/* --- ICON --- */}
        <div style={{ 
          background: '#fff5f5', width: '80px', height: '80px', borderRadius: '20px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' 
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>

        <h3 style={{ fontWeight: '800', fontSize: '24px', color: '#1d1d1f', marginBottom: '10px' }}>
          Clinical Neural Link
        </h3>
        <p style={{ color: '#86868b', maxWidth: '400px', margin: '0 auto 30px', fontSize: '15px', lineHeight: '1.5' }}>
          Securely upload patient consultations for instant clinical transcription and SOAP notes.
        </p>
        
        {/* --- SELECT BUTTON --- */}
        <input 
          type="file" 
          accept="audio/*" 
          onChange={handleFileChange} 
          id="med-file" 
          style={{ display: 'none' }} 
          disabled={loading} // Upload ke waqt button disable
        />
        
        <label htmlFor="med-file" style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 35px', 
          background: loading ? '#f2f2f7' : '#ff3b30', 
          color: loading ? '#8e8e93' : 'white', 
          borderRadius: '16px', 
          cursor: loading ? 'not-allowed' : 'pointer', 
          fontWeight: '700',
          transition: 'all 0.3s ease'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
          </svg>
          {file ? `File: ${file.name.substring(0, 15)}...` : 'Select Patient Audio'}
        </label>

        {/* --- FIXED PROGRESS BAR SECTION (Boundary Locked) --- */}
        {loading && (
          <div style={{ 
            marginTop: '40px',
            width: '90%',
            marginLeft: '5%',
            boxSizing: 'border-box'
          }}>
            <div style={{ 
              width: '100%',
              height: '10px', 
              background: 'rgba(255, 59, 48, 0.1)', 
              borderRadius: '20px', 
              overflow: 'hidden', 
              position: 'relative',
              border: '1px solid rgba(255, 59, 48, 0.05)'
            }}>
              <div style={{ 
                width: `${Math.min(Math.max(progress, 0), 100)}%`, 
                height: '100%', 
                background: '#ff3b30', 
                borderRadius: '20px',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
              <span style={{ fontSize: '12px', color: '#ff3b30', fontWeight: '800', letterSpacing: '0.5px' }}>
                {status || 'Analysing Clinical Audio...'}
              </span>
              <span style={{ fontSize: '12px', color: '#ff3b30', fontWeight: '800' }}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        )}

        {/* --- PROCESS BUTTON --- */}
        {file && !loading && (
          <div style={{ marginTop: '25px', animation: 'fadeIn 0.4s ease' }}>
            <button 
              onClick={uploadAudio} 
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto', 
                padding: '14px 30px', background: '#1d1d1f', color: 'white', borderRadius: '14px', 
                border: 'none', fontWeight: '600', cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s active'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              Generate Medical Report
            </button>
            <p style={{ fontSize: '11px', color: '#86868b', marginTop: '10px' }}>
              Ready for clinical analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalDashboard;