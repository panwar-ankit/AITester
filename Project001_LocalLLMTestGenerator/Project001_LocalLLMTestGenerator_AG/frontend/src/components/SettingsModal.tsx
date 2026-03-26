import React, { useState } from 'react';
import type { LLMConfig } from '../App';
import { X, Server, Key, Box, Save, Activity } from 'lucide-react';
import axios from 'axios';

interface Props {
  config: LLMConfig;
  setConfig: (config: LLMConfig) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<Props> = ({ config, setConfig, onClose }) => {
  const [localConfig, setLocalConfig] = useState<LLMConfig>(config);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleSave = () => {
    setConfig(localConfig);
    onClose();
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    try {
      const response = await axios.post('http://localhost:3001/api/test-connection', { llmConfig: localConfig });
      if (response.data.success) {
        setTestStatus('success');
      } else {
        alert(response.data.error);
        setTestStatus('error');
      }
    } catch (err) {
      console.error(err);
      alert('Backend unreachable!');
      setTestStatus('error');
    }
  };

  const providers = ['ollama', 'grok', 'openai', 'lmstudio', 'claude', 'gemini'];

  const providerDefaults: Record<string, Partial<LLMConfig>> = {
    ollama: { baseUrl: 'http://localhost:11434', model: 'llama3' },
    grok: { baseUrl: 'https://api.x.ai/v1', model: 'grok-1.5' },
    openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o' },
    lmstudio: { baseUrl: 'http://localhost:1234/v1', model: 'local-model' },
    claude: { baseUrl: 'https://api.anthropic.com/v1/messages', model: 'claude-3-opus-20240229' },
    gemini: { baseUrl: '', model: 'gemini-1.5-pro-latest' },
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prov = e.target.value as LLMConfig['provider'];
    setLocalConfig({
      ...localConfig,
      provider: prov,
      baseUrl: providerDefaults[prov].baseUrl || '',
      model: providerDefaults[prov].model || '',
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel bounce-in wireframe-modal">
        
        <div className="modal-header">
          <h2>Settings</h2>
          <button onClick={onClose} className="close-btn"><X size={20}/></button>
        </div>
        
        {/* Core grouped settings box matching user wireframe */}
        <div className="settings-inner-box">
            
            <div className="form-group wireframe-field">
                <label>Active Provider</label>
                <select value={localConfig.provider} onChange={handleProviderChange} className="cyber-input">
                  {providers.map(p => (
                    <option key={p} value={p}>{p.toUpperCase()} Setting</option>
                  ))}
                </select>
            </div>

            <div className="form-group wireframe-field">
                <label>Base URL / Endpoint</label>
                <input 
                  type="text" 
                  value={localConfig.baseUrl} 
                  onChange={e => setLocalConfig({...localConfig, baseUrl: e.target.value})}
                  className="cyber-input"
                  placeholder="e.g. http://localhost:11434"
                />
            </div>

            <div className="form-group wireframe-field">
                <label>API Keys</label>
                <input 
                  type="password" 
                  value={localConfig.apiKey} 
                  onChange={e => setLocalConfig({...localConfig, apiKey: e.target.value})}
                  className="cyber-input"
                  placeholder="sk-..."
                />
            </div>

            <div className="form-group wireframe-field">
                <label>Model Configuration</label>
                <input 
                  type="text" 
                  value={localConfig.model} 
                  onChange={e => setLocalConfig({...localConfig, model: e.target.value})}
                  className="cyber-input"
                />
            </div>

        </div>

        <div className="modal-bottom-row">
          <button className="glass-btn primary save-btn" onClick={handleSave}>
            <Save size={18}/> Save Button
          </button>
          
          <button className={`glass-btn secondary test-btn ${testStatus}`} onClick={handleTestConnection}>
            <Activity size={18}/> 
            {testStatus === 'testing' ? 'Testing...' : testStatus === 'success' ? 'Connection OK' : testStatus === 'error' ? 'Failed' : 'Test Connection'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;
