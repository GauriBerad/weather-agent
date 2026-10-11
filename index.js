import 'dotenv/config';
import OpenAi from 'openai';
import readlineSync from 'readline-sync';

const client = new OpenAi({ 
    apiKey: process.env.GEMINI_API_KEY, 
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

function getWeatherDetails(city=' '){
    if (!city) return 'Weather data not found';
    const c = city.toLowerCase().trim();
    if (c === 'pune') return '25°C';
    if (c === 'mumbai') return '29°C';
    if (c === 'aurangabad') return '35°C';
    if (c === 'khadki') return '22°C';
    if (c === 'hadapsar') return '20°C';
    if (c === 'wakad') return '23°C';
    return 'Weather data not found';
}

const tools = {
    getWeatherDetails: getWeatherDetails
};

// UPDATED SYSTEM PROMPT: Strictly demand a SINGLE JSON object, NEVER an array.
const SYSTEM_PROMPT = `You are an AI Assistant that follows a ReAct loop using START, PLAN, ACTION, Observation, and Output states.
CRITICAL RULE: You must ALWAYS respond with a SINGLE JSON object, never an array. Output one step at a time.

Available Tools:
- function getWeatherDetails(city: string): string
getWeatherDetails accepts a city name as a string and returns weather details.

Example Turn 1:
{ "type": "plan", "plan": "I will call getWeatherDetails for Pune" }

Example Turn 2 (Action):
{ "type": "action", "function": "getWeatherDetails", "input": "pune" }

Example Final Turn:
{ "type": "output", "output": "The weather in Pune is 25°C" }
`;

const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

while (true) {
    const query = readlineSync.question('>> ');
    const q = {
        type: 'user',
        user: query,
    };   
    messages.push({ role: 'user', content: JSON.stringify(q) });

    while (true) {
        const chat = await client.chat.completions.create({
            model: 'gemini-3.8-flash',
            messages: messages,
            response_format: { type: 'json_object' },
        });

        const result = chat.choices[0].message.content; 
        messages.push({ role: 'assistant', content: result });

        console.log("🤖:", result);

        let parsed;
        try {
            parsed = JSON.parse(result);
        } catch (e) {
            console.log("Error parsing JSON from model.");
            break;
        }

        // If the model accidentally returned an array, take the first element
        const call = Array.isArray(parsed) ? parsed[0] : parsed;

        if (!call || !call.type) {
            console.log("Invalid response format received.");
            break;
        }

        if (call.type === 'output') {
            console.log(`🤖 Final Answer: ${call.output}`);
            break;
        } else if (call.type === 'action') {
            const fn = tools[call.function];
            const observation = fn ? fn(call.input) : "Tool not found";
            
            const obs = { type: 'observation', observation: observation };
            messages.push({ role: 'user', content: JSON.stringify(obs) });
        } else {
            // If it's just a plan, we need to prompt it to continue or feed an acknowledgment so it doesn't end on a model turn
            messages.push({ role: 'user', content: JSON.stringify({ type: 'status', message: 'Proceed to action' }) });
        }
    }
}