import * as vscode from 'vscode';
import { MCPServer } from '../models/MCPServer';
import { SmitheryClient } from '../services/smitheryClient';

export class MCPTreeItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly server?: MCPServer,
		public readonly contextValue?: string
	) {
		super(label, collapsibleState);

		if (server) {
			// Safely handle description (edge case: undefined or empty)
			const desc = server.description || '';
			this.description = desc.length > 50 ? desc.substring(0, 50) + '...' : desc;
			this.tooltip = this.createTooltip(server);
			this.iconPath = this.getIconPath(server);
			this.contextValue = contextValue || 'mcpServer';

			// Make server clickable for installation
			this.command = {
				command: 'clean.installMCP',
				title: 'Install MCP Server',
				arguments: [this]
			};
		}
	}

	private createTooltip(server: MCPServer): vscode.MarkdownString {
		const tooltip = new vscode.MarkdownString();
		tooltip.appendMarkdown(`**${server.displayName}**\n\n`);
		tooltip.appendMarkdown(`${server.description}\n\n`);
		tooltip.appendMarkdown(`**Author:** ${server.author}\n\n`);
		tooltip.appendMarkdown(`**Version:** ${server.version}\n\n`);
		tooltip.appendMarkdown(`**Category:** ${server.category}\n\n`);
		if (server.downloads) {
			tooltip.appendMarkdown(`**Downloads:** ${server.downloads.toLocaleString()}\n\n`);
		}
		tooltip.appendMarkdown(`[Repository](${server.repository})`);
		tooltip.isTrusted = true;
		return tooltip;
	}

	private getIconPath(server: MCPServer): vscode.ThemeIcon {
		const iconMap: Record<string, string> = {
			'databases': 'database',
			'cloud-services': 'cloud',
			'developer-tools': 'tools',
			'analytics': 'graph',
			'communication': 'comment',
			'file-storage': 'file',
			'ai-ml': 'sparkle',
			'productivity': 'checklist'
		};

		const iconName = iconMap[server.category] || 'plug';
		return new vscode.ThemeIcon(iconName);
	}
}

export class MCPTreeProvider implements vscode.TreeDataProvider<MCPTreeItem> {
	private _onDidChangeTreeData = new vscode.EventEmitter<MCPTreeItem | undefined | null>();
	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	private servers: MCPServer[] = [];
	private loading = false;

	constructor(
		private context: vscode.ExtensionContext,
		private smitheryClient: SmitheryClient
	) {}

	/**
	 * Initialize tree view data
	 */
	async initialize(): Promise<void> {
		try {
			this.loading = true;
			this.refresh();

			// Fetch MCP servers from Smithery
			this.servers = await this.smitheryClient.getServers();

			console.log(`[Clean] Loaded ${this.servers.length} MCP servers`);

			this.loading = false;
			this.refresh();
		} catch (error) {
			console.error('[Clean] Failed to initialize tree view:', error);
			vscode.window.showErrorMessage(
				`Failed to load MCP servers: ${error instanceof Error ? error.message : String(error)}`
			);
			this.loading = false;
			this.refresh();
		}
	}

	/**
	 * Refresh tree view
	 */
	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	/**
	 * Get tree item (required by TreeDataProvider)
	 */
	getTreeItem(element: MCPTreeItem): vscode.TreeItem {
		return element;
	}

	/**
	 * Get children (required by TreeDataProvider)
	 */
	getChildren(element?: MCPTreeItem): MCPTreeItem[] {
		if (this.loading) {
			return [
				new MCPTreeItem(
					'Loading MCP servers...',
					vscode.TreeItemCollapsibleState.None
				)
			];
		}

		if (this.servers.length === 0) {
			return [
				new MCPTreeItem(
					'No servers found. Click refresh to try again.',
					vscode.TreeItemCollapsibleState.None
				)
			];
		}

		if (!element) {
			// Root level - return main categories
			return this.getRootItems();
		}

		// Category level - return servers in category
		return this.getCategoryItems(element);
	}

	/**
	 * Get root level items
	 */
	private getRootItems(): MCPTreeItem[] {
		const items: MCPTreeItem[] = [];

		// All servers by category
		const categories = this.getCategories();
		items.push(
			new MCPTreeItem(
				`📂 All Servers (${this.servers.length})`,
				vscode.TreeItemCollapsibleState.Collapsed,
				undefined,
				'allServersCategory'
			)
		);

		return items;
	}

	/**
	 * Get items for a category
	 */
	private getCategoryItems(element: MCPTreeItem): MCPTreeItem[] {
		if (element.contextValue === 'allServersCategory') {
			// Show categories
			const categories = this.getCategories();
			return categories.map(cat =>
				new MCPTreeItem(
					`${this.getCategoryIcon(cat.category)} ${cat.category} (${cat.count})`,
					vscode.TreeItemCollapsibleState.Collapsed,
					undefined,
					`category:${cat.category}`
				)
			);
		}

		// Show servers in specific category
		if (element.contextValue?.startsWith('category:')) {
			const category = element.contextValue.split(':')[1];
			const servers = this.servers.filter(s => s.category === category);
			return servers.map(server =>
				new MCPTreeItem(
					server.displayName,
					vscode.TreeItemCollapsibleState.None,
					server,
					'mcpServer'
				)
			);
		}

		return [];
	}

	/**
	 * Get categories with server counts
	 */
	private getCategories(): { category: string; count: number }[] {
		const categoryCounts = new Map<string, number>();

		for (const server of this.servers) {
			categoryCounts.set(server.category, (categoryCounts.get(server.category) || 0) + 1);
		}

		return Array.from(categoryCounts.entries())
			.map(([category, count]) => ({ category, count }))
			.sort((a, b) => b.count - a.count);
	}

	/**
	 * Get category icon
	 */
	private getCategoryIcon(category: string): string {
		const iconMap: Record<string, string> = {
			'databases': '💾',
			'cloud-services': '☁️',
			'developer-tools': '🔧',
			'analytics': '📊',
			'communication': '💬',
			'file-storage': '📁',
			'ai-ml': '🤖',
			'productivity': '✅'
		};
		return iconMap[category] || '📦';
	}
}
