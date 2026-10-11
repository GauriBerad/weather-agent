# Custom ReAct AI Agent from Scratch (Node.js & Gemini)

A lightweight, educational implementation of a custom **ReAct (Reasoning and Acting)** AI agent built from scratch using Node.js, the OpenAI JavaScript SDK, and Google Gemini via an OpenAI-compatible endpoint. 

Instead of relying on heavy pre-built agent frameworks, this project demonstrates how agent loops work under the hood using structured JSON states (`plan`, `action`, `observation`, and `output`).

---

## 🚀 Features

* **Manual ReAct Loop:** Implements a custom reasoning loop where the model thinks step-by-step, calls local functions, observes results, and generates a final answer.
* **OpenAI SDK + Gemini Compatibility:** Uses the official OpenAI client package redirected to Google AI Studio's endpoint (`gemini-3.8-flash`) to leverage fast, free-tier models.
* **Local Tool Execution:** Includes a mock weather tool function (`getWeatherDetails`) that the agent can dynamically invoke based on user prompts.
* **Secure Environment Configuration:** Uses `dotenv` to keep API keys safe and out of version control.

---

## 🛠️ Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine (v18+ recommended).

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
   cd "AI agents"
Install dependencies:

Bash
npm install
Configure your environment variables:
Create a .env file in the root directory of your project and add your Google AI Studio API key:

Code snippet
GEMINI_API_KEY=your_google_api_key_here
Run the agent:

Bash
node index.js
💻 Usage
Once you start the script, a prompt (>>) will appear in your terminal. You can ask questions requiring tool calls:

Plaintext
>> what is pune weather
🤖: {"type":"plan","plan":"I will retrieve the weather details for Pune using getWeatherDetails tool."}
🤖: {"type":"action","function":"getWeatherDetails","input":"Pune"}
🤖: {"type":"output","output":"The weather in Pune is 25°C."}
🤖 Final Answer: The weather in Pune is 25°C.
To exit the application at any time, press Ctrl + C.

📂 Project Structure
index.js — Core logic containing the system prompt, tool definitions, and the ReAct execution loop.

package.json — Project metadata, dependencies (openai, readline-sync, dotenv), and ES module configuration ("type": "module").

.env — Local environment secrets (ignored by Git).

.gitignore — Specifies files/folders to exclude from GitHub (node_modules/, .env).

🛡️ License
This project is open-source and available for educational purposes.