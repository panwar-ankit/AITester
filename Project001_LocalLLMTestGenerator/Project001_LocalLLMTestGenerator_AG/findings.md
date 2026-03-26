# Findings

## Research
- **Target Language & Frameworks:** API & Web App domains (React/Node). Tests should cover Functional & Non-functional testing.
- **Inputs:** Users supply Jira requirements via copy-paste or chat interface.
- **LLM Integrations:** Needs to support Ollama, LM Studio, Grok, OpenAI, Claude, and Gemini APIs.
- **Stack:** Node.js (Backend) + React (Frontend), all in TypeScript.
- **Outputs:** AI must generate responses formatted exactly as Jira Test Cases (Functional/Non-Functional).
- **Configurations:** The design configurations exist in an external document (or LTG_Design.docx) which dictates UI/Settings fields.

## Discoveries & Constraints
- **Protocol 0 Active**: No coding scripts until `task_plan.md` Blueprint is explicitly approved.
- Outputs must be strictly formatted for Jira compliance.
