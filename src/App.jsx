import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { generateReviews } from './lib/ai';
import { supabase } from './lib/supabase';

// Components
const Navbar = () => (
  <nav className="navbar">
    <Link to="/" style={{ textDecoration: 'none' }}>
      <h1 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>ReviewBooster AI</h1>
    </Link>
    <Link to="/login" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Login</Link>
  </nav>
);

const Dashboard = () => {
  const [businessName, setBusinessName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [googleLink, setGoogleLink] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');

  const generateQR = () => {
    if (!businessName) return;
    // Build query params including keywords
    const url = new URL(`${window.location.origin}/review/${encodeURIComponent(businessName)}`);
    if (keywords) {
      url.searchParams.set('keywords', keywords);
    }
    if (googleLink) {
      url.searchParams.set('googleLink', googleLink);
    }
    setQrCodeData(url.toString());
  };

  return (
    <div className="dashboard-container">
      <div className="glass-panel">
        <h2 style={{ marginBottom: '32px', color: 'var(--text-color)', fontSize: '2rem' }}>Business Setup</h2>
        
        <label className="label">Business Name</label>
        <input 
          className="input-field" 
          placeholder="e.g. Joe's Cafe" 
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />

        <label className="label">Keywords (Comma separated)</label>
        <input 
          className="input-field" 
          placeholder="e.g. fast service, affordable, clean" 
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />

        <label className="label">Google Review Link</label>
        <input 
          className="input-field" 
          placeholder="https://g.page/r/..." 
          value={googleLink}
          onChange={(e) => setGoogleLink(e.target.value)}
        />

        <button className="btn-primary" onClick={generateQR} style={{ width: '100%', marginTop: '16px' }}>
          Generate Magic QR Code
        </button>

        {qrCodeData && (
          <div style={{ marginTop: '40px', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <h3 style={{ marginBottom: '20px' }}>Your Unique Review QR</h3>
            <div style={{ display: 'inline-block', padding: '20px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <QRCodeSVG value={qrCodeData} size={250} fgColor="var(--primary-color)" />
            </div>
            <p style={{ color: '#666', marginTop: '15px' }}>Scan to test customer flow</p>
            <a href={qrCodeData} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', marginTop: '10px', display: 'inline-block', fontWeight: 'bold', textDecoration: 'none' }}>
              Preview Customer Page &rarr;
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomerReviewPage = () => {
  const { businessName } = useParams();
  const [searchParams] = useSearchParams();
  const keywords = searchParams.get('keywords');
  const googleLink = searchParams.get('googleLink');
  
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [step, setStep] = useState('rating'); // rating, feedback, ai-suggestions
  const [selectedReview, setSelectedReview] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleRating = async (stars) => {
    setRating(stars);
    if (stars <= 3) {
      setStep('feedback');
    } else {
      setStep('ai-suggestions');
      setIsGenerating(true);
      const generated = await generateReviews(businessName, keywords, stars, 'friendly');
      setSuggestions(generated);
      setIsGenerating(false);
    }
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) return;
    
    setIsSubmitting(true);
    
    // Send to Supabase
    const { error } = await supabase
      .from('feedback')
      .insert([
        { 
          business_name: businessName, 
          rating: rating, 
          feedback: feedbackText 
        }
      ]);
      
    setIsSubmitting(false);
    
    if (error) {
      console.error("Error saving feedback:", error);
      alert("Failed to send feedback. Please check your database connection or RLS policies.");
    } else {
      setFeedbackSuccess(true);
    }
  };

  return (
    <div className="customer-page">
      <div className="glass-panel customer-panel">
        
        {step === 'rating' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '15px', color: 'var(--text-color)' }}>Rate your experience</h2>
            <p style={{ color: '#666', marginBottom: '40px', fontSize: '1.1rem' }}>How was your visit to <strong>{businessName}</strong>?</p>
            
            <div className="star-rating">
              {[1,2,3,4,5].map(star => {
                const isFilled = (hover || rating || 5) >= star;
                return (
                  <span 
                    key={star} 
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    style={{ 
                      color: isFilled ? '#FBBC04' : '#e0e0e0', // Official Google Yellow
                      transition: 'all 0.2s ease', 
                      transform: isFilled ? 'scale(1.1)' : 'scale(1)',
                      textShadow: isFilled ? '0 0 15px rgba(251, 188, 4, 0.4)' : 'none',
                      display: 'inline-block'
                    }}
                  >
                    ★
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {step === 'feedback' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            {feedbackSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✅</div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Thank you!</h2>
                <p style={{ color: '#666' }}>Your private feedback has been securely sent to the management team. We will use this to improve our service.</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>How can we improve?</h2>
                <p style={{ color: '#666', marginBottom: '25px' }}>We're sorry your experience wasn't 5-stars. Please let us know what went wrong so we can fix it.</p>
                <textarea 
                  className="input-field" 
                  rows="5" 
                  placeholder="Your private feedback..." 
                  style={{ resize: 'vertical' }}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  disabled={isSubmitting}
                ></textarea>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%' }} 
                  onClick={submitFeedback}
                  disabled={isSubmitting || !feedbackText.trim()}
                >
                  {isSubmitting ? 'Sending...' : 'Send Private Feedback'}
                </button>
              </>
            )}
          </div>
        )}

        {step === 'ai-suggestions' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'var(--primary-color)' }}>Thank you for {rating} stars!</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>Select an AI-generated review to edit or post on Google.</p>
            
            {isGenerating ? (
              <div style={{ padding: '40px 0', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                <p>✨ AI is crafting perfect reviews...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', textAlign: 'left' }}>
                {suggestions.map((suggestion, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setSelectedReview(suggestion);
                      setReviewText(suggestion);
                    }}
                    style={{
                      padding: '20px', 
                      border: selectedReview === suggestion ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      backgroundColor: selectedReview === suggestion ? 'rgba(103, 61, 230, 0.05)' : '#ffffff',
                      transition: 'all 0.2s',
                      boxShadow: selectedReview === suggestion ? '0 4px 12px rgba(103, 61, 230, 0.1)' : 'none'
                    }}
                  >
                    <p style={{ margin: 0, color: 'var(--text-color)', lineHeight: 1.6 }}>"{suggestion}"</p>
                  </div>
                ))}
              </div>
            )}

            {selectedReview && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left', marginBottom: '20px' }}>
                <label className="label" style={{ fontSize: '0.95rem' }}>Edit your review (optional):</label>
                <textarea 
                  className="input-field" 
                  rows="4" 
                  value={reviewText} 
                  onChange={(e) => setReviewText(e.target.value)}
                  style={{ resize: 'vertical', marginTop: '5px' }}
                />
              </div>
            )}

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
              disabled={!reviewText || isGenerating}
              onClick={() => {
                navigator.clipboard.writeText(reviewText);
                if (googleLink) {
                  window.location.href = googleLink;
                } else {
                  alert('Review copied! (No Google Link was provided during setup to redirect to)');
                }
              }}
            >
              Copy & Leave Review
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('signup'); // 'signup' | 'signin'
  
  return (
    <div className="login-container">
      {/* Left Side */}
      <div className="login-left">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>✨</span> ReviewBooster AI
          </h2>
        </div>
        
        <div className="login-left-content">
          {/* We use a fallback if the generated image isn't placed in the public folder yet */}
          <img 
            src="/login_illustration.png" 
            alt="AI Review Illustration" 
            className="login-illustration"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'; }}
          />
        </div>
        
        <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
          Copyright © 2026, ReviewBooster AI. All rights reserved.
        </div>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-tabs">
            <div 
              className={`login-tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </div>
            <div 
              className={`login-tab ${activeTab === 'signin' ? 'active' : ''}`}
              onClick={() => setActiveTab('signin')}
            >
              Sign In
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {activeTab === 'signup' && (
              <div className="login-form-group">
                <label>Full Name</label>
                <input type="text" className="login-input" placeholder="John Doe" />
              </div>
            )}
            
            <div className="login-form-group">
              <label>Email</label>
              <input type="email" className="login-input" placeholder="john@example.com" />
            </div>
            
            <div className="login-form-group">
              <label>Password</label>
              <input type="password" className="login-input" placeholder="••••••••" />
            </div>

            <button type="submit" className="login-btn">
              {activeTab === 'signup' ? 'Sign Up' : 'Sign In'}
            </button>
            
            <div className="login-divider">OR</div>

            <button type="button" className="google-btn">
              <svg className="google-icon" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            
            <a className="login-footer-link" onClick={() => setActiveTab(activeTab === 'signup' ? 'signin' : 'signup')}>
              {activeTab === 'signup' ? 'I have an Account ?' : 'Need an Account ?'}
            </a>
          </form>
        </div>

        <div className="login-bottom-info">
          <div className="login-socials">
            <span>in</span> <span>◎</span> <span>f</span> <span>🐦</span>
          </div>
          <div className="login-contact">
            <span>📞 800-123-4567</span>
            <span style={{ marginLeft: '15px' }}>✉️ info@reviewbooster.ai</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<><Navbar /><Dashboard /></>} />
          <Route path="/review/:businessName" element={<CustomerReviewPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
