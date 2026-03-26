import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Plus, History as HistoryIcon, Loader2, Bot } from 'lucide-react';
import SettingsModal from './components/SettingsModal';
import './App.css';

export interface LLMConfig {
  provider: 'ollama' | 'lmstudio' | 'openai' | 'claude' | 'grok' | 'gemini';
  baseUrl: string;
  apiKey: string;
  model: string;
}

const App: React.FC = () => {
  const [requirement, setRequirement] = useState('');
  const [testCases, setTestCases] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [history, setHistory] = useState<string[]>(['TC: Login Page', 'TC: Shopping Cart']);

  const [config, setConfig] = useState<LLMConfig>(() => {
    const saved = localStorage.getItem('llmConfig');
    return saved ? JSON.parse(saved) : {
      provider: 'ollama',
      baseUrl: 'http://localhost:11434',
      apiKey: '',
      model: 'llama3'
    };
  });

  useEffect(() => {
    localStorage.setItem('llmConfig', JSON.stringify(config));
  }, [config]);

  const handleGenerate = async () => {
    if (!requirement.trim()) return;
    setLoading(true);
    setHistory(prev => [requirement.substring(0, 20) + '...', ...prev]);
    
    // Set placeholder immediately to match the requested visual state
    setTestCases('');
    try {
      const response = await axios.post('http://localhost:3001/api/generate-tests', {
        requirement,
        llmConfig: config
      });
      if (response.data.success) {
        setTestCases(response.data.data);
      } else {
        setTestCases(`Error: ${response.data.error}`);
      }
    } catch (err: any) {
      setTestCases(`Connection Error: ${err.message}. Ensure backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="aurora-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>
      
      <header className="glass-header">
        <div className="logo">
          <Bot className="icon-pulse" size={28} />
          <h1>LLM Test Generator</h1>
        </div>
        <button className="settings-btn" onClick={() => setIsSettingsOpen(true)}>
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </header>

      <main className="main-content">
        <div className="wireframe-layout">
          
          {/* Sidebar */}
          <div className="sidebar glass-panel">
            <h2 className="sidebar-title"><HistoryIcon size={18}/> History</h2>
            <div className="history-list">
              {history.map((item, idx) => (
                <div key={idx} className="history-item">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Main Workspace */}
          <div className="workspace">
            
            {/* Output Panel (Top) */}
            <div className="output-panel glass-panel">
              {loading ? (
                <div className="loading-state">
                  <Loader2 className="cyber-spinner" size={40}/>
                  <p>Generating with {config.provider.toUpperCase()}...</p>
                </div>
              ) : testCases ? (
                <pre className="jira-format">{testCases}</pre>
              ) : (
                <div className="empty-state">
                  <p>Test Case generated with Ollama API / groq/ open Al</p>
                </div>
              )}
            </div>

            {/* Input Panel (Bottom) */}
            <div className="input-panel glass-panel">
              <input 
                type="text"
                value={requirement}
                onChange={e => setRequirement(e.target.value)}
                placeholder="Ask here is here TC for Requirement"
                className="wireframe-input"
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              />
            </div>
            
            {/* Plus Button Center Below Input */}
            <div className="action-row">
              <button 
                className="plus-btn" 
                onClick={handleGenerate}
                disabled={loading || !requirement.trim()}
              >
                <Plus size={30} strokeWidth={2.5} />
              </button>
            </div>

          </div>
        </div>
      </main>

      {isSettingsOpen && (
        <SettingsModal 
          config={config} 
          setConfig={setConfig} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
