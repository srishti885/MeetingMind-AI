import React, { useState } from 'react';
import { styles } from './Styles';
import { syncToCalendar } from './CalendarEngine';
import emailjs from '@emailjs/browser'; // Import EmailJS
import ModeSelector from './components/ModeSelector';
import SalesView from './features/sales/SalesView';
import MedicalView from './features/medical/MedicalView';
import { startNeuralMic, stopNeuralMic } from './mic/NeuralMic';
export const RenderAppContent = (props) => {
    const {
        currentView, isLoggedIn, authMode, setAuthMode, handleAuthAction,
        userName, userEmail, storage, setSummary, setCurrentView,
        downloadPDF, downloadPPT, file, handleFileChange, uploadAudio, loading,
        status, setStatus, sentiment, setSentiment, progress, summary, actionItems,
        tempFeedback, setTempFeedback, submitFeedback, feedbacks,
        isListening, setIsListening, setActionItems,
        selectedMode, setSelectedMode, salesInsights 
    } = props;

    const { 
        pagePadding, badgeStyle, mainTitleStyle, contentCard, 
        formGroup, inputStyle, uploadButtonStyle, heroButtonStyle,
        paragraph, labelStyle, smallActionBtn, pdfButtonStyle,
        pageTitle, tableHeadStyle, tableCellStyle, studioWrapperStyle,
        statusPanelStyle, resultSectionStyle, summaryContentStyle,
        heroButtonStyleSmall, calendarSyncCard, statsCard, taskItemStyle, taskBadge
    } = styles;

    const sendSummaryEmail = () => {
        if (!summary) return alert("Nothing to send!");

        const templateParams = {
            to_name: userName,
            to_email: userEmail,
            message: summary,
            action_items: actionItems?.map(i => `• ${i.task} (Owner: ${i.owner})`).join("\n") || "No specific tasks assigned.",
            sentiment: typeof sentiment === 'string' ? sentiment : sentiment?.label || "Neutral"
        };

        emailjs.send(
            'service_fdkpqev',
            'template_j6o09cf',
            templateParams, 
            'hy3ufQMPlcCHHoWS3'
        )
        .then(() => alert(`Intelligence Report sent to ${userEmail}!`))
        .catch((err) => {
            console.error("Email Error:", err);
            alert("Email failed. Please check your connection or EmailJS quota.");
        });
    };

    switch(currentView) {
      case 'home':
        return (
          <div style={pagePadding}>
            <section style={{textAlign: 'center', marginTop: '60px'}}>
              <div style={badgeStyle}>v2.0 Neural Engine</div>
              <h1 style={mainTitleStyle}>Meetings are messy. <br/> <span style={{ color: '#007aff' }}>Intelligence is clean.</span></h1>
              
              {!isLoggedIn ? (
                <div style={{...contentCard, maxWidth: '400px', margin: '40px auto'}}>
                  <h3 style={{marginBottom: '20px'}}>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h3>
                  
                  <div style={formGroup}><input type="email" id="emailInput" placeholder="Email" style={inputStyle} /></div>
                  <div style={formGroup}><input type="password" placeholder="Password" style={inputStyle} /></div>
                  
                  <button style={uploadButtonStyle} onClick={() => {
                      const email = document.getElementById('emailInput').value || 'user@test.com';
                      handleAuthAction('user', 'Srishti', email);
                    }}>
                    {authMode === 'login' ? 'Login' : 'Sign Up'}
                  </button>

                  <p style={{marginTop: '15px', fontSize: '14px', color: '#667c99'}}>
                    {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <span style={{color: '#007aff', cursor: 'pointer', fontWeight: '600'}} onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
                      {authMode === 'login' ? 'Sign Up' : 'Login'}
                    </span>
                  </p>

                  <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee', fontSize: '13px' }}>
                    <span style={{color: '#86868b'}}>Need help? </span>
                    <span style={{color: '#007aff', cursor: 'pointer', fontWeight: '600'}} onClick={() => setCurrentView('contact')}>Contact Support</span>
                  </div>

                  <div style={{marginTop: '10px', fontSize: '12px', color: '#007aff', cursor: 'pointer', textDecoration: 'underline'}} onClick={() => handleAuthAction('admin', 'Admin', 'admin@meetingmind.ai')}>Admin Demo Login</div>
                </div>
              ) : (
                <button style={heroButtonStyle} onClick={() => setCurrentView('workspace')}>Go to Studio</button>
              )}
            </section>
          </div>
        );

      
      case 'about':
        return (
          <div style={pagePadding}>
            {/* Header Section */}
            <div style={{textAlign: 'center', marginBottom: '80px', marginTop: '40px'}}>
                <div style={{...badgeStyle, background: 'linear-gradient(90deg, #007aff, #5856d6)', color: '#fff', border: 'none'}}>OUR VISION 2026</div>
                <h2 style={{fontSize: '56px', fontWeight: '900', color: '#1d1d1f', letterSpacing: '-2px', marginTop: '15px'}}>Bridging the <span style={{color: '#007aff'}}>Cognitive Gap.</span></h2>
                <p style={{color: '#86868b', fontSize: '20px', maxWidth: '850px', margin: '20px auto', lineHeight: '1.6'}}>
                  MeetingMind AI is not just a transcription tool; it is a **Neural Operating System** for enterprise collaboration, turning human conversation into actionable data.
                </p>
                {isLoggedIn && <button style={{...heroButtonStyleSmall, marginTop: '20px', borderRadius: '25px'}} onClick={() => setCurrentView('workspace')}>Back to Studio</button>}
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1100px', margin: '0 auto'}}>
                
                {/* Expanded Mission Content */}
                <div style={{...contentCard, border: 'none', background: '#f5f5f7', padding: '40px'}}>
                    <div style={{width: '50px', height: '50px', background: '#fff', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <h3 style={{color: '#1d1d1f', fontWeight: '800', fontSize: '26px', marginBottom: '20px'}}>The Mission</h3>
                    <p style={{...paragraph, fontSize: '16px', color: '#424245', lineHeight: '1.7'}}>
                      Founded by <strong>Srishti Goenka</strong>, our mission is to eliminate <strong>"Information Decay"</strong> in corporate environments. Statistics show that 70% of meeting insights are lost within 24 hours. 
                      <br/><br/>
                      We aim to democratize intelligence by providing every team member with a personalized AI analyst that captures nuances, tracks accountability, and ensures that the collective wisdom of a team is preserved in a structured, searchable vault.
                    </p>
                </div>

                {/* Expanded Technology Content */}
                <div style={{...contentCard, border: 'none', background: '#f5f5f7', padding: '40px'}}>
                    <div style={{width: '50px', height: '50px', background: '#fff', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    </div>
                    <h3 style={{color: '#1d1d1f', fontWeight: '800', fontSize: '26px', marginBottom: '20px'}}>The Technology Stack</h3>
                    <p style={{...paragraph, fontSize: '16px', color: '#424245', lineHeight: '1.7'}}>
                      Our core engine leverages the <strong>Llama 3.3 Large Language Model</strong>, fine-tuned on specialized meeting datasets for 99.2% summarization accuracy. 
                      <br/><br/>
                      <strong>Key Components:</strong>
                      <ul style={{marginTop: '10px', paddingLeft: '20px'}}>
                        <li><strong>Neural Audio Processing:</strong> Real-time noise cancellation and speaker diarization.</li>
                        <li><strong>Contextual Graphing:</strong> Mapping action items to specific owners automatically.</li>
                        <li><strong>Zero-Knowledge Privacy:</strong> End-to-end encryption ensuring your sensitive corporate data never trains public models.</li>
                      </ul>
                    </p>
                </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div style={pagePadding}>
            {/* Header */}
            <div style={{textAlign: 'center', marginBottom: '60px', marginTop: '40px'}}>
              <div style={{...badgeStyle, background: 'rgba(0, 122, 255, 0.1)', color: '#007aff'}}>24/7 GLOBAL SUPPORT</div>
              <h1 style={{fontSize: '52px', fontWeight: '900', color: '#1d1d1f', letterSpacing: '-1.5px', marginTop: '10px'}}>
                Connect with our <span style={{color: '#007aff'}}>Experts.</span>
              </h1>
              <p style={{color: '#86868b', fontSize: '18px'}}>Enterprise-grade support for world-class teams.</p>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', maxWidth: '1200px', margin: '0 auto'}}>
              
              {/* Left Column: Contact Details */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                
                {/* Office Card */}
                <div style={{...contentCard, padding: '30px', background: '#1d1d1f', color: '#fff', border: 'none'}}>
                  <h4 style={{color: '#007aff', marginBottom: '15px', fontSize: '14px', letterSpacing: '1px', fontWeight: 'bold'}}>HEADQUARTERS</h4>
                  <p style={{fontSize: '16px', color: '#d2d2d7', lineHeight: '1.6', margin: 0}}>
                    Neural Plaza, Sector 62<br/>
                    Intelligence Hub, Noida<br/>
                    UP 201301, India
                  </p>
                </div>

                {/* Direct Contact Card */}
                <div style={{...contentCard, padding: '30px', background: '#f5f5f7', border: 'none'}}>
                  <h4 style={{color: '#007aff', marginBottom: '15px', fontSize: '14px', letterSpacing: '1px', fontWeight: 'bold'}}>DIRECT LINES</h4>
                  
                  <div style={{marginBottom: '15px'}}>
                    <div style={{fontSize: '12px', color: '#86868b'}}>Enterprise Sales</div>
                    <div style={{fontSize: '16px', fontWeight: '600', color: '#1d1d1f'}}>+91 (120) 455-9000</div>
                  </div>

                  <div style={{marginBottom: '15px'}}>
                    <div style={{fontSize: '12px', color: '#86868b'}}>Technical Support</div>
                    <div style={{fontSize: '16px', fontWeight: '600', color: '#1d1d1f'}}>+91 98765 43210</div>
                  </div>

                  <div>
                    <div style={{fontSize: '12px', color: '#86868b'}}>General Inquiries</div>
                    <div style={{fontSize: '16px', fontWeight: '600', color: '#007aff'}}>hello@meetingmind.ai</div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div style={{padding: '10px 30px'}}>
                   <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#34c759'}}>
                      <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#34c759'}}></div>
                      System Status: All Nodes Operational
                   </div>
                </div>
              </div>

              {/* Right Column: Smart Form */}
              <div style={{...contentCard, padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', position: 'relative'}}>
                <h3 style={{marginBottom: '25px', fontWeight: '800', fontSize: '24px'}}>Priority Request</h3>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                  <div style={formGroup}>
                    <label style={labelStyle}>Full Name</label>
                    <input type="text" placeholder="Srishti Goenka" style={inputStyle} />
                  </div>
                  <div style={formGroup}>
                    <label style={labelStyle}>Company Email</label>
                    <input type="email" placeholder="name@company.com" style={inputStyle} />
                  </div>
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>Inquiry Type</label>
                  <select style={inputStyle}>
                    <option>Enterprise License Query</option>
                    <option>Technical API Support</option>
                    <option>Partnership Opportunity</option>
                    <option>Other</option>
                  </select>
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>Message</label>
                  <textarea rows="4" placeholder="How can our AI help your team?" style={{...inputStyle, resize: 'none'}}></textarea>
                </div>

                <button 
                  style={{...uploadButtonStyle, height: '55px', fontSize: '16px', marginTop: '10px', background: '#007aff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}} 
                  onClick={() => alert('Our team will contact you within 2 business hours.')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                  Send Priority Message
                </button>
                
                <p style={{textAlign: 'center', fontSize: '12px', color: '#86868b', marginTop: '20px'}}>
                  By submitting, you agree to our Neural Privacy Terms & SLA.
                </p>
              </div>

            </div>
          </div>
        );
      

            
      case 'storage':
        return (
          <div style={pagePadding}>
            {/* Header with Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
              <div>
                <div style={{...badgeStyle, background: 'rgba(52, 199, 89, 0.1)', color: '#34c759', border: 'none', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content'}}>
                   <div style={{width: '6px', height: '6px', borderRadius: '50%', background: '#34c759'}}></div>
                   END-TO-END ENCRYPTED
                </div>
                <h2 style={{ ...pageTitle, textAlign: 'left', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '32px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Intelligence Vault
                </h2>
                <p style={{ color: '#86868b', margin: 0 }}>Securely managing <b>{storage.filter(item => item.owner === userEmail).length}</b> neural records</p>
              </div>
              
              <div style={{display: 'flex', gap: '15px'}}>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: '11px', color: '#86868b', fontWeight: '700', letterSpacing: '0.5px'}}>STORAGE LOAD</div>
                  <div style={{fontSize: '18px', fontWeight: '800', color: '#1d1d1f'}}>1.2% <span style={{fontSize: '12px', color: '#86868b', fontWeight: '400'}}>/ 10GB</span></div>
                </div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div style={{display: 'flex', gap: '15px', marginBottom: '30px'}}>
              <div style={{flex: 1, position: 'relative'}}>
                <input type="text" placeholder="Search archive..." style={{...inputStyle, paddingLeft: '40px', height: '48px', borderRadius: '12px', border: '1px solid #e5e5e7'}} />
                <svg style={{position: 'absolute', left: '14px', top: '16px'}} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <button style={{...smallActionBtn, background: '#fff', border: '1px solid #e5e5e7', color: '#1d1d1f', display: 'flex', alignItems: 'center', gap: '8px', height: '48px', padding: '0 20px'}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="2" y1="14" x2="6" y2="14"/><line x1="10" y1="8" x2="14" y2="8"/><line x1="18" y1="16" x2="22" y2="16"/></svg>
                Sort
              </button>
            </div>

            {/* Vault Grid */}
            <div style={{ display: 'grid', gap: '15px' }}>
              {storage.filter(item => item.owner === userEmail).length > 0 ? storage.filter(item => item.owner === userEmail).map(item => (
                <div key={item.id} style={{...contentCard, padding: '20px 25px', border: '1px solid #f2f2f7', transition: 'all 0.3s ease'}}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', background: '#f5f5f7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.type === 'video' ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5856d6" strokeWidth="2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                        ) : (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2"><path d="M12 2v10"/><path d="M18.4 4.6a9 9 0 1 1-12.8 0"/></svg>
                        )}
                      </div>
                      
                      <div>
                        <h4 style={{ color: '#1d1d1f', margin: '0 0 4px 0', fontSize: '17px', fontWeight: '700' }}>{item.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#86868b' }}>
                          <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            {item.date}
                          </span>
                          <span style={{fontWeight: '700', color: '#e5e5e7'}}>·</span>
                          <span style={{ fontWeight: '600', color: '#1d1d1f' }}>{item.type?.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                       <button 
                        style={{...smallActionBtn, background: '#007aff', color: '#fff', border: 'none', padding: '0 18px', fontWeight: '600'}} 
                        onClick={() => { setSummary(item.summary); setCurrentView('workspace'); }}
                       >
                         Review Analysis
                       </button>
                       <button style={{...pdfButtonStyle, background: '#f5f5f7', color: '#1d1d1f', border: 'none'}} onClick={() => downloadPDF(item.summary)}>
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                       </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '80px 0', background: '#fbfbfd', borderRadius: '24px', border: '1px dashed #d2d2d7' }}>
                  <div style={{width: '64px', height: '64px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d2d2d7" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                  </div>
                  <h3 style={{color: '#1d1d1f', fontWeight: '700', marginBottom: '8px'}}>No Records Found</h3>
                  <p style={{color: '#86868b', fontSize: '14px', maxWidth: '300px', margin: '0 auto'}}>Upload a meeting file in the Studio to begin your neural archive.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'feedback':
        return (
          <div style={pagePadding}>
            <div style={contentCard}>
              <h2 style={{...pageTitle, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-13.6c.9 0 1.8.2 2.6.5"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Platform Feedback
              </h2>
              <div style={{...formGroup, marginTop: '20px'}}>
                <label style={labelStyle}>Rating</label>
                <select style={inputStyle} value={tempFeedback.rating} onChange={(e) => setTempFeedback({...tempFeedback, rating: e.target.value})}>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="1">1 - Needs Work</option>
                </select>
              </div>
              <div style={formGroup}>
                <label style={labelStyle}>Comment</label>
                <textarea style={{...inputStyle, height: '100px'}} value={tempFeedback.comment} onChange={(e) => setTempFeedback({...tempFeedback, comment: e.target.value})} />
              </div>
              <button style={uploadButtonStyle} onClick={submitFeedback}>Submit Review</button>
            </div>
          </div>
        );
        case 'workspace':
        const summaryData = {
            general: "Neural Studio is ready. No intelligence report generated yet.",
            sales: "Sales Pipeline PRO is active. Waiting for lead analysis...",
            medical: "Medical Intelligence Engine standby. Ready for clinical analysis..."
        };
        const actionItemsData = {
            general: [],
            sales: [],
            medical: []
        };   
        
        const currentSummary = summaryData[selectedMode] || "No data available"; 
        const currentActions = actionItemsData[selectedMode] || [];

        return (
            <div style={pagePadding}>
                <div style={studioWrapperStyle}>
                    
                    {/* --- SECTION 1: HEADER --- */}
                    <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                        <div style={{ ...badgeStyle, background: 'rgba(0, 122, 255, 0.08)', color: '#007aff', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            {selectedMode.toUpperCase()} INTELLIGENCE ACTIVE
                        </div>
                        <h2 style={{ fontSize: '38px', fontWeight: '900', color: '#1d1d1f', marginTop: '15px' }}>
                            {selectedMode === 'sales' ? 'Sales Pipeline PRO' : selectedMode === 'medical' ? 'Med-Neural Assistant' : 'Neural Studio PRO'}
                        </h2>
                        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center' }}>
                            <ModeSelector selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
                        </div>
                    </div>

                    {/* --- SECTION 2: SMART UPLOAD ZONE --- */}
                    {!loading && (
                        <div style={{ width: '100%', maxWidth: '850px', margin: '0 auto' }}>
                            <div style={{ background: '#ffffff', padding: '40px', borderRadius: '32px', border: '1px solid #e5e5e5', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
                                <h4 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '14px', fontWeight: '700', color: '#86868b', letterSpacing: '1px' }}>SELECT SOURCE FOR ANALYSIS</h4>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                    
                                    {/* Audio Upload Card */}
                                    <label htmlFor="audioIn" style={{ 
                                        cursor: 'pointer', padding: '30px', borderRadius: '20px', border: file?.type?.includes('audio') ? '2px solid #007aff' : '1.5px dashed #d2d2d7',
                                        background: file?.type?.includes('audio') ? '#f5faff' : '#fcfcfc', textAlign: 'center', transition: 'all 0.2s'
                                    }}>
                                        <input type="file" accept="audio/*" onChange={handleFileChange} id="audioIn" style={{ display: 'none' }} />
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={file?.type?.includes('audio') ? "#007aff" : "#86868b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                                        <div style={{ fontWeight: '700', fontSize: '15px', color: '#1d1d1f' }}>Audio Record</div>
                                    </label>

                                    {/* Video Feed Card */}
                                    <label htmlFor="videoIn" style={{ 
                                        cursor: 'pointer', padding: '30px', borderRadius: '20px', border: file?.type?.includes('video') ? '2px solid #007aff' : '1.5px dashed #d2d2d7',
                                        background: file?.type?.includes('video') ? '#f5faff' : '#fcfcfc', textAlign: 'center', transition: 'all 0.2s'
                                    }}>
                                        <input type="file" accept="video/*" onChange={handleFileChange} id="videoIn" style={{ display: 'none' }} />
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={file?.type?.includes('video') ? "#007aff" : "#86868b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                                        <div style={{ fontWeight: '700', fontSize: '15px', color: '#1d1d1f' }}>Video Feed</div>
                                    </label>
                                </div>

                                <button onClick={uploadAudio} disabled={!file} style={{ 
                                    width: '100%', height: '60px', background: file ? '#1d1d1f' : '#e5e5e5', color: 'white', 
                                    borderRadius: '16px', fontWeight: '700', fontSize: '16px', cursor: file ? 'pointer' : 'not-allowed',
                                    border: 'none', transition: 'all 0.3s'
                                }}>
                                    Analyze {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)} File
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- SECTION 3: RESULTS & LOADING --- */}
                    {(loading || (currentSummary && !loading)) && (
                        <div style={{ width: '100%', maxWidth: '1100px', margin: '40px auto 0' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: (!loading && selectedMode === 'general') ? '1fr 350px' : '1fr', gap: '30px' }}>
                                
                                <div style={summaryContentStyle}>
                                    <h3 style={{ color: '#007aff', fontWeight: '800', marginBottom: '20px' }}>AI Insight Report</h3>

                                    {loading ? (
                                        <div style={{ padding: '40px 0', textAlign: 'center' }}>
                                            <p style={{ color: '#86868b', fontWeight: '600' }}>Neural Engine is processing...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ whiteSpace: 'pre-wrap', color: '#1d1d1f', lineHeight: '1.7' }}>{currentSummary}</div>
                                            
                                            {/* Action Buttons with Email included */}
                                            <div style={{ display: 'flex', gap: '12px', marginTop: '30px', borderTop: '1px solid #f2f2f2', paddingTop: '25px' }}>
                                                <button style={pdfButtonStyle} onClick={() => downloadPDF(currentSummary)}>PDF</button>
                                                <button style={heroButtonStyleSmall} onClick={() => downloadPPT(currentSummary)}>Slides</button>
                                                <button 
                                                    style={{ ...heroButtonStyleSmall, background: '#5856d6', display: 'flex', alignItems: 'center', gap: '8px' }} 
                                                    onClick={() => {
                                                        const email = prompt("Recipient email:");
                                                        if(email) sendSummaryEmail(email, currentSummary);
                                                    }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                                    Email
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {selectedMode === 'general' && !loading && (
                                    <div style={calendarSyncCard}>
                                        <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '20px' }}>Tasks Detected</h4>
                                        {currentActions?.map((item, i) => (
                                            <div key={i} style={taskItemStyle}><p style={{ margin: 0 }}>{item.task}</p></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );

        
        
        default:
            return null;
      }
    };
        