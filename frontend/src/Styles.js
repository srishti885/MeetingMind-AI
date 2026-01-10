export const styles = {
    // --- BASIC THEME COLORS (Clean Apple Light) ---
    appContainerStyle: { 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        backgroundColor: '#FFFFFF', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#1d1d1f' 
    },

    navStyle: { 
        height: '80px', 
        backgroundColor: 'rgba(255,255,255,0.8)', 
        backdropFilter: 'blur(20px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 8%', 
        borderBottom: '1px solid #d2d2d7', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100 
    },

    // --- CARDS & BOXES (Added Hover Effects) ---
    contentCard: { 
        background: '#ffffff', 
        padding: '40px', 
        borderRadius: '24px', 
        border: '1px solid #d2d2d7', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },

    studioWrapperStyle: { 
        background: '#f5f5f7', 
        padding: '45px', 
        borderRadius: '35px', 
        border: '1px solid #d2d2d7',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
    },

    uploadBoxStyle: { 
        border: '2px dashed #007aff', 
        padding: '50px', 
        borderRadius: '25px', 
        textAlign: 'center', 
        backgroundColor: '#ffffff',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer'
    },

    // --- TEXT & TYPOGRAPHY ---
    mainTitleStyle: { 
        fontSize: '62px', 
        fontWeight: '900', 
        letterSpacing: '-2px', 
        marginBottom: '20px',
        color: '#1d1d1f',
        lineHeight: '1.1'
    },

    pageTitle: { fontSize: '36px', fontWeight: '800', marginBottom: '30px', textAlign: 'center', color: '#1d1d1f' },
    paragraph: { fontSize: '17px', lineHeight: '1.8', color: '#424245' },
    labelStyle: { fontSize: '14px', fontWeight: '600', color: '#86868b', marginBottom: '8px' },

    // --- BUTTONS (Enhanced Interactions) ---
    heroButtonStyle: { 
        background: '#1d1d1f', 
        color: '#ffffff', 
        border: 'none', 
        padding: '18px 40px', 
        borderRadius: '16px', 
        fontWeight: '700', 
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
    },

    heroButtonStyleSmall: { background: '#007aff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', transition: '0.2s' },
    uploadButtonStyle: { width: '100%', padding: '16px', borderRadius: '12px', background: '#007aff', color: 'white', fontWeight: '700', border: 'none', cursor: 'pointer', transition: '0.3s' },
    pdfButtonStyle: { background: '#f5f5f7', color: '#1d1d1f', border: '1px solid #d2d2d7', padding: '14px 28px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: '0.2s' },
    smallActionBtn: { border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#1d1d1f', background: '#e5e5ea' },
    authToggleBtn: { background: 'none', border: '1px solid #d2d2d7', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#007aff' },

    // --- INPUTS ---
    inputStyle: { padding: '14px', borderRadius: '12px', border: '1px solid #d2d2d7', outline: 'none', background: '#ffffff', color: '#1d1d1f', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s' },
    
    // --- SPECIAL ELEMENTS ---
    badgeStyle: { background: 'rgba(0, 122, 255, 0.1)', color: '#007aff', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', marginBottom: '25px', display: 'inline-block' },
    largeLogoIconStyle: { width: '52px', height: '52px', background: '#007aff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0, 122, 255, 0.2)' },
    statusPanelStyle: { background: '#1d1d1f', color: '#007aff', padding: '35px', borderRadius: '25px', border: '1px solid #333', fontFamily: 'SF Mono, monospace', minHeight: '100px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
    summaryContentStyle: { background: '#ffffff', padding: '35px', borderRadius: '24px', borderLeft: '6px solid #007aff', whiteSpace: 'pre-wrap', color: '#1d1d1f', lineHeight: '1.8', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' },
    progressBarStyle: { position: 'fixed', top: 0, left: 0, height: '4px', background: 'linear-gradient(90deg, #007aff, #5856d6)', zIndex: 1001 },
    avatarStyle: { width: '38px', height: '38px', borderRadius: '12px', background: '#1d1d1f', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
    
    // --- MIC & CALENDAR STYLES ---
    neuralMicBtn: {
        width: '65px', height: '65px', borderRadius: '50%', background: '#ff3b30', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none',
        cursor: 'pointer', boxShadow: '0 8px 25px rgba(255, 59, 48, 0.4)', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    },
    calendarSyncCard: {
        background: 'linear-gradient(135deg, #007aff 0%, #0056b3 100%)',
        padding: '25px', borderRadius: '20px', color: 'white',
        display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px', boxShadow: '0 15px 30px rgba(0,122,255,0.3)'
    },

    // --- WOW FEATURES: DASHBOARD & TASKS ---
    statsCard: {
        background: '#ffffff', padding: '20px', borderRadius: '18px', border: '1px solid #d2d2d7',
        textAlign: 'center', transition: '0.3s'
    },
    taskItemStyle: {
        display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', 
        background: '#f5f5f7', borderRadius: '14px', marginBottom: '12px',
        border: '1px solid transparent', transition: '0.2s'
    },
    taskBadge: {
        fontSize: '10px', padding: '4px 10px', borderRadius: '6px', 
        background: '#007aff', color: 'white', fontWeight: '700', textTransform: 'uppercase'
    },

    // --- LAYOUT ---
    mainContentStyle: { flex: '1' },
    pagePadding: { padding: '60px 8%' },
    footerStyle: { padding: '50px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #d2d2d7', backgroundColor: '#f5f5f7', color: '#86868b' }
};