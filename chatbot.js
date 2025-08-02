// Local helpline info
const HELPLINE_TELE_MANAS = "14416";
const EMERGENCY_NUMBER = "112";

const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end it", "don't want to live", 
  "hopeless", "worthless", "i give up", "tired of living",
  "self harm", "cut myself"
];

const EXAM_KEYWORDS = ["exam", "board", "stress", "anxiety", "nervous"];

const greetings = [
  "Namaste! मैं MindMitra हूँ, आपकी mental health के लिए आपकी दोस्त 🤗",
  "Hello! I'm MindMitra, your friendly mental health chatbot.",
  "आप मुझसे हिंदी या English में बात कर सकते हैं। Let's chat!"
];

// Basic keyword-based intent recognition
function detectIntent(text) {
  const txt = text.toLowerCase();
  if (CRISIS_KEYWORDS.some(kw => txt.includes(kw))) {
    return "crisis";
  }
  if (EXAM_KEYWORDS.some(kw => txt.includes(kw))) {
    return "exam_stress";
  }
  if (txt.includes("breath") || txt.includes("breathing")) {
    return "breathing_exercise";
  }
  return "general";
}

// Basic sentiment heuristic
function sentimentScore(text) {
  // Simple heuristics, can be replaced with APIs or models
  const negatives = ["sad", "depressed", "anxious", "worried", "tired"];
  const positives = ["happy", "good", "better", "fine", "okay", "great"];
  let score = 0;
  const txt = text.toLowerCase();

  negatives.forEach(word => {
    if (txt.includes(word)) score -= 1;
  });
  positives.forEach(word => {
    if (txt.includes(word)) score += 1;
  });

  return score;
}

function appendMessage(text, sender = "bot") {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = message ${sender};
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Breathing exercise, simple step by step instructions with delay
async function breathingExercise() {
  appendMessage("Let's do a simple breathing exercise together.", "bot");
  await delay(1000);
  appendMessage("Breathe in for 4 seconds...", "bot");
  await delay(4000);
  appendMessage("Hold your breath for 7 seconds...", "bot");
  await delay(7000);
  appendMessage("Breathe out for 8 seconds...", "bot");
  await delay(8000);
  appendMessage("Great! Repeat as needed when you're feeling anxious.", "bot");
}

// Main response handler
async function handleUserMessage(input) {
  const intent = detectIntent(input);
  const sentiment = sentimentScore(input);

  if (intent === "crisis") {
    appendMessage(I'm really sorry you're feeling this way. Please call Tele MANAS at ${HELPLINE_TELE_MANAS} or dial ${EMERGENCY_NUMBER} immediately if you're in danger. You are not alone., "bot");
    return;
  }

  if (intent === "exam_stress") {
    appendMessage("Exams can be really stressful! Would you like to try a breathing exercise to help you relax? (yes/no)", "bot");
    return "awaiting_breathing_confirmation";
  }

  if (intent === "breathing_exercise") {
    await breathingExercise();
    return;
  }

  if (sentiment < 0) {
    appendMessage("I hear you're feeling a bit down. Want to talk more about it or try some coping strategies?", "bot");
    return "awaiting_coping_response";
  }

  if (sentiment > 0) {
    appendMessage("That's great to hear! Keep focusing on the positives!", "bot");
  } else {
    appendMessage("I'm here to listen whenever you need.", "bot");
  }
  return;
}

// State management for conversation
let conversationState = null;

document.getElementById("sendBtn").addEventListener("click", async () => {
  const inputField = document.getElementById("userInput");
  const text = inputField.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  inputField.value = "";

  if (conversationState === "awaiting_breathing_confirmation") {
    if (text.toLowerCase() === "yes") {
      await breathingExercise();
    } else {
      appendMessage("No worries! I'm here if you want to chat or try other techniques.", "bot");
    }
    conversationState = null;
  } else if (conversationState === "awaiting_coping_response") {
    if (text.toLowerCase().includes("yes")) {
      appendMessage("Try to focus on your breath — take it slow, steady, and deep. Would you like me to guide you through a breathing exercise? (yes/no)", "bot");
      conversationState = "awaiting_breathing_confirmation";
    } else {
      appendMessage("That's okay. Remember, talking can help. Feel free to share whenever you want.", "bot");
      conversationState = null;
    }
  } else {
    const newState = await handleUserMessage(text);
    conversationState = newState || null;
  }
});

// Initialize with greeting
window.onload = () => {
  greetings.forEach((msg, i) => {
    setTimeout(() => appendMessage(msg, "bot"), i * 1500);
  });
};