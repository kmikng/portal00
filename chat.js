// Google Gemini API Logic

const API_KEY_KEY = "gemini_api_key";
// Using gemini-pro (stable) to avoid "model not found" errors
const API_URL_BASE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Initialize functionality
document.addEventListener("DOMContentLoaded", () => {
    checkApiKey();
});

function checkApiKey() {
    const apiKey = localStorage.getItem(API_KEY_KEY);
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
        alert("Gemini API Key saved securely!");
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
        alert("Please set your Google Gemini API Key first.");
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
    sendBtn.textContent = "Gemini is Thinking... 🤔";
    resultArea.style.display = "none";
    resultArea.textContent = "";

    try {
        const response = await fetch(`${API_URL_BASE}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptText }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Gemini API Error");
        }

        const data = await response.json();
        // Gemini response structure
        const reply = data.candidates[0].content.parts[0].text;

        // Display Result
        resultArea.style.display = "block";
        resultArea.innerHTML = marked.parse(reply);

    } catch (error) {
        console.error(error);
        resultArea.style.display = "block";
        resultArea.textContent = `Error: ${error.message}`;
    } finally {
        // Reset UI
        sendBtn.disabled = false;
        sendBtn.textContent = "Send Prompt 🚀";
    }
}
