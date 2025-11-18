/**
 * LLM Chat Application Template with Memory
 *
 * A chat application using Cloudflare Workers AI with conversation memory.
 * Uses KV storage to persist conversation history across sessions.
 *
 * @license MIT
 */
import { Env, ChatMessage, ConversationMemory } from "./types";

// Model ID for Workers AI model
// https://developers.cloudflare.com/workers-ai/models/
const MODEL_ID = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

// Default system prompt
const SYSTEM_PROMPT =
	"Your task is to help the user to prepare a meal according to the ingredients they have in the fridge. You may receive multiple messages from the user, each containing a list of ingredients. Based on the ingredients provided, suggest a recipe that can be made with those ingredients. If the user provides additional ingredients in subsequent messages, update your recipe suggestion accordingly. Always aim to create a delicious and feasible meal plan based on the available ingredients.";

// Memory settings
const MAX_MESSAGES_IN_MEMORY = 50; // Maximum number of messages to keep
const MEMORY_TTL = 60 * 60 * 24 * 7; // 7 days in seconds

export default {
	/**
	 * Main request handler for the Worker
	 */
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const url = new URL(request.url);

		// Enable CORS for API requests
		if (request.method === "OPTIONS") {
			return handleCORS();
		}

		// Handle static assets (frontend)
		if (url.pathname === "/" || !url.pathname.startsWith("/api/")) {
			return env.ASSETS.fetch(request);
		}

		// API Routes
		if (url.pathname === "/api/chat") {
			if (request.method === "POST") {
				return handleChatRequest(request, env);
			}
			return new Response("Method not allowed", { status: 405 });
		}

		if (url.pathname === "/api/memory") {
			if (request.method === "GET") {
				return handleGetMemory(request, env);
			}
			if (request.method === "DELETE") {
				return handleDeleteMemory(request, env);
			}
			return new Response("Method not allowed", { status: 405 });
		}

		// Handle 404 for unmatched routes
		return new Response("Not found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;

/**
 * Handle CORS preflight requests
 */
function handleCORS(): Response {
	return new Response(null, {
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, X-Session-ID",
		},
	});
}

/**
 * Add CORS headers to response
 */
function addCORSHeaders(response: Response): Response {
	const newResponse = new Response(response.body, response);
	newResponse.headers.set("Access-Control-Allow-Origin", "*");
	newResponse.headers.set(
		"Access-Control-Allow-Methods",
		"GET, POST, DELETE, OPTIONS",
	);
	newResponse.headers.set(
		"Access-Control-Allow-Headers",
		"Content-Type, X-Session-ID",
	);
	return newResponse;
}

/**
 * Generate a session ID
 */
function generateSessionId(): string {
	return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get or create conversation memory
 */
async function getConversationMemory(
	env: Env,
	sessionId: string,
): Promise<ConversationMemory | null> {
	const key = `conversation:${sessionId}`;
	const stored = await env.COOKBOOK_CHAT_MEMORY.get(key, "json");
	return stored as ConversationMemory | null;
}

/**
 * Save conversation memory
 */
async function saveConversationMemory(
	env: Env,
	sessionId: string,
	messages: ChatMessage[],
	metadata?: ConversationMemory["metadata"],
): Promise<void> {
	const key = `conversation:${sessionId}`;

	// Limit the number of messages stored
	const trimmedMessages =
		messages.length > MAX_MESSAGES_IN_MEMORY
			? messages.slice(-MAX_MESSAGES_IN_MEMORY)
			: messages;

	const memory: ConversationMemory = {
		sessionId,
		messages: trimmedMessages,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		metadata,
	};

	// Store with expiration
	await env.COOKBOOK_CHAT_MEMORY.put(key, JSON.stringify(memory), {
		expirationTtl: MEMORY_TTL,
	});
}

/**
 * Handles chat API requests with memory
 */
// async function handleChatRequest(
// 	request: Request,
// 	env: Env,
// ): Promise<Response> {
// 	try {
// 		// Get session ID from header or generate new one
// 		let sessionId = request.headers.get("X-Session-ID");
// 		const isNewSession = !sessionId;

// 		if (!sessionId) {
// 			sessionId = generateSessionId();
// 		}

// 		// Parse JSON request body
// 		const { messages = [] } = (await request.json()) as {
// 			messages: ChatMessage[];
// 		};

// 		// Load conversation memory
// 		let conversationMemory = await getConversationMemory(env, sessionId);
// 		let allMessages: ChatMessage[] = [];

// 		if (conversationMemory && !isNewSession) {
// 			// Use stored messages and append new ones
// 			allMessages = [...conversationMemory.messages];

// 			// Add new user message(s) that aren't already in history
// 			for (const msg of messages) {
// 				if (msg.role === "user" || msg.role === "assistant") {
// 					allMessages.push(msg);
// 				}
// 			}
// 		} else {
// 			// New session - use provided messages
// 			allMessages = [...messages];
// 		}

// 		// Add system prompt if not present
// 		if (!allMessages.some((msg) => msg.role === "system")) {
// 			allMessages.unshift({ role: "system", content: SYSTEM_PROMPT });
// 		}

// 		// Call AI model
// 		const aiResponse = await env.AI.run(
// 			MODEL_ID,
// 			{
// 				messages: allMessages,
// 				max_tokens: 1024,
// 			},
// 			{
// 				returnRawResponse: true,
// 			},
// 		);

// 		// Extract assistant response from stream
// 		const reader = aiResponse.body?.getReader();
// 		const decoder = new TextDecoder();
// 		let assistantMessage = "";

// 		if (reader) {
// 			while (true) {
// 				const { done, value } = await reader.read();
// 				if (done) break;

// 				const chunk = decoder.decode(value, { stream: false });
// 				const lines = chunk.split("\n");

// 				for (const line of lines) {
// 					if (line.startsWith("data: ")) {
// 						const data = line.slice(6);
// 						if (data === "[DONE]") continue;

// 						try {
// 							const parsed = JSON.parse(data);
// 							if (parsed.response) {
// 								assistantMessage += parsed.response;
// 							}
// 						} catch (e) {
// 							// Skip invalid JSON
// 						}
// 					}
// 				}
// 			}
// 		}

// 		// Add assistant response to messages
// 		if (assistantMessage) {
// 			allMessages.push({ role: "assistant", content: assistantMessage });
// 		}

// 		// Save updated conversation memory
// 		const metadata = {
// 			userAgent: request.headers.get("User-Agent") || undefined,
// 			ip: request.headers.get("CF-Connecting-IP") || undefined,
// 		};

// 		await saveConversationMemory(env, sessionId, allMessages, metadata);

// 		// Create new streaming response
// 		const stream = new ReadableStream({
// 			async start(controller) {
// 				// Send session ID first
// 				controller.enqueue(
// 					new TextEncoder().encode(
// 						`data: ${JSON.stringify({ type: "session", sessionId })}\n\n`,
// 					),
// 				);

// 				// Stream the assistant message
// 				const encoder = new TextEncoder();
// 				for (const char of assistantMessage) {
// 					controller.enqueue(
// 						encoder.encode(`data: ${JSON.stringify({ response: char })}\n\n`),
// 					);
// 					// Small delay to simulate streaming (remove in production)
// 					await new Promise((resolve) => setTimeout(resolve, 10));
// 				}

// 				controller.enqueue(encoder.encode("data: [DONE]\n\n"));
// 				controller.close();
// 			},
// 		});

// 		const response = new Response(stream, {
// 			headers: {
// 				"Content-Type": "text/event-stream",
// 				"Cache-Control": "no-cache",
// 				Connection: "keep-alive",
// 				"X-Session-ID": sessionId,
// 			},
// 		});

// 		return addCORSHeaders(response);
// 	} catch (error) {
// 		console.error("Error processing chat request:", error);
// 		return addCORSHeaders(
// 			new Response(JSON.stringify({ error: "Failed to process request" }), {
// 				status: 500,
// 				headers: { "content-type": "application/json" },
// 			}),
// 		);
// 	}
// }

async function handleChatRequest(request: Request, env: Env): Promise<Response> {
	try {
	  // Get session ID from header or generate new one
	  let sessionId = request.headers.get("X-Session-ID");
	  const isNewSession = !sessionId;
	  if (!sessionId) sessionId = generateSessionId();
  
	  // Parse body
	  const { messages = [] } = await request.json();
  
	  // Load memory
	  let conversationMemory = await getConversationMemory(env, sessionId);
	  let allMessages: ChatMessage[] = [];
  
	  if (conversationMemory && !isNewSession) {
		allMessages = [...conversationMemory.messages];
		for (const msg of messages) {
		  if (msg.role === "user" || msg.role === "assistant") {
			allMessages.push(msg);
		  }
		}
	  } else {
		allMessages = [...messages];
	  }
	  
  
	  // Add system prompt if missing
	  if (!allMessages.some(m => m.role === "system")) {
		allMessages.unshift({ role: "system", content: SYSTEM_PROMPT });
	  }
  
	  // Non-streaming AI call
	  const aiResponse = await env.AI.run(
		MODEL_ID,
		{ messages: allMessages, max_tokens: 1024 },
		{ returnRawResponse: false }
	  );
  
	  // Extract assistant content
	  const assistantMessage = aiResponse.response || aiResponse.result || "";
  
	  // Add to memory
	  allMessages.push({ role: "assistant", content: assistantMessage });
  
	  const metadata = {
		userAgent: request.headers.get("User-Agent") || undefined,
		ip: request.headers.get("CF-Connecting-IP") || undefined,
	  };
  
	  await saveConversationMemory(env, sessionId, allMessages, metadata);
  
	  // Return clean JSON
	  return addCORSHeaders(
		new Response(JSON.stringify({
		  response: assistantMessage,
		  sessionId
		}), {
		  headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-cache",
			"X-Session-ID": sessionId,
			"cf-sse": "off",
			"x-cloudflare-ai-session": "off"
		  }
		})
	  );
  
	} catch (error) {
	  console.error("Error processing chat request:", error);
	  return addCORSHeaders(
		new Response(JSON.stringify({ error: "Failed to process request" }), {
		  status: 500,
		  headers: { "content-type": "application/json" }
		})
	  );
	}
  }

/**
 * Get conversation memory for a session
 */
async function handleGetMemory(
	request: Request,
	env: Env,
): Promise<Response> {
	try {
		const sessionId = request.headers.get("X-Session-ID");

		if (!sessionId) {
			return addCORSHeaders(
				new Response(JSON.stringify({ error: "Session ID required" }), {
					status: 400,
					headers: { "content-type": "application/json" },
				}),
			);
		}

		const memory = await getConversationMemory(env, sessionId);

		return addCORSHeaders(
			new Response(JSON.stringify(memory || { messages: [] }), {
				headers: { "content-type": "application/json" },
			}),
		);
	} catch (error) {
		console.error("Error getting memory:", error);
		return addCORSHeaders(
			new Response(JSON.stringify({ error: "Failed to get memory" }), {
				status: 500,
				headers: { "content-type": "application/json" },
			}),
		);
	}
}

/**
 * Delete conversation memory for a session
 */
async function handleDeleteMemory(
	request: Request,
	env: Env,
): Promise<Response> {
	try {
		const sessionId = request.headers.get("X-Session-ID");

		if (!sessionId) {
			return addCORSHeaders(
				new Response(JSON.stringify({ error: "Session ID required" }), {
					status: 400,
					headers: { "content-type": "application/json" },
				}),
			);
		}

		const key = `conversation:${sessionId}`;
		await env.COOKBOOK_CHAT_MEMORY.delete(key);

		return addCORSHeaders(
			new Response(JSON.stringify({ success: true }), {
				headers: { "content-type": "application/json" },
			}),
		);
	} catch (error) {
		console.error("Error deleting memory:", error);
		return addCORSHeaders(
			new Response(JSON.stringify({ error: "Failed to delete memory" }), {
				status: 500,
				headers: { "content-type": "application/json" },
			}),
		);
	}
}