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
    
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
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
  )
};

// ============================================
// LOADING SPINNER
// ============================================
const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} animate-spin`}>
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
};

// ============================================
// AUTH SCREENS
// ============================================
const AuthScreen = () => {
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

  return (
    <div className="auth-screen">
      <div className="auth-ambient"/>
      <div className="auth-container">
        <div className="auth-logo">
          <div className="logo-glow"/>
          <div className="logo-icon">
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="35" r="15" fill="url(#logoGrad)" opacity="0.9"/>
              <ellipse cx="50" cy="70" rx="35" ry="12" fill="url(#waterGrad)" opacity="0.6"/>
              <path d="M50 50 L50 85" stroke="url(#logoGrad)" strokeWidth="2" opacity="0.5"/>
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c4a962"/>
                  <stop offset="100%" stopColor="#f5f0e1"/>
                </linearGradient>
                <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1a5a6a"/>
                  <stop offset="100%" stopColor="#0a3d4d"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="logo-text">
            <span className="logo-still">Still</span>
            <span className="logo-waters">Waters</span>
          </h1>
          <p className="logo-tagline">Your AI Faith Companion</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label>Display Name</label>
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
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
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
            {loading ? <LoadingSpinner size="sm"/> : (mode === 'login' ? 'Enter' : 'Begin Journey')}
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
const HomeScreen = ({ onNavigate }) => {
  const { user } = useAuth();
  const { request } = useApi();
  const [devotional, setDevotional] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDevotional();
  }, []);

  const loadDevotional = async () => {
    try {
      const data = await request('/devotionals/today');
      setDevotional(data.devotional || data);
    } catch (err) {
      console.error('Failed to load devotional:', err);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Daily Devotional Card */}
        <section className="devotional-card" onClick={() => onNavigate('devotional')}>
          <div className="card-glow"/>
          <div className="card-header">
            <span className="card-icon"><Icons.Sun/></span>
            <span className="card-label">Today's Devotional</span>
          </div>
          {loading ? (
            <div className="card-loading"><LoadingSpinner/></div>
          ) : devotional ? (
            <>
              <h2 className="devotional-title">{devotional.title}</h2>
              <p className="devotional-scripture">{devotional.scripture_reference || devotional.scriptureReference}</p>
              <p className="devotional-preview">{devotional.reflection?.substring(0, 120)}...</p>
            </>
          ) : (
            <p className="devotional-preview">Unable to load today's devotional</p>
          )}
          <span className="card-action">Read more →</span>
        </section>

        {/* Quick Actions */}
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

        {/* Scripture of the Day */}
        <section className="scripture-card">
          <blockquote>
            "He leads me beside still waters. He restores my soul."
          </blockquote>
          <cite>— Psalm 23:2-3 ESV</cite>
        </section>
      </div>
    </div>
  );
};

// ============================================
// CHAT SCREEN
// ============================================
const ChatScreen = ({ onNavigate, params }) => {
  const { request } = useApi();
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
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
      const data = await request('/conversations');
      const convos = data?.conversations || (Array.isArray(data) ? data : []);
      setConversations(convos);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await request(`/conversations/${id}`);
      const convo = data?.conversation || data;
      setActiveConvo(convo);
      const msgs = data?.messages || convo?.messages || [];
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setError('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await request('/conversations', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Conversation', initialMood: 'peaceful' })
      });
      const newConvo = data?.conversation || data;
      if (newConvo && newConvo.id) {
        setActiveConvo(newConvo);
        setMessages([]);
        setConversations(prev => [newConvo, ...(Array.isArray(prev) ? prev : [])]);
      } else {
        throw new Error('Invalid conversation response');
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
      setError('Failed to create conversation. Please try again.');
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

    try {
      const data = await request(`/conversations/${activeConvo.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: messageContent })
      });
      // API returns { userMessage, assistantMessage, crisisLevel, flaggedForReview }
      const aiMessage = data.assistantMessage || data.message || data.response || data;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiMessage.content || aiMessage, 
        created_at: aiMessage.created_at || new Date().toISOString() 
      }]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, but I encountered an error. Please try again.', created_at: new Date().toISOString() }]);
    } finally {
      setSending(false);
    }
  };

  const deleteConversation = async (id) => {
    try {
      await request(`/conversations/${id}`, { method: 'DELETE' });
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConvo?.id === id) {
        setActiveConvo(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  // Conversation List View
  if (!activeConvo) {
    return (
      <div className="chat-screen">
        <div className="chat-header">
          <h1>Conversations</h1>
          <button className="icon-button" onClick={startNewConversation}>
            <Icons.Plus/>
          </button>
        </div>

        <div className="conversation-list">
          {loading ? (
            <div className="loading-state"><LoadingSpinner/></div>
          ) : conversations.length === 0 ? (
            <div className="empty-state">
              <p>No conversations yet</p>
              <button className="start-button" onClick={startNewConversation}>
                Start Your First Conversation
              </button>
            </div>
          ) : (
            conversations.map(convo => (
              <div key={convo.id} className="conversation-item" onClick={() => loadConversation(convo.id)}>
                <div className="convo-info">
                  <h3>{convo.title || 'Conversation'}</h3>
                  <p>{new Date(convo.updated_at || convo.created_at).toLocaleDateString()}</p>
                </div>
                <button className="delete-button" onClick={(e) => { e.stopPropagation(); deleteConversation(convo.id); }}>
                  <Icons.Trash/>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Active Chat View
  return (
    <div className="chat-screen active">
      <div className="chat-header">
        <button className="icon-button" onClick={() => { setActiveConvo(null); setMessages([]); }}>
          <Icons.ArrowLeft/>
        </button>
        <h1>{activeConvo.title || 'Conversation'}</h1>
        <div style={{ width: 40 }}/>
      </div>

      <div className="messages-container">
        {messages.length === 0 && !loading && (
          <div className="welcome-message">
            <div className="welcome-icon">✝</div>
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
            <div className="message-content typing">
              <span/><span/><span/>
            </div>
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
        <button type="submit" disabled={!input.trim() || sending}>
          <Icons.Send/>
        </button>
      </form>
    </div>
  );
};

// ============================================
// DEVOTIONAL SCREEN
// ============================================
const DevotionalScreen = ({ onNavigate }) => {
  const { request } = useApi();
  const [devotional, setDevotional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadDevotional();
  }, []);

  const loadDevotional = async () => {
    try {
      const data = await request('/devotionals/today');
      setDevotional(data.devotional || data);
    } catch (err) {
      console.error('Failed to load devotional:', err);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async () => {
    if (!devotional) return;
    try {
      await request(`/devotionals/${devotional.id}/log`, { method: 'POST' });
      setCompleted(true);
    } catch (err) {
      console.error('Failed to log devotional:', err);
    }
  };

  if (loading) {
    return (
      <div className="devotional-screen">
        <div className="loading-state"><LoadingSpinner size="lg"/></div>
      </div>
    );
  }

  if (!devotional) {
    return (
      <div className="devotional-screen">
        <div className="empty-state">
          <p>Unable to load today's devotional</p>
        </div>
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
        <section className="scripture-section">
          <div className="section-icon">📖</div>
          <h2>Scripture</h2>
          <blockquote className="scripture-text">
            {devotional.scripture_reference || devotional.scriptureReference}
          </blockquote>
        </section>

        <section className="reflection-section">
          <div className="section-icon">💭</div>
          <h2>Reflection</h2>
          <p>{devotional.reflection}</p>
        </section>

        <section className="prayer-section">
          <div className="section-icon">🙏</div>
          <h2>Prayer Prompt</h2>
          <p>{devotional.prayer_prompt || devotional.prayerPrompt}</p>
        </section>

        <section className="action-section">
          <div className="section-icon">✨</div>
          <h2>Today's Action</h2>
          <p>{devotional.action_step || devotional.actionStep}</p>
        </section>

        <button 
          className={`complete-button ${completed ? 'completed' : ''}`} 
          onClick={markComplete}
          disabled={completed}
        >
          {completed ? (
            <><Icons.Check/> Completed</>
          ) : (
            'Mark as Complete'
          )}
        </button>
      </div>
    </div>
  );
};

// ============================================
// SCRIPTURES SCREEN
// ============================================
const ScripturesScreen = ({ onNavigate }) => {
  const { request } = useApi();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('topics');

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const data = await request('/scriptures/topics');
      setTopics(data.topics || data || []);
    } catch (err) {
      console.error('Failed to load topics:', err);
    }
  };

  const searchScriptures = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setView('search');
    try {
      const data = await request(`/scriptures/search?q=${encodeURIComponent(query)}`);
      setResults(data.verses || data.results || data || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTopicVerses = async (topicId) => {
    setLoading(true);
    setView('search');
    try {
      const data = await request(`/scriptures/topics/${topicId}`);
      setResults(data.verses || data || []);
    } catch (err) {
      console.error('Failed to load topic verses:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scriptures-screen">
      <div className="scriptures-header">
        <h1>Scripture Search</h1>
        <form className="search-form" onSubmit={searchScriptures}>
          <div className="search-input-wrapper">
            <Icons.Search/>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search verses or topics..."
            />
          </div>
        </form>
      </div>

      <div className="scriptures-content">
        {view === 'topics' && (
          <div className="topics-grid">
            <h2>Browse by Topic</h2>
            <div className="topics-list">
              {topics.map(topic => (
                <button 
                  key={topic.id} 
                  className="topic-chip"
                  onClick={() => loadTopicVerses(topic.id)}
                >
                  {topic.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'search' && (
          <div className="search-results">
            <button className="back-link" onClick={() => setView('topics')}>
              ← Back to Topics
            </button>
            
            {loading ? (
              <div className="loading-state"><LoadingSpinner/></div>
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
const PrayersScreen = ({ onNavigate }) => {
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
        body: JSON.stringify({ 
          content: newPrayer, 
          visibility, 
          isAnonymous 
        })
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

  return (
    <div className="prayers-screen">
      <div className="prayers-header">
        <h1>Prayer Wall</h1>
        <button className="icon-button" onClick={() => setShowForm(!showForm)}>
          <Icons.Plus/>
        </button>
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
              <input 
                type="checkbox" 
                checked={isAnonymous} 
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              Post Anonymously
            </label>
          </div>
          <button type="submit" className="submit-button">Submit Prayer</button>
        </form>
      )}

      <div className="prayers-list">
        {loading ? (
          <div className="loading-state"><LoadingSpinner/></div>
        ) : prayers.length === 0 ? (
          <div className="empty-state">
            <p>No prayer requests yet. Be the first to share.</p>
          </div>
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
const ProfileScreen = ({ onNavigate }) => {
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
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
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
              <button className="edit-button" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </section>

        <section className="danger-zone">
          <button className="logout-button" onClick={logout}>
            <Icons.Logout/>
            Sign Out
          </button>
        </section>
      </div>
    </div>
  );
};

// ============================================
// NAVIGATION
// ============================================
const Navigation = ({ active, onNavigate }) => {
  const items = [
    { id: 'home', icon: Icons.Home, label: 'Home' },
    { id: 'chat', icon: Icons.Chat, label: 'Chat' },
    { id: 'devotional', icon: Icons.Sun, label: 'Devotional' },
    { id: 'scriptures', icon: Icons.Book, label: 'Scripture' },
    { id: 'prayers', icon: Icons.Heart, label: 'Prayers' },
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
  const [screen, setScreen] = useState('home');
  const [screenParams, setScreenParams] = useState(null);

  const navigate = (newScreen, params = null) => {
    setScreen(newScreen);
    setScreenParams(params);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="lg"/>
        <p>Loading Still Waters...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen/>;
  }

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen onNavigate={navigate}/>;
      case 'chat': return <ChatScreen onNavigate={navigate} params={screenParams}/>;
      case 'devotional': return <DevotionalScreen onNavigate={navigate}/>;
      case 'scriptures': return <ScripturesScreen onNavigate={navigate}/>;
      case 'prayers': return <PrayersScreen onNavigate={navigate}/>;
      case 'profile': return <ProfileScreen onNavigate={navigate}/>;
      default: return <HomeScreen onNavigate={navigate}/>;
    }
  };

  return (
    <div className="app-container">
      <main className="app-main">
        {renderScreen()}
      </main>
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
