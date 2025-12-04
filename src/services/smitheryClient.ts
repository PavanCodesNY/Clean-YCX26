import * as vscode from 'vscode';
import axios, { AxiosError } from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import { MCPServer } from '../models/MCPServer';

const SMITHERY_API_BASE = 'https://registry.smithery.ai';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CacheData {
	servers: MCPServer[];
	timestamp: number;
	version: string;
}

export class SmitheryClient {
	private context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	/**
	 * Get all MCP servers (with caching)
	 */
	async getServers(forceRefresh = false): Promise<MCPServer[]> {
		try {
			// Try cache first
			if (!forceRefresh) {
				const cached = await this.getCachedServers();
				if (cached) {
					console.log('[Clean] Using cached Smithery data');
					return cached;
				}
			}

			// Fetch from API
			console.log('[Clean] Fetching fresh data from Smithery API');
			const servers = await this.fetchServers();

			// Update cache
			await this.setCachedServers(servers);

			return servers;
		} catch (error) {
			console.error('[Clean] Error fetching servers:', error);

			// Try to return cached data as fallback
			const cached = await this.getCachedServers();
			if (cached) {
				vscode.window.showWarningMessage(
					'Could not fetch fresh data from Smithery. Using cached data.'
				);
				return cached;
			}

			throw error;
		}
	}

	/**
	 * Fetch servers from Smithery API
	 */
	private async fetchServers(): Promise<MCPServer[]> {
		try {
			const response = await axios.get<MCPServer[]>(
				`${SMITHERY_API_BASE}/servers`,
				{
					headers: {
						'User-Agent': 'Clean-VSCode-Extension/0.1.0',
						'Accept': 'application/json'
					},
					timeout: 10000
				}
			);

			console.log(`[Clean] Fetched ${response.data.length} MCP servers from Smithery`);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(`Failed to fetch MCP servers: ${error.message}`);
			}
			throw error;
		}
	}

	/**
	 * Get specific server by name
	 */
	async getServer(name: string): Promise<MCPServer | null> {
		const servers = await this.getServers();
		return servers.find(s => s.name === name) || null;
	}

	/**
	 * Search servers
	 */
	async searchServers(query: string): Promise<MCPServer[]> {
		const servers = await this.getServers();

		// Edge case: Empty query returns all servers
		if (!query || query.trim() === '') {
			return servers;
		}

		const lowerQuery = query.toLowerCase();

		return servers.filter(server => {
			// Edge case: Handle undefined/null fields safely
			const name = (server.name || '').toLowerCase();
			const displayName = (server.displayName || '').toLowerCase();
			const description = (server.description || '').toLowerCase();
			const category = (server.category || '').toLowerCase();
			const tags = server.tags || [];

			return (
				name.includes(lowerQuery) ||
				displayName.includes(lowerQuery) ||
				description.includes(lowerQuery) ||
				tags.some(tag => (tag || '').toLowerCase().includes(lowerQuery)) ||
				category.includes(lowerQuery)
			);
		});
	}

	/**
	 * Filter servers by category
	 */
	async getServersByCategory(category: string): Promise<MCPServer[]> {
		const servers = await this.getServers();
		return servers.filter(s => s.category === category);
	}

	/**
	 * Get all categories with server counts
	 */
	async getCategories(): Promise<{ category: string; count: number }[]> {
		const servers = await this.getServers();
		const categoryCounts = new Map<string, number>();

		for (const server of servers) {
			categoryCounts.set(server.category, (categoryCounts.get(server.category) || 0) + 1);
		}

		return Array.from(categoryCounts.entries())
			.map(([category, count]) => ({ category, count }))
			.sort((a, b) => b.count - a.count);
	}

	/**
	 * Get cached servers
	 */
	private async getCachedServers(): Promise<MCPServer[] | null> {
		try {
			const cachePath = this.getCachePath();
			const content = await fs.readFile(cachePath, 'utf-8');
			const cache: CacheData = JSON.parse(content);

			const age = Date.now() - cache.timestamp;
			if (age < CACHE_TTL) {
				const ageMinutes = Math.round(age / 1000 / 60);
				console.log(`[Clean] Cache is ${ageMinutes} minutes old`);
				return cache.servers;
			}

			console.log('[Clean] Cache expired');
			return null;
		} catch {
			console.log('[Clean] No cache found');
			return null;
		}
	}

	/**
	 * Set cached servers
	 */
	private async setCachedServers(servers: MCPServer[]): Promise<void> {
		try {
			const cachePath = this.getCachePath();
			const cache: CacheData = {
				servers,
				timestamp: Date.now(),
				version: '1.0'
			};

			// Ensure directory exists
			await fs.mkdir(path.dirname(cachePath), { recursive: true });

			// Write cache
			await fs.writeFile(cachePath, JSON.stringify(cache), 'utf-8');
			console.log('[Clean] Cache updated');
		} catch (error) {
			console.error('[Clean] Failed to update cache:', error);
		}
	}

	/**
	 * Get cache file path
	 */
	private getCachePath(): string {
		return path.join(this.context.globalStorageUri.fsPath, 'smithery-cache.json');
	}

	/**
	 * Clear cache (for testing or manual refresh)
	 */
	async clearCache(): Promise<void> {
		try {
			const cachePath = this.getCachePath();
			await fs.unlink(cachePath);
			console.log('[Clean] Cache cleared');
		} catch {
			// Cache doesn't exist, that's fine
		}
	}
}
