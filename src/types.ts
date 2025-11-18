/**
 * Type definitions for the LLM chat application.
 */

export interface Env {
	/**
	 * Binding for the Workers AI API.
	 */
	AI: Ai;

	/**
	 * Binding for static assets.
	 */
	ASSETS: { fetch: (request: Request) => Promise<Response> };

	/**
	 * KV namespace for storing conversation history.
	 */
	COOKBOOK_CHAT_MEMORY: KVNamespace;

	/**
	 * Durable Object binding for chat sessions.
	 */
	CHAT_SESSION: DurableObjectNamespace;
}

/**
 * Represents a chat message.
 */
export interface ChatMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

/**
 * Represents a stored conversation in KV.
 */
export interface ConversationMemory {
	sessionId: string;
	messages: ChatMessage[];
	createdAt: string;
	updatedAt: string;
	metadata?: {
		userAgent?: string;
		ip?: string;
	};
}