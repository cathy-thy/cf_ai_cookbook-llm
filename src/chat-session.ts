/**
 * Durable Object for managing chat sessions
 * 
 * This provides an alternative to KV storage with real-time state management,
 * WebSocket support, and better concurrency handling.
 * 
 * To use this instead of KV, modify the main worker to use CHAT_SESSION binding.
 */
import { ChatMessage, ConversationMemory } from "./types";

export class ChatSession implements DurableObject {
	private messages: ChatMessage[] = [];
	private metadata: ConversationMemory["metadata"] = {};
	private createdAt: string;
	private updatedAt: string;

	constructor(private state: DurableObjectState, private env: any) {
		this.createdAt = new Date().toISOString();
		this.updatedAt = this.createdAt;
	}

	/**
	 * Initialize the session by loading persisted state
	 */
	async initialize() {
		const stored = await this.state.storage.get<ConversationMemory>("memory");
		if (stored) {
			this.messages = stored.messages || [];
			this.metadata = stored.metadata || {};
			this.createdAt = stored.createdAt;
			this.updatedAt = stored.updatedAt;
		}
	}

	/**
	 * Save current state to durable storage
	 */
	async save() {
		this.updatedAt = new Date().toISOString();
		const memory: ConversationMemory = {
			sessionId: this.state.id.toString(),
			messages: this.messages,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			metadata: this.metadata,
		};
		await this.state.storage.put("memory", memory);
	}

	/**
	 * Handle HTTP requests to this Durable Object
	 */
	async fetch(request: Request): Promise<Response> {
		await this.initialize();

		const url = new URL(request.url);

		switch (url.pathname) {
			case "/messages":
				return this.handleMessages(request);
			case "/add":
				return this.handleAddMessage(request);
			case "/clear":
				return this.handleClear();
			case "/metadata":
				return this.handleMetadata(request);
			default:
				return new Response("Not found", { status: 404 });
		}
	}

	/**
	 * Get all messages
	 */
	async handleMessages(request: Request): Promise<Response> {
		return new Response(
			JSON.stringify({
				messages: this.messages,
				metadata: this.metadata,
				createdAt: this.createdAt,
				updatedAt: this.updatedAt,
			}),
			{
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	/**
	 * Add a new message
	 */
	async handleAddMessage(request: Request): Promise<Response> {
		const { message } = await request.json() as { message: ChatMessage };
		
		this.messages.push(message);
		await this.save();

		return new Response(
			JSON.stringify({ success: true, messageCount: this.messages.length }),
			{
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	/**
	 * Clear all messages
	 */
	async handleClear(): Promise<Response> {
		this.messages = [];
		await this.save();

		return new Response(JSON.stringify({ success: true }), {
			headers: { "Content-Type": "application/json" },
		});
	}

	/**
	 * Update metadata
	 */
	async handleMetadata(request: Request): Promise<Response> {
		if (request.method === "POST") {
			const { metadata } = await request.json() as { metadata: any };
			this.metadata = { ...this.metadata, ...metadata };
			await this.save();
		}

		return new Response(JSON.stringify({ metadata: this.metadata }), {
			headers: { "Content-Type": "application/json" },
		});
	}
}