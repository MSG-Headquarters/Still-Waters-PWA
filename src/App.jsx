import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

// ============================================
// CONFIGURATION
// ============================================
const API_BASE = 'https://stillwaters.umbrassi.com/api';

// ============================================
// AUTH CONTEXT
// ============================================
const AuthContext = createContext(null);

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sw_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || data);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Auth error:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('sw_token', data.token);
      setToken(data.token);
      return { success: true };
    }
    return { success: false, error: data.message || 'Login failed' };
  };

  const signup = async (email, password, displayName) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('sw_token', data.token);
      setToken(data.token);
      return { success: true };
    }
    return { success: false, error: data.message || 'Signup failed' };
  };

  const logout = () => {
    localStorage.removeItem('sw_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// API HOOKS
// ============================================
const useApi = () => {
  const { token } = useAuth();
  
  const request = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    };
    
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Request failed');
      return data;
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  };

  return { request };
};

// ============================================
// ICONS (SVG Components)
// ============================================
const Icons = {
  Home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  ),
  Chat: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Book: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Heart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22,2 15,22 11,13 2,9"/>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12,19 5,12 12,5"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16,17 21,12 16,7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,6 5,6 21,6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Restore: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  ),
  Archive: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21,8 21,21 3,21 3,8"/>
      <rect x="1" y="3" width="22" height="5"/>
      <line x1="10" y1="12" x2="14" y2="12"/>
    </svg>
  ),
  Cross: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22"/>
      <line x1="6" y1="6" x2="18" y2="6"/>
    </svg>
  )
};

// ============================================
// BRANDED LOADING SCREEN
// ============================================
const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-screen">
      <div className="loading-backdrop">
        <img 
          src="/still-waters-bg.png" 
          alt="" 
          className="loading-backdrop-image"
        />
        <div className="loading-backdrop-overlay"/>
      </div>
      <div className="loading-content">
        <h1 className="loading-logo">
          <span className="logo-still">Still</span>
          <span className="logo-waters">Waters</span>
        </h1>
        <div className="loading-spinner-container">
          <div className="loading-spinner"/>
        </div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

// ============================================
// SPLASH SCREEN WITH AUTO-MORPH TO LOGIN
// ============================================
const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('splash');
  const [wordsVisible, setWordsVisible] = useState([]);
  
  const titleWords = ['Still', 'Waters'];
  const taglineWords = ['Your', 'AI', 'Faith', 'Companion'];

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      let wordIndex = 0;
      const allWords = [...titleWords, ...taglineWords];
      
      const wordInterval = setInterval(() => {
        if (wordIndex < allWords.length) {
          setWordsVisible(prev => [...prev, wordIndex]);
          wordIndex++;
        } else {
          clearInterval(wordInterval);
          setTimeout(() => {
            setPhase('morphing');
            setTimeout(() => {
              setPhase('complete');
              onComplete?.();
            }, 800);
          }, 1000);
        }
      }, 300);
      
      return () => clearInterval(wordInterval);
    }, 1500);

    return () => clearTimeout(splashTimer);
  }, []);

  const handleTap = () => {
    if (phase === 'splash') {
      setWordsVisible([0, 1, 2, 3, 4, 5]);
      setPhase('morphing');
      setTimeout(() => {
        setPhase('complete');
        onComplete?.();
      }, 600);
    }
  };

  return (
    <div className={`splash-screen ${phase}`} onClick={handleTap}>
      <div className="splash-image-container">
        <img src="/still-waters-bg.png" alt="Still Waters" className="splash-image"/>
        <div className="splash-overlay"/>
      </div>
      <div className="splash-content">
        <h1 className="splash-title">
          <span className={`splash-word still ${wordsVisible.includes(0) ? 'visible' : ''}`}>Still</span>
          <span className={`splash-word waters ${wordsVisible.includes(1) ? 'visible' : ''}`}>Waters</span>
        </h1>
        <p className="splash-tagline">
          {taglineWords.map((word, i) => (
            <span key={i} className={`splash-tagline-word ${wordsVisible.includes(i + 2) ? 'visible' : ''}`}>
              {word}{' '}
            </span>
          ))}
        </p>
        {phase === 'splash' && <p className="splash-hint">Tap to continue</p>}
      </div>
    </div>
  );
};

// ============================================
// AUTH SCREEN
// ============================================
const AuthScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = mode === 'login' 
        ? await login(email, password)
        : await signup(email, password, displayName);
      
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="auth-screen entered">
      <div className="auth-backdrop">
        <img src="/still-waters-bg.png" alt="" className="auth-backdrop-image"/>
        <div className="auth-backdrop-overlay"/>
      </div>
      
      <div className="auth-container fade-in-up">
        <div className="auth-logo">
          <h1 className="logo-text">
            <span className="logo-still">Still</span>
            <span className="logo-waters">Waters</span>
          </h1>
          <p className="logo-tagline">Your AI Faith Companion</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label>DISPLAY NAME</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should we call you?"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <div className="button-spinner"/> : (mode === 'login' ? 'Enter' : 'Begin Journey')}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' ? (
            <p>New to Still Waters? <button onClick={() => setMode('signup')}>Create Account</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setMode('login')}>Sign In</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// HOME SCREEN
// ============================================
const HomeScreen = ({ onNavigate, devotional, devotionalLoading }) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="home-screen">
      <div className="home-header">
        <div className="greeting">
          <h1>{getGreeting()}, {user?.display_name || user?.displayName || 'Friend'}</h1>
          <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="home-content">
        <section className="devotional-card" onClick={() => onNavigate('devotional')}>
          <div className="card-glow"/>
          <div className="card-header">
            <span className="card-icon"><Icons.Sun/></span>
            <span className="card-label">Today's Devotional</span>
          </div>
          {devotionalLoading ? (
            <div className="card-loading"><div className="small-spinner"/></div>
          ) : devotional ? (
            <>
              <h2 className="devotional-title">{devotional.title}</h2>
              <p className="devotional-scripture">{devotional.scripture_reference}</p>
              <p className="devotional-preview">{devotional.reflection?.substring(0, 100)}...</p>
            </>
          ) : (
            <p className="devotional-preview">Unable to load today's devotional</p>
          )}
          <span className="card-action">Read more →</span>
        </section>

        <section className="quick-actions">
          <h3>Begin</h3>
          <div className="action-grid">
            <button className="action-button primary" onClick={() => onNavigate('chat', { newChat: true })}>
              <span className="action-icon"><Icons.Chat/></span>
              <span className="action-text">
                <strong>Start Conversation</strong>
                <small>Talk with your faith companion</small>
              </span>
            </button>
            
            <button className="action-button" onClick={() => onNavigate('scriptures')}>
              <span className="action-icon"><Icons.Book/></span>
              <span className="action-text">
                <strong>Scripture Search</strong>
                <small>Find verses by topic</small>
              </span>
            </button>

            <button className="action-button" onClick={() => onNavigate('prayers')}>
              <span className="action-icon"><Icons.Heart/></span>
              <span className="action-text">
                <strong>Prayer Wall</strong>
                <small>Share & support prayers</small>
              </span>
            </button>
          </div>
        </section>

        <section className="scripture-card">
          <blockquote>"He leads me beside still waters. He restores my soul."</blockquote>
          <cite>— Psalm 23:2-3 ESV</cite>
        </section>
      </div>
    </div>
  );
};

// ============================================
// HELPERS
// ============================================
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
};

const generateTitle = (content) => {
  if (!content) return 'New Conversation';
  const maxLen = 40;
  if (content.length <= maxLen) return content;
  const truncated = content.substring(0, maxLen);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 20 ? truncated.substring(0, lastSpace) : truncated) + '...';
};

// ============================================
// CHAT SCREEN
// ============================================
const ChatScreen = ({ onNavigate, params }) => {
  const { request } = useApi();
  const [conversations, setConversations] = useState([]);
  const [deletedConversations, setDeletedConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const messagesEndRef = useRef(null);
  const hasStartedNewChat = useRef(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (params?.newChat && !hasStartedNewChat.current) {
      hasStartedNewChat.current = true;
      startNewConversation();
    }
  }, [params?.newChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      // Get active conversations
      const activeData = await request('/conversations');
      const activeConvos = activeData?.conversations || (Array.isArray(activeData) ? activeData : []);
      setConversations(activeConvos.filter(c => !c.deleted_at));
      
      // Get deleted conversations separately
      const deletedData = await request('/conversations?includeDeleted=true');
      const allConvos = deletedData?.conversations || (Array.isArray(deletedData) ? deletedData : []);
      setDeletedConversations(allConvos.filter(c => c.deleted_at));
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setConversations([]);
      setDeletedConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (id) => {
    setLoading(true);
    try {
      const data = await request(`/conversations/${id}`);
      const convo = data?.conversation || data;
      setActiveConvo(convo);
      const msgs = data?.messages || convo?.messages || [];
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = async () => {
    setLoading(true);
    try {
      const data = await request('/conversations', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Conversation', initialMood: 'peaceful' })
      });
      const newConvo = data?.conversation || data;
      if (newConvo?.id) {
        setActiveConvo(newConvo);
        setMessages([]);
        setConversations(prev => [newConvo, ...prev]);
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
      hasStartedNewChat.current = false;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeConvo) return;

    const userMessage = { role: 'user', content: input, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    const messageContent = input;
    setInput('');
    setSending(true);

    const isFirstMessage = messages.length === 0;

    try {
      const data = await request(`/conversations/${activeConvo.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: messageContent })
      });
      const aiMessage = data.assistantMessage || data.message || data.response || data;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiMessage.content || aiMessage, 
        created_at: aiMessage.created_at || new Date().toISOString() 
      }]);

      if (isFirstMessage) {
        const newTitle = generateTitle(messageContent);
        try {
          await request(`/conversations/${activeConvo.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ title: newTitle })
          });
          setActiveConvo(prev => ({ ...prev, title: newTitle }));
          setConversations(prev => prev.map(c => 
            c.id === activeConvo.id ? { ...c, title: newTitle } : c
          ));
        } catch (err) {
          console.log('Could not update title');
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again.', 
        created_at: new Date().toISOString() 
      }]);
    } finally {
      setSending(false);
    }
  };

  const deleteConversation = async (id) => {
    try {
      await request(`/conversations/${id}`, { 
        method: 'PATCH',
        body: JSON.stringify({ deleted_at: new Date().toISOString() })
      });
      const deleted = conversations.find(c => c.id === id);
      if (deleted) {
        setDeletedConversations(prev => [{ ...deleted, deleted_at: new Date().toISOString() }, ...prev]);
      }
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConvo?.id === id) {
        setActiveConvo(null);
        setMessages([]);
      }
    } catch {
      try {
        await request(`/conversations/${id}`, { method: 'DELETE' });
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConvo?.id === id) {
          setActiveConvo(null);
          setMessages([]);
        }
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  const restoreConversation = async (id) => {
    try {
      await request(`/conversations/${id}`, { 
        method: 'PATCH',
        body: JSON.stringify({ deleted_at: null })
      });
      const restored = deletedConversations.find(c => c.id === id);
      if (restored) {
        setConversations(prev => [{ ...restored, deleted_at: null }, ...prev]);
      }
      setDeletedConversations(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to restore:', err);
    }
  };

  const permanentlyDelete = async (id) => {
    try {
      await request(`/conversations/${id}`, { method: 'DELETE' });
      setDeletedConversations(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const startEditing = (convo, e) => {
    e.stopPropagation();
    setEditingId(convo.id);
    setEditTitle(convo.title || 'New Conversation');
  };

  const saveTitle = async (id, e) => {
    e?.stopPropagation();
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await request(`/conversations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: editTitle.trim() })
      });
      setConversations(prev => prev.map(c => 
        c.id === id ? { ...c, title: editTitle.trim() } : c
      ));
    } catch (err) {
      console.error('Failed to rename:', err);
    } finally {
      setEditingId(null);
    }
  };

  const handleEditKeyDown = (id, e) => {
    if (e.key === 'Enter') {
      saveTitle(id, e);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  if (showTrash) {
    return (
      <div className="chat-screen">
        <div className="chat-header">
          <button className="icon-button" onClick={() => setShowTrash(false)}><Icons.ArrowLeft/></button>
          <h1>Recently Deleted</h1>
          <div style={{ width: 40 }}/>
        </div>
        <div className="trash-notice"><p>Conversations are permanently deleted after 30 days</p></div>
        <div className="conversation-list">
          {deletedConversations.length === 0 ? (
            <div className="empty-state"><p>No deleted conversations</p></div>
          ) : (
            deletedConversations.map(convo => (
              <div key={convo.id} className="conversation-item deleted">
                <div className="convo-info">
                  <h3>{convo.title || 'Conversation'}</h3>
                  <p>Deleted {formatDate(convo.deleted_at)}</p>
                </div>
                <div className="convo-actions">
                  <button className="restore-button" onClick={() => restoreConversation(convo.id)}><Icons.Restore/></button>
                  <button className="delete-button permanent" onClick={() => permanentlyDelete(convo.id)}><Icons.Trash/></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (!activeConvo) {
    return (
      <div className="chat-screen">
        <div className="chat-header">
          <h1>Conversations</h1>
          <button className="icon-button" onClick={startNewConversation}><Icons.Plus/></button>
        </div>
        <div className="conversation-list">
          {loading ? (
            <div className="loading-state"><div className="small-spinner"/></div>
          ) : conversations.length === 0 ? (
            <div className="empty-state">
              <p>No conversations yet</p>
              <button className="start-button" onClick={startNewConversation}>Start Your First Conversation</button>
            </div>
          ) : (
            conversations.map(convo => (
              <div key={convo.id} className="conversation-item" onClick={() => !editingId && loadConversation(convo.id)}>
                <div className="convo-info">
                  {editingId === convo.id ? (
                    <input
                      type="text"
                      className="edit-title-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(convo.id, e)}
                      onBlur={(e) => saveTitle(convo.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  ) : (
                    <>
                      <h3>{convo.title || 'New Conversation'}</h3>
                      <p>{formatDate(convo.updated_at || convo.created_at)}</p>
                    </>
                  )}
                </div>
                <div className="convo-actions">
                  {editingId === convo.id ? (
                    <button className="save-button" onClick={(e) => saveTitle(convo.id, e)}>
                      <Icons.Check/>
                    </button>
                  ) : (
                    <button className="edit-button-small" onClick={(e) => startEditing(convo, e)}>
                      <Icons.Edit/>
                    </button>
                  )}
                  <button className="delete-button" onClick={(e) => { e.stopPropagation(); deleteConversation(convo.id); }}>
                    <Icons.Trash/>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {deletedConversations.length > 0 && (
          <button className="trash-link" onClick={() => setShowTrash(true)}>
            <Icons.Archive/> Recently Deleted ({deletedConversations.length})
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="chat-screen active">
      <div className="chat-header">
        <button className="icon-button" onClick={() => { setActiveConvo(null); setMessages([]); hasStartedNewChat.current = false; }}>
          <Icons.ArrowLeft/>
        </button>
        <h1>{activeConvo.title || 'Conversation'}</h1>
        <div style={{ width: 40 }}/>
      </div>

      <div className="messages-container">
        {messages.length === 0 && !loading && (
          <div className="welcome-message">
            <div className="welcome-icon"><Icons.Cross/></div>
            <h2>Peace be with you</h2>
            <p>Share what's on your heart. I'm here to listen, offer scripture, and walk alongside you in faith.</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        
        {sending && (
          <div className="message assistant">
            <div className="message-content typing"><span/><span/><span/></div>
          </div>
        )}
        <div ref={messagesEndRef}/>
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share what's on your heart..."
          disabled={sending}
        />
        <button type="submit" disabled={!input.trim() || sending}><Icons.Send/></button>
      </form>
    </div>
  );
};

// ============================================
// DEVOTIONAL SCREEN
// ============================================
const DevotionalScreen = ({ devotional, loading }) => {
  const { request } = useApi();
  const [completed, setCompleted] = useState(false);

  const markComplete = async () => {
    if (!devotional) return;
    try {
      await request(`/devotionals/${devotional.id}/log`, { 
        method: 'POST',
        body: JSON.stringify({ completed: true })
      });
      setCompleted(true);
    } catch (err) {
      console.error('Failed to log devotional:', err);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading devotional..."/>;
  }

  if (!devotional) {
    return (
      <div className="devotional-screen">
        <div className="empty-state"><p>Unable to load today's devotional</p></div>
      </div>
    );
  }

  return (
    <div className="devotional-screen">
      <div className="devotional-header">
        <span className="devotional-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        <h1>{devotional.title}</h1>
      </div>

      <div className="devotional-content">
        <section className="devo-section">
          <div className="section-header">
            <span className="section-icon">📖</span>
            <h2>Scripture</h2>
          </div>
          <blockquote className="scripture-quote">{devotional.scripture_reference}</blockquote>
        </section>

        <section className="devo-section">
          <div className="section-header">
            <span className="section-icon">💭</span>
            <h2>Reflection</h2>
          </div>
          <p>{devotional.reflection}</p>
        </section>

        <section className="devo-section">
          <div className="section-header">
            <span className="section-icon">🙏</span>
            <h2>Prayer Prompt</h2>
          </div>
          <p>{devotional.prayer_prompt}</p>
        </section>

        <section className="devo-section">
          <div className="section-header">
            <span className="section-icon">✨</span>
            <h2>Today's Action</h2>
          </div>
          <p>{devotional.action_step}</p>
        </section>

        <button 
          className={`complete-button ${completed ? 'completed' : ''}`} 
          onClick={markComplete}
          disabled={completed}
        >
          {completed ? <><Icons.Check/> Completed</> : 'Mark as Complete'}
        </button>
      </div>
    </div>
  );
};

// ============================================
// SCRIPTURES SCREEN - MODERNIZED
// ============================================
const ScripturesScreen = () => {
  const { request } = useApi();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [view, setView] = useState('topics');
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const data = await request('/scriptures/topics');
      setTopics(data.topics || data || []);
    } catch (err) {
      console.error('Failed to load topics:', err);
      // Fallback topics
      setTopics([
        { id: 1, name: 'Anxiety' }, { id: 2, name: 'Depression' }, 
        { id: 3, name: 'Faith' }, { id: 4, name: 'Fear' },
        { id: 5, name: 'Forgiveness' }, { id: 6, name: 'Grace' },
        { id: 7, name: 'Gratitude' }, { id: 8, name: 'Grief' },
        { id: 9, name: 'Guidance' }, { id: 10, name: 'Hope' },
        { id: 11, name: 'Identity' }, { id: 12, name: 'Joy' },
        { id: 13, name: 'Loneliness' }, { id: 14, name: 'Love' },
        { id: 15, name: 'Peace' }, { id: 16, name: 'Prayer' },
        { id: 17, name: 'Purpose' }, { id: 18, name: 'Salvation' },
        { id: 19, name: 'Strength' }, { id: 20, name: 'Trust' }
      ]);
    } finally {
      setInitialLoading(false);
    }
  };

  const searchScriptures = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setView('search');
    setSelectedTopic(null);
    try {
      const data = await request(`/scriptures/search?q=${encodeURIComponent(query)}`);
      setResults(data.verses || data.results || data || []);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTopicVerses = async (topic) => {
    setLoading(true);
    setView('search');
    setSelectedTopic(topic.name);
    try {
      const data = await request(`/scriptures/topics/${topic.id}`);
      setResults(data.verses || data || []);
    } catch (err) {
      console.error('Failed to load topic verses:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingScreen message="Loading scriptures..."/>;
  }

  return (
    <div className="scriptures-screen">
      <div className="scriptures-header">
        <h1>Scripture Search</h1>
        <p className="scriptures-subtitle">Find verses that speak to your heart</p>
      </div>

      <form className="search-form" onSubmit={searchScriptures}>
        <div className="search-input-wrapper">
          <Icons.Search/>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by topic, keyword, or reference..."
          />
        </div>
        <button type="submit" className="search-submit" disabled={!query.trim()}>Search</button>
      </form>

      <div className="scriptures-content">
        {view === 'topics' && (
          <div className="topics-section">
            <h2>Browse by Topic</h2>
            <div className="topics-grid">
              {topics.map(topic => (
                <button 
                  key={topic.id} 
                  className="topic-chip"
                  onClick={() => loadTopicVerses(topic)}
                >
                  {topic.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'search' && (
          <div className="search-results">
            <button className="back-link" onClick={() => { setView('topics'); setResults([]); setSelectedTopic(null); }}>
              ← Back to Topics
            </button>
            
            {selectedTopic && <h2 className="results-title">Verses about {selectedTopic}</h2>}
            
            {loading ? (
              <div className="loading-state"><div className="small-spinner"/></div>
            ) : results.length === 0 ? (
              <div className="empty-state">
                <p>No verses found. Try a different search term.</p>
              </div>
            ) : (
              <div className="verses-list">
                {results.map((verse, i) => (
                  <div key={verse.id || i} className="verse-card">
                    <p className="verse-text">{verse.text_esv || verse.text || verse.content}</p>
                    <cite className="verse-reference">{verse.reference}</cite>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// PRAYERS SCREEN
// ============================================
const PrayersScreen = () => {
  const { request } = useApi();
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPrayer, setNewPrayer] = useState('');
  const [visibility, setVisibility] = useState('community');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    loadPrayers();
  }, []);

  const loadPrayers = async () => {
    try {
      const data = await request('/prayers/requests');
      setPrayers(data.prayers || data.requests || data || []);
    } catch (err) {
      console.error('Failed to load prayers:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitPrayer = async (e) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;

    try {
      await request('/prayers/requests', {
        method: 'POST',
        body: JSON.stringify({ content: newPrayer, visibility, isAnonymous })
      });
      setNewPrayer('');
      setShowForm(false);
      loadPrayers();
    } catch (err) {
      console.error('Failed to submit prayer:', err);
    }
  };

  const prayFor = async (id) => {
    try {
      await request(`/prayers/requests/${id}/pray`, { method: 'POST' });
      setPrayers(prev => prev.map(p => 
        p.id === id ? { ...p, prayer_count: (p.prayer_count || 0) + 1, hasPrayed: true } : p
      ));
    } catch (err) {
      console.error('Failed to mark prayer:', err);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading prayers..."/>;
  }

  return (
    <div className="prayers-screen">
      <div className="prayers-header">
        <h1>Prayer Wall</h1>
        <button className="icon-button" onClick={() => setShowForm(!showForm)}><Icons.Plus/></button>
      </div>

      {showForm && (
        <form className="prayer-form" onSubmit={submitPrayer}>
          <textarea
            value={newPrayer}
            onChange={(e) => setNewPrayer(e.target.value)}
            placeholder="Share your prayer request..."
            rows={4}
          />
          <div className="form-options">
            <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
              <option value="community">Share with Community</option>
              <option value="private">Keep Private</option>
            </select>
            <label className="checkbox-label">
              <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)}/>
              Post Anonymously
            </label>
          </div>
          <button type="submit" className="submit-button">Submit Prayer</button>
        </form>
      )}

      <div className="prayers-list">
        {prayers.length === 0 ? (
          <div className="empty-state"><p>No prayer requests yet. Be the first to share.</p></div>
        ) : (
          prayers.map(prayer => (
            <div key={prayer.id} className="prayer-card">
              <p className="prayer-content">{prayer.content}</p>
              <div className="prayer-meta">
                <span className="prayer-author">
                  {prayer.is_anonymous || prayer.isAnonymous ? 'Anonymous' : (prayer.user?.display_name || 'A fellow believer')}
                </span>
                <button 
                  className={`pray-button ${prayer.hasPrayed ? 'prayed' : ''}`}
                  onClick={() => prayFor(prayer.id)}
                  disabled={prayer.hasPrayed}
                >
                  🙏 {prayer.prayer_count || 0}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================
// PROFILE SCREEN
// ============================================
const ProfileScreen = () => {
  const { user, logout, fetchUser } = useAuth();
  const { request } = useApi();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name || user?.displayName || '');
  const [bibleVersion, setBibleVersion] = useState(user?.preferred_bible_version || 'ESV');

  const saveProfile = async () => {
    try {
      await request('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ displayName, preferredBibleVersion: bibleVersion })
      });
      await fetchUser();
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="profile-screen">
      <div className="profile-header">
        <div className="profile-avatar">
          {(user?.display_name || user?.displayName || 'U')[0].toUpperCase()}
        </div>
        <h1>{user?.display_name || user?.displayName || 'User'}</h1>
        <p className="profile-email">{user?.email}</p>
      </div>

      <div className="profile-content">
        <section className="settings-section">
          <h2>Settings</h2>
          
          {editing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}/>
              </div>
              <div className="form-group">
                <label>Preferred Bible Version</label>
                <select value={bibleVersion} onChange={(e) => setBibleVersion(e.target.value)}>
                  <option value="ESV">ESV</option>
                  <option value="NIV">NIV</option>
                  <option value="KJV">KJV</option>
                  <option value="NASB">NASB</option>
                  <option value="NLT">NLT</option>
                </select>
              </div>
              <div className="button-group">
                <button className="secondary-button" onClick={() => setEditing(false)}>Cancel</button>
                <button className="primary-button" onClick={saveProfile}>Save</button>
              </div>
            </div>
          ) : (
            <div className="settings-list">
              <div className="setting-item">
                <span>Bible Version</span>
                <span>{user?.preferred_bible_version || 'ESV'}</span>
              </div>
              <button className="edit-button" onClick={() => setEditing(true)}>Edit Profile</button>
            </div>
          )}
        </section>

        <section className="danger-zone">
          <button className="logout-button" onClick={logout}><Icons.Logout/> Sign Out</button>
        </section>
      </div>
    </div>
  );
};

// ============================================
// NAVIGATION - FIXED FOR MOBILE
// ============================================
const Navigation = ({ active, onNavigate }) => {
  const items = [
    { id: 'home', icon: Icons.Home, label: 'Home' },
    { id: 'chat', icon: Icons.Chat, label: 'Chat' },
    { id: 'devotional', icon: Icons.Sun, label: 'Daily' },
    { id: 'scriptures', icon: Icons.Book, label: 'Bible' },
    { id: 'profile', icon: Icons.User, label: 'Profile' }
  ];

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button
          key={item.id}
          className={`nav-item ${active === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="nav-icon"><item.icon/></span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

// ============================================
// MAIN APP
// ============================================
const AppContent = () => {
  const { user, loading } = useAuth();
  const { request } = useApi();
  const [screen, setScreen] = useState('home');
  const [screenParams, setScreenParams] = useState(null);
  const [devotional, setDevotional] = useState(null);
  const [devotionalLoading, setDevotionalLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDevotional();
    }
  }, [user]);

  const loadDevotional = async () => {
    try {
      const data = await request('/devotionals/today');
      setDevotional(data.devotional || data);
    } catch (err) {
      console.error('Failed to load devotional:', err);
    } finally {
      setDevotionalLoading(false);
    }
  };

  const navigate = (newScreen, params = null) => {
    setScreen(newScreen);
    setScreenParams(params);
  };

  if (loading) {
    return <LoadingScreen message="Loading Still Waters..."/>;
  }

  if (!user) {
    return <AuthScreen/>;
  }

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen onNavigate={navigate} devotional={devotional} devotionalLoading={devotionalLoading}/>;
      case 'chat': return <ChatScreen onNavigate={navigate} params={screenParams}/>;
      case 'devotional': return <DevotionalScreen devotional={devotional} loading={devotionalLoading}/>;
      case 'scriptures': return <ScripturesScreen/>;
      case 'prayers': return <PrayersScreen/>;
      case 'profile': return <ProfileScreen/>;
      default: return <HomeScreen onNavigate={navigate} devotional={devotional} devotionalLoading={devotionalLoading}/>;
    }
  };

  return (
    <div className="app-container">
      <main className="app-main">{renderScreen()}</main>
      <Navigation active={screen} onNavigate={navigate}/>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent/>
  </AuthProvider>
);

export default App;
