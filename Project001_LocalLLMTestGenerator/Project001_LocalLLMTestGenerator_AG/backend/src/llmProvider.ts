import axios from 'axios';

export interface LLMConfig {
  provider: 'ollama' | 'lmstudio' | 'openai' | 'claude' | 'grok' | 'gemini';
  baseUrl?: string;
  apiKey?: string;
  model: string;
}

const buildJiraPrompt = (requirement: string) => {
  return `
You are an expert QA Engineer. Your task is to analyze the following Jira requirement and generate comprehensive Functional and Non-Functional Test Cases. 
You must output ONLY the test cases strictly formatted for Jira (e.g., using Jira markdown tables or structured blocks).

Jira Requirement:
${requirement}

Please output in the following format:
h2. Functional Test Cases
|| Test Case ID || Summary || Preconditions || Steps || Expected Result ||
| TC-F01 | ... | ... | ... | ... |

h2. Non-Functional Test Cases
|| Test Case ID || Summary || Type (Perf/Sec) || Steps || Expected Result ||
| TC-NF01 | ... | ... | ... | ... |
  `.trim();
};

export const generateTestCases = async (requirement: string, config: LLMConfig): Promise<string> => {
  const prompt = buildJiraPrompt(requirement);

  switch (config.provider) {
    case 'ollama':
      return await callOllama(prompt, config);
    case 'lmstudio':
      return await callOpenAICompatible(prompt, config, 'lmstudio');
    case 'openai':
      return await callOpenAICompatible(prompt, config, 'openai');
    case 'grok':
      return await callOpenAICompatible(prompt, config, 'grok');
    case 'claude':
      return await callClaude(prompt, config);
    case 'gemini':
      return await callGemini(prompt, config);
    default:
      throw new Error(`Unsupported provider: ${config.provider}`);
  }
};

async function callOllama(prompt: string, config: LLMConfig): Promise<string> {
  const url = config.baseUrl || 'http://localhost:11434';
  const response = await axios.post(`${url}/api/generate`, {
    model: config.model || 'llama3',
    prompt: prompt,
    stream: false
  });
  return response.data.response;
}

async function callOpenAICompatible(prompt: string, config: LLMConfig, type: string): Promise<string> {
  let url = config.baseUrl;
  if (!url) {
    if (type === 'openai') url = 'https://api.openai.com/v1';
    else if (type === 'grok') url = 'https://api.x.ai/v1';
    else url = 'http://localhost:1234/v1';
  }
  
  const headers: any = { 'Content-Type': 'application/json' };
  if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;

  const response = await axios.post(`${url}/chat/completions`, {
    model: config.model,
    messages: [{ role: 'user', content: prompt }]
  }, { headers });
  
  return response.data.choices[0].message.content;
}

async function callClaude(prompt: string, config: LLMConfig): Promise<string> {
  const url = config.baseUrl || 'https://api.anthropic.com/v1/messages';
  const headers: any = {
    'Content-Type': 'application/json',
    'x-api-key': config.apiKey,
    'anthropic-version': '2023-06-01'
  };

  const response = await axios.post(url, {
    model: config.model || 'claude-3-opus-20240229',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  }, { headers });

  return response.data.content[0].text;
}

async function callGemini(prompt: string, config: LLMConfig): Promise<string> {
  const model = config.model || 'gemini-1.5-pro-latest';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;
  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }]
  }, { headers: { 'Content-Type': 'application/json' } });

  return response.data.candidates[0].content.parts[0].text;
}
