// Google Gemini Web Redirect Logic

document.addEventListener("DOMContentLoaded", () => {
    // No initialization needed for this simple mode
});

async function sendPrompt() {
    const promptInput = document.getElementById("prompt-input");
    const promptText = promptInput.value.trim();
    const sendBtn = document.getElementById("send-btn");

    if (!promptText) {
        alert("Please enter a prompt first.");
        return;
    }

    // 1. Copy to Clipboard
    try {
        await navigator.clipboard.writeText(promptText);

        // UI Feedback
        const originalText = sendBtn.textContent;
        sendBtn.textContent = "Copied! Opening Gemini... 📋";
        sendBtn.disabled = true;

        // 2. Open Gemini Web
        setTimeout(() => {
            window.open("https://gemini.google.com/app", "_blank");

            // Reset UI after a delay
            setTimeout(() => {
                sendBtn.textContent = originalText;
                sendBtn.disabled = false;
            }, 1000);
        }, 500);

    } catch (err) {
        console.error('Failed to copy: ', err);
        alert("Failed to copy text. Please copy manually.");
        window.open("https://gemini.google.com/app", "_blank");
    }
}

// Remove unused functions if they are called from HTML
function checkApiKey() { }
function saveApiKey() { }
function clearApiKey() { }

// Map Logic
function updateLocation() {
    const btn = document.getElementById("update-loc-btn");
    const iframe = document.getElementById("map-iframe");

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    btn.disabled = true;
    btn.textContent = "Locating... 🛰️";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Legacy embed format: maps.google.com/maps?q=lat,lon&z=15&output=embed
            iframe.src = `https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;

            btn.textContent = "Location Updated 📍";
            btn.disabled = false;
        },
        (error) => {
            console.error("Error getting location:", error);
            alert("Unable to retrieve your location. Please check browser permissions.");
            btn.textContent = "Update Location 📍";
            btn.disabled = false;
        }
    );
}
