
// ChatGPT API Logic

const API_KEY_KEY = "openai_api_key";
const API_URL = "https://api.openai.com/v1/chat/completions";

// Initialize functionality
document.addEventListener("DOMContentLoaded", () => {
    checkApiKey();
});

function checkApiKey() {
    const apiKey = localStorage.getItem(API_KEY_KEY);
    const apiKeyInput = document.getElementById("api-key-input");
    const apiKeyContainer = document.getElementById("api-key-container");

    if (apiKey) {
        apiKeyContainer.style.display = "none";
    } else {
        apiKeyContainer.style.display = "block";
    }
}

function saveApiKey() {
    const input = document.getElementById("api-key-input");
    const key = input.value.trim();
    if (key) {
        localStorage.setItem(API_KEY_KEY, key);
        checkApiKey();
        alert("API Key saved securely in your browser!");
    }
}

function clearApiKey() {
    localStorage.removeItem(API_KEY_KEY);
    checkApiKey();
    alert("API Key removed.");
}

async function sendPrompt() {
    const apiKey = localStorage.getItem(API_KEY_KEY);
    if (!apiKey) {
        alert("Please set your OpenAI API Key first.");
        document.getElementById("api-key-container").style.display = "block";
        return;
    }

    const promptInput = document.getElementById("prompt-input");
    const promptText = promptInput.value.trim();
    const resultArea = document.getElementById("result-area");
    const sendBtn = document.getElementById("send-btn");

    if (!promptText) return;

    // UI Loading State
    sendBtn.disabled = true;
    sendBtn.textContent = "Thinking... 🤔";
    resultArea.style.display = "none";
    resultArea.textContent = "";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Use a fast, cost-effective model
                messages: [{ role: "user", content: promptText }],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "API Error");
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;

        // Display Result
        resultArea.style.display = "block";
        resultArea.innerHTML = marked.parse(reply); // Assume marked js is loaded for Markdown

    } catch (error) {
        console.error(error);
        resultArea.style.display = "block";
        resultArea.textContent = `Error: ${error.message}`;
        if (error.message.includes("Incorrect API key")) {
            clearApiKey();
        }
    } finally {
        // Reset UI
        sendBtn.disabled = false;
        sendBtn.textContent = "Send Prompt 🚀";
    }
}
