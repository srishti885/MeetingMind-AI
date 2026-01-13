import React, { useState } from 'react';

const ModeSelector = ({ selectedMode, setSelectedMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const modes = {
    general: { 
      label: 'General AI', color: '#007aff', bg: 'rgba(0, 122, 255, 0.1)',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18.1H3"/></svg>
    },
    sales: { 
      label: 'Sales Intel', color: '#34c759', bg: 'rgba(52, 199, 89, 0.1)',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    },
    medical: { 
      label: 'Medical AI', color: '#ff3b30', bg: 'rgba(255, 59, 48, 0.1)',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    }
  };

  const current = modes[selectedMode] || modes.general;

  // Internal Styles for Depth
  const styles = {
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 18px',
      background: '#ffffff',
      border: '1px solid #d2d2d7',
      borderRadius: '16px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
      transition: 'all 0.2s ease',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: '0',
      marginTop: '10px',
      width: '220px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '18px',
      border: '1px solid rgba(0,0,0,0.1)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      padding: '8px',
      zIndex: 1000,
      overflow: 'hidden'
    },
    option: (isActive, modeColor) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 14px',
      width: '100%',
      border: 'none',
      background: isActive ? 'rgba(0,0,0,0.03)' : 'transparent',
      borderRadius: '12px',
      cursor: 'pointer',
      color: isActive ? modeColor : '#424245',
      fontWeight: '600',
      transition: 'background 0.2s ease'
    })
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Active Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={styles.button}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ 
          padding: '8px', 
          background: current.bg, 
          color: current.color, 
          borderRadius: '10px', 
          display: 'flex' 
        }}>
          {current.icon}
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '9px', color: '#86868b', fontWeight: '800', letterSpacing: '1px' }}>MODE</div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: current.color }}>{current.label}</div>
        </div>
        <svg style={{ marginLeft: '4px', transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <>
          <div onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
          <div style={styles.dropdown}>
            {Object.entries(modes).map(([id, mode]) => (
              <button 
                key={id} 
                onClick={() => { setSelectedMode(id); setIsOpen(false); }}
                style={styles.option(selectedMode === id, mode.color)}
              >
                <div style={{ color: selectedMode === id ? mode.color : '#86868b' }}>{mode.icon}</div>
                <span style={{ fontSize: '14px' }}>{mode.label}</span>
                {selectedMode === id && (
                   <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: mode.color }} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ModeSelector;