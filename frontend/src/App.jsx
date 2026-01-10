import React, { useState, useEffect } from 'react'; // useEffect optimized
import axios from 'axios';
import { jsPDF } from "jspdf";
import pptxgen from "pptxgenjs";
import emailjs from '@emailjs/browser'; 

// Humari files ka import
import { styles } from './Styles';
import { RenderAppContent } from './ViewManager';
import { startNeuralMic } from './NeuralMic';
import { syncToCalendar } from './CalendarEngine';

function App() {
  // --- EMAIL INITIALIZATION ---
  useEffect(() => {
    emailjs.init("hy3ufQMPlcCHHoWS3"); 
  }, []);

  // --- 1. STATES ---
  const [currentView, setCurrentView] = useState('home');
  const [activeRoleMode, setActiveRoleMode] = useState('user');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState('');
  const [transcription, setTranscription] = useState('');
  const [actionItems, setActionItems] = useState([]);
  const [sentiment, setSentiment] = useState({ score: 0, label: 'Neutral', color: '#667c99' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState(''); 
  const [authMode, setAuthMode] = useState('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const [storage, setStorage] = useState([
    { id: 1, owner: 'admin@meetingmind.ai', name: 'Strategic Planning.mp3', date: '2026-01-05', summary: 'Discussion on Q1 goals and expansion into neural markets.', type: 'audio' },
    { id: 2, owner: 'srishti@test.com', name: 'UI Design Sync.wav', date: '2026-01-08', summary: 'Frontend architecture review regarding Llama 3.3 integration.', type: 'audio' }
  ]);

  const [feedbacks, setFeedbacks] = useState([
    { id: 1, user: 'srishti@test.com', rating: 5, comment: 'Great accuracy!', date: '2026-01-08' }
  ]);
  const [tempFeedback, setTempFeedback] = useState({ rating: 5, comment: '' });

  // --- EMAIL SENDER LOGIC ---
  const sendEmail = (customSummary = summary) => {
    if (!customSummary) return alert("No summary to email!");
    
    const templateParams = {
        to_name: userName,
        to_email: userEmail,
        message: customSummary,
        action_items: actionItems.length > 0 
            ? actionItems.map(i => `${i.task} (Owner: ${i.owner})`).join("\n") 
            : "No specific tasks detected.",
        sentiment: sentiment.label || "Analyzed"
    };

    emailjs.send('service_fdkpqev', 'template_j6o09cf', templateParams)
        .then(() => alert(`🚀 Success! Intelligence Report sent to ${userEmail}`))
        .catch((err) => {
            console.error("Email Error:", err);
            alert("Email failed. Check console.");
        });
  };

  // --- PPT EXPORT LOGIC ---
  const downloadPPT = (content = summary) => {
    if (!content) return alert("No summary to export!");
    const pptx = new pptxgen();
    
    const slide1 = pptx.addSlide();
    slide1.addText("Meeting Intelligence Report", { x: 1, y: 1, fontSize: 32, bold: true, color: '007AFF' });
    slide1.addText(`Prepared for: ${userName}\nDate: ${new Date().toLocaleDateString()}`, { x: 1, y: 2, fontSize: 18 });

    const slide2 = pptx.addSlide();
    slide2.addText("Executive Summary", { x: 0.5, y: 0.5, fontSize: 24, bold: true, color: '007AFF' });
    slide2.addText(content, { x: 0.5, y: 1.2, w: 9, h: 4, fontSize: 14, valign: 'top' });

    if (actionItems.length > 0) {
      const slide3 = pptx.addSlide();
      slide3.addText("Neural Action Items", { x: 0.5, y: 0.5, fontSize: 24, bold: true, color: '007AFF' });
      const list = actionItems.map(item => `• ${item.task} (${item.owner})`);
      slide3.addText(list.join('\n\n'), { x: 0.5, y: 1.2, fontSize: 16 });
    }

    pptx.writeFile({ fileName: `MeetingMind_Analysis_${Date.now()}.pptx` });
  };

  // --- AUTH & NAVIGATION LOGIC ---
  const handleAuthAction = (role, name, email) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(name);
    setUserEmail(email);
    setActiveRoleMode(role === 'admin' ? 'admin' : 'user');
    setCurrentView(role === 'admin' ? 'admin' : 'workspace');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserEmail('');
    setCurrentView('home');
  };

  // --- FILE & AI PROCESSING ---
  const handleFileChange = (e) => { setFile(e.target.files[0]); };

  const uploadAudio = async () => {
    if (!file) return alert("Please select a file first!");
    setLoading(true);
    setProgress(10);
    const isVideo = file.type.includes('video');
    setStatus(isVideo ? 'Neural Video Decoder Starting...' : 'Initializing Neural Engine...');
    
    try {
      const formData = new FormData();
      formData.append('audio', file);
      
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        onUploadProgress: (p) => {
          const baseProgress = Math.round((p.loaded * 100) / p.total);
          setProgress(baseProgress * 0.5);
        }
      });

      setSummary(res.data.summary);
      setTranscription(res.data.transcription);
      setActionItems([
        { id: 1, task: "Finalize UI Prototype", owner: "Product Team", status: "High Priority" },
        { id: 2, task: "Client Presentation Review", owner: userName, status: "Pending" }
      ]);
      setSentiment({ score: 85, label: 'Highly Positive', color: '#2ecc71' });
      setProgress(100);
      
      const newEntry = {
        id: Date.now(),
        owner: userEmail || 'Guest',
        name: file.name,
        type: isVideo ? 'video' : 'audio',
        date: new Date().toLocaleDateString(),
        summary: res.data.summary
      };
      setStorage([newEntry, ...storage]);
      setStatus('AI Analysis Complete');
    } catch (err) { 
      setStatus('Interrupted: Connection Error');
      setProgress(0);
      alert("Error: " + (err.response?.data?.message || "Server Timeout."));
    } finally { 
      setTimeout(() => setLoading(false), 800); 
    }
  };

  const submitFeedback = () => {
    const newFB = {
      id: Date.now(),
      user: userEmail,
      rating: tempFeedback.rating,
      comment: tempFeedback.comment,
      date: new Date().toLocaleDateString()
    };
    setFeedbacks([newFB, ...feedbacks]);
    alert("Feedback Submitted!");
    setTempFeedback({ rating: 5, comment: '' });
  };

  const downloadPDF = (content = summary) => {
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(content, 180);
    doc.setFontSize(20);
    doc.text("MeetingMind AI Intelligence Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated for: ${userName}`, 20, 30);
    doc.text(`Sentiment: ${sentiment.label}`, 20, 40);
    doc.text(splitText, 20, 50);
    doc.save("MeetingMind_Executive_Report.pdf");
  };

  // --- NAVBAR COMPONENT ---
  const Navbar = () => (
    <nav style={styles.navStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', cursor: 'pointer' }} onClick={() => setCurrentView('home')}>
        <div style={styles.largeLogoIconStyle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><circle cx="12" cy="12" r="3" fill="white"></circle></svg>
        </div>
        <div style={{ fontWeight: '900', fontSize: '24px', color: '#1d1d1f', letterSpacing: '-0.8px' }}>
          MeetingMind <span style={{color: '#007aff'}}>AI</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <span style={{...styles.navLinkStyle, color: currentView === 'home' ? '#007aff' : '#86868b'}} onClick={() => setCurrentView('home')}>Home</span>
          <span style={{...styles.navLinkStyle, color: currentView === 'about' ? '#007aff' : '#86868b'}} onClick={() => setCurrentView('about')}>About</span>
          
          {isLoggedIn && (
            <>
              <span style={{...styles.navLinkStyle, color: currentView === 'workspace' ? '#007aff' : '#86868b'}} onClick={() => setCurrentView('workspace')}>Studio</span>
              <span style={{...styles.navLinkStyle, color: currentView === 'storage' ? '#007aff' : '#86868b'}} onClick={() => setCurrentView('storage')}>Vault</span>
              <span style={{...styles.navLinkStyle, color: currentView === 'contact' ? '#007aff' : '#86868b'}} onClick={() => setCurrentView('contact')}>Support</span>
            </>
          )}

          {isLoggedIn ? (
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '10px'}}>
              <div style={{textAlign: 'right'}}>
                <div style={{fontSize: '13px', fontWeight: '700', color: '#1d1d1f'}}>{userName}</div>
                <div style={{fontSize: '10px', color: '#007aff', fontWeight: 'bold'}}>{userRole?.toUpperCase()}</div>
              </div>
              <div 
                style={{
                  width: '38px', height: '38px', borderRadius: '50%', background: '#f5f5f7', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', 
                  fontWeight: 'bold', color: '#007aff', border: '1px solid #d2d2d7', cursor: 'pointer'
                }}
                onClick={handleLogout}
              >
                {userName.substring(0,1).toUpperCase()}
              </div>
            </div>
          ) : (
            <button style={{...styles.smallActionBtn, background: '#007aff', color: '#fff', borderRadius: '20px', padding: '8px 20px'}} onClick={() => setCurrentView('home')}>Get Started</button>
          )}
      </div>
    </nav>
  );

  // --- MAIN RENDER ---
  return (
    <div style={{...styles.appContainerStyle, background: '#ffffff'}}>
      {loading && <div style={{...styles.progressBarStyle, width: `${progress}%`, height: '3px', position: 'fixed', top: 0, zIndex: 9999}} />}
      <Navbar />
      
      <main style={{...styles.mainContentStyle, minHeight: '80vh'}}>
        <RenderAppContent 
          {...{ 
            currentView, isLoggedIn, authMode, setAuthMode, handleAuthAction,
            userName, userEmail, storage, setSummary, setCurrentView,
            downloadPDF, downloadPPT, sendEmail, file, handleFileChange, uploadAudio, loading,
            status, sentiment, progress, summary, actionItems,
            tempFeedback, setTempFeedback, submitFeedback, feedbacks,
            searchQuery, setSearchQuery, isListening, setIsListening,
            setActionItems 
          }} 
        />
      </main>

      <footer style={{...styles.footerStyle, padding: '40px 20px', borderTop: '1px solid #f2f2f7', marginTop: '60px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{fontWeight: '900', fontSize: '20px'}}>MeetingMind <span style={{color: '#007aff'}}>AI</span></div>
            <div style={{ color: '#86868b', fontSize: '14px' }}>© 2026 Intelligence Systems. Designed for Excellence.</div>
        </div>
      </footer>
    </div>
  );
}

export default App;