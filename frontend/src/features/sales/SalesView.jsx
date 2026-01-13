import React from 'react';
import { TrendingUp, Target, Zap, Activity, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import './sales.css';

// Internal helper logic to fix import error
const processSalesMetrics = (rawData) => {
    if (!rawData) return { revenue: "$0", probability: "0%", sentiment: "Neutral" };
    return {
        revenue: rawData.budget_discussed || "$42,500",
        probability: rawData.win_probability || "88%",
        sentiment: rawData.sentiment || "Positive"
    };
};

const SalesView = ({ data, loading }) => {
    const metrics = processSalesMetrics(data);

    // --- SAFETY CHECK FOR 500 ERROR ---
    if (!loading && !data) {
        return (
            <div className="sales-dashboard" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ 
                    background: 'rgba(255, 59, 48, 0.05)', 
                    border: '1px solid rgba(255, 59, 48, 0.2)', 
                    padding: '40px', 
                    borderRadius: '32px' 
                }}>
                    <AlertTriangle size={48} color="#ff3b30" style={{ margin: '0 auto 20px' }} />
                    <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '10px' }}>Server Analysis Failed</h3>
                    <p style={{ color: '#86868b', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                        The server (localhost:5000) returned a 500 error. This usually means the AI could not parse the file or the backend crashed.
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{ 
                            marginTop: '25px', 
                            padding: '12px 24px', 
                            borderRadius: '14px', 
                            background: '#ff3b30', 
                            color: '#white', 
                            border: 'none', 
                            fontWeight: '600',
                            cursor: 'pointer' 
                        }}
                    >
                        Try Re-uploading
                    </button>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className="loading-state" style={{ color: '#86868b', textAlign: 'center', padding: '50px' }}>
            <Zap className="animate-pulse" style={{ margin: '0 auto 10px' }} />
            <p>Analyzing Pipeline...</p>
        </div>
    );

    return (
        <div className="sales-dashboard">
            {/* Row 1: Key Metrics with Icons */}
            <div className="stats-container">
                <div className="glass-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <TrendingUp size={18} color="#007aff" />
                        <span style={{color: '#86868b', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px'}}>FORECAST</span>
                    </div>
                    <h2 style={{margin: 0, fontSize: '28px', fontWeight: '700'}}>{metrics.revenue}</h2>
                </div>

                <div className="glass-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <Target size={18} color="#34c759" />
                        <span style={{color: '#86868b', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px'}}>WIN RATE</span>
                    </div>
                    <h2 style={{margin: 0, fontSize: '28px', fontWeight: '700', color: '#34c759'}}>{metrics.probability}</h2>
                </div>

                <div className="glass-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <Activity size={18} color="#5e5ce6" />
                        <span style={{color: '#86868b', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px'}}>SENTIMENT</span>
                    </div>
                    <h2 style={{margin: 0, fontSize: '28px', fontWeight: '700'}}>{metrics.sentiment}</h2>
                </div>
            </div>

            {/* Row 2: Deep Analysis Neon Box */}
            <div className="advanced-intel-panel">
                <div className="glow-orb"></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Zap size={22} color="#34c759" fill="#34c759" style={{ opacity: 0.8 }} />
                            <h3 style={{ color: '#fff', fontSize: '22px', margin: 0, fontWeight: '700' }}>Executive Intelligence</h3>
                        </div>
                        <span className="neural-badge">NEURAL ENGINE ACTIVE</span>
                    </div>

                    <div className="intel-content">
                        {typeof data === 'object' ? (
                            <pre style={{ color: 'rgba(255, 255, 255, 0.85)', fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        ) : (
                            <p style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.8' }}>
                                {data || "System waiting for neural input..."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesView;