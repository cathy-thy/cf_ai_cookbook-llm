const chatMessages = document.getElementById("chat-messages");
const typingIndicator = document.getElementById("typing-indicator");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const cookbookOutput = document.getElementById("cookbook-output");

async function sendMessage() {
	const message = userInput.value.trim();
	if (!message) return;
  
	// Add user message to left panel
	const userEl = document.createElement("div");
	userEl.className = "message user-message";
	userEl.innerHTML = `<p>${message}</p>`;
	chatMessages.appendChild(userEl);
  
	userInput.value = "";
  
	// ⭐ Show indicator when AI starts thinking
	typingIndicator.style.display = "block";
  
	const response = await fetch("/api/chat", {
	  method: "POST",
	  headers: { "Content-Type": "application/json" },
	  body: JSON.stringify({
		messages: [
		  { role: "system", content: "You are a wizard who provides recipes." },
		  { role: "user", content: message }
		]
	  })
	});
  
	const data = await response.json();
	const reply = data.response || "Hmm… the spirits are silent.";
  
	// ⭐ Hide indicator when done
	typingIndicator.style.display = "none";
  
	// Split wizard dialogue + recipe
	const lines = reply.split("\n");
	const wizardDialogue = lines[0];
	const recipeText = lines.slice(1).join("\n").trim();
  
	// LEFT SIDE WIZARD DIALOGUE
	const wizardEl = document.createElement("div");
	wizardEl.className = "message assistant-message";
	wizardEl.innerHTML = `<p>${wizardDialogue}</p>`;
	chatMessages.appendChild(wizardEl);
  
	// RIGHT SIDE RECIPE OUTPUT
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