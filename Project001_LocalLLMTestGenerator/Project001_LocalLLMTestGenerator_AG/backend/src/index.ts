import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { generateTestCases } from './llmProvider';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/test-connection', async (req, res) => {
  try {
    const { llmConfig } = req.body;
    if (!llmConfig) return res.status(400).json({ error: 'Missing configuration' });

    if (!llmConfig.apiKey && ['openai', 'grok', 'claude', 'gemini'].includes(llmConfig.provider)) {
      return res.json({ success: false, error: `API Key required for ${llmConfig.provider.toUpperCase()}` });
    }

    if (llmConfig.provider === 'ollama') {
      await axios.get(llmConfig.baseUrl || 'http://localhost:11434');
    } else if (llmConfig.provider === 'lmstudio') {
      await axios.get((llmConfig.baseUrl || 'http://localhost:1234/v1') + '/models');
    } else if (llmConfig.provider === 'openai' || llmConfig.provider === 'grok') {
      let url = llmConfig.baseUrl || (llmConfig.provider === 'openai' ? 'https://api.openai.com/v1' : 'https://api.x.ai/v1');
      await axios.get(url + '/models', { headers: { Authorization: `Bearer ${llmConfig.apiKey}` } });
    }
    
    res.json({ success: true });
  } catch (error: any) {
    res.json({ success: false, error: error.message });
  }
});

app.post('/api/generate-tests', async (req, res) => {
  try {
    const { requirement, llmConfig } = req.body;
    
    if (!requirement || !llmConfig) {
      return res.status(400).json({ error: 'Missing requirement or LLM configuration' });
    }

    const testCases = await generateTestCases(requirement, llmConfig);
    res.json({ success: true, data: testCases });
  } catch (error: any) {
    console.error('Error generating tests:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
