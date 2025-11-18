const chatMessages = document.getElementById("chat-messages");
const typingIndicator = document.getElementById("typing-indicator");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const cookbookOutput = document.getElementById("cookbook-output");

let sessionId = localStorage.getItem("wizard-session-id") || null;

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  const userEl = document.createElement("div");
  userEl.className = "message user-message";
  userEl.innerHTML = `<p>${message}</p>`;
  chatMessages.appendChild(userEl);
  // Auto-scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;

  userInput.value = "";
  typingIndicator.style.display = "block";

  const headers = { "Content-Type": "application/json" };
  if (sessionId) headers["X-Session-ID"] = sessionId;

  const response = await fetch("/api/chat", {
    method: "POST",
    headers,
    body: JSON.stringify({
      messages: [
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();

  // ALWAYS update sessionId
  if (data.sessionId) {
    sessionId = data.sessionId;
    localStorage.setItem("wizard-session-id", sessionId);
  }

  const reply = data.response || "Hmm… the spirits are silent.";
  typingIndicator.style.display = "none";

  const lines = reply.split("\n");
  const wizardDialogue = lines[0];
  const recipeText = lines.slice(1).join("\n").trim();

  const wizardEl = document.createElement("div");
  wizardEl.className = "message assistant-message";
  wizardEl.innerHTML = `<p>${wizardDialogue}</p>`;
  chatMessages.appendChild(wizardEl);
  // Auto-scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (recipeText.length > 0) {
    cookbookOutput.textContent = recipeText;
  }
}

sendButton.onclick = sendMessage;

userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});