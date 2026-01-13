import React from 'react';
import './Medical.css';

const MedicalView = ({ summary, loading, progress, status }) => {
  const isStructured = typeof summary === 'object' && summary !== null;

  return (
    <div className="medical-studio-card">
      {/* --- HEADER SECTION --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ 
            color: '#007aff', 
            background: 'rgba(0, 122, 255, 0.08)', 
            padding: '12px', 
            borderRadius: '16px',
            boxShadow: 'inset 0 0 10px rgba(0, 122, 255, 0.05)' 
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <span className="medical-header-badge-pro">ANALYSIS ENGINE</span>
            <h3 style={{ margin: '2px 0 0 0', fontWeight: '700', color: '#1d1d1f', fontSize: '20px', letterSpacing: '-0.5px' }}>
              Clinical Intelligence
            </h3>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#86868b', fontWeight: '600' }}>SESSION ID: {Math.floor(Math.random() * 9000) + 1000}</p>
          <p style={{ margin: '4px 0 0', fontSize: '10px', color: '#34c759', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', background: '#34c759', borderRadius: '50%' }}></span>
            ENCRYPTED NODE
          </p>
        </div>
      </div>

      {/* --- PROGRESS BAR (Apple Style) --- */}
      {loading && (
        <div style={{ marginBottom: '30px', width: '100%' }}>
          <div style={{ 
            width: '100%', height: '4px', background: '#f2f2f7', 
            borderRadius: '10px', overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${progress}%`, height: '100%', background: '#007aff', 
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 8px rgba(0, 122, 255, 0.4)'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <span style={{ fontSize: '12px', color: '#007aff', fontWeight: '600', letterSpacing: '0.2px' }}>{status}</span>
            <span style={{ fontSize: '12px', color: '#86868b', fontWeight: '700' }}>{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {/* --- CONTENT AREA --- */}
      <div className="medical-glass-content">
        <div className="soap-container-pro">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ background: '#f2f2f7', padding: '6px', borderRadius: '8px' }}>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#86868b', letterSpacing: '1px' }}>SOAP OBSERVATIONS</span>
          </div>
          
          <div style={{ color: '#1d1d1f', fontSize: '15px', lineHeight: '1.6' }}>
            {loading ? (
               <div className="skeleton-text-container">
                 <div className="skeleton-line"></div>
                 <div className="skeleton-line" style={{ width: '80%' }}></div>
               </div>
            ) : isStructured ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { label: 'SUBJECTIVE', val: summary.subjective },
                  { label: 'OBJECTIVE', val: summary.objective },
                  { label: 'ASSESSMENT', val: summary.assessment },
                  { label: 'PLAN', val: summary.plan }
                ].map((item, idx) => item.val && (
                  <div key={idx} className="soap-item-card">
                    <strong style={{ color: '#007aff', fontSize: '11px', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>{item.label}</strong>
                    <p style={{ margin: 0, color: '#424245' }}>{item.val}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ whiteSpace: 'pre-wrap', margin: 0, color: (summary ? '#1d1d1f' : '#86868b'), fontStyle: (summary ? 'normal' : 'italic') }}>
                {summary || "Awaiting neural input..."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalView;