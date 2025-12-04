import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as jsonc from 'jsonc-parser';
import * as os from 'os';

/**
 * Supported AI tool types
 */
export type AITool = 'claude-code' | 'cursor' | 'vscode';

/**
 * Config file location info
 */
export interface ConfigLocation {
	tool: AITool;
	configPath: string;
	exists: boolean;
}

/**
 * MCP server configuration to add to config file
 */
export interface MCPConfig {
	command: string;
	args: string[];
	env?: Record<string, string>;
}

/**
 * Manages MCP configuration files safely
 * - Detects Claude Code (.mcp.json), Cursor, and VS Code configs
 * - Uses jsonc-parser to preserve comments and formatting
 * - Creates backups before modifications
 */
export class ConfigManager {
	constructor(private context: vscode.ExtensionContext) {}

	/**
	 * Detect which AI tool(s) are being used and their config locations
	 */
	async detectConfigLocations(): Promise<ConfigLocation[]> {
		const locations: ConfigLocation[] = [];

		// 1. Check for Claude Code (.mcp.json in workspace root)
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders && workspaceFolders.length > 0) {
			const claudeCodePath = path.join(
				workspaceFolders[0].uri.fsPath,
				'.mcp.json'
			);
			const claudeCodeExists = await this.fileExists(claudeCodePath);
			locations.push({
				tool: 'claude-code',
				configPath: claudeCodePath,
				exists: claudeCodeExists
			});
		}

		// 2. Check for Cursor (.cursor/mcp.json in workspace or home)
		if (workspaceFolders && workspaceFolders.length > 0) {
			const cursorPath = path.join(
				workspaceFolders[0].uri.fsPath,
				'.cursor',
				'mcp.json'
			);
			const cursorExists = await this.fileExists(cursorPath);
			locations.push({
				tool: 'cursor',
				configPath: cursorPath,
				exists: cursorExists
			});
		}

		// 3. Check for VS Code (mcp.json in user config directory)
		const vscodeConfigPath = this.getVSCodeConfigPath();
		const vscodeExists = await this.fileExists(vscodeConfigPath);
		locations.push({
			tool: 'vscode',
			configPath: vscodeConfigPath,
			exists: vscodeExists
		});

		return locations;
	}

	/**
	 * Get the primary config location (first existing, or Claude Code by default)
	 */
	async getPrimaryConfigLocation(): Promise<ConfigLocation> {
		const locations = await this.detectConfigLocations();

		// Return first existing config
		const existing = locations.find(loc => loc.exists);
		if (existing) {
			return existing;
		}

		// Default to Claude Code if no configs exist
		return locations.find(loc => loc.tool === 'claude-code') || locations[0];
	}

	/**
	 * Get VS Code config path (platform-specific)
	 */
	private getVSCodeConfigPath(): string {
		const homeDir = os.homedir();
		const platform = process.platform;

		if (platform === 'darwin') {
			// macOS
			return path.join(homeDir, 'Library', 'Application Support', 'Code', 'User', 'mcp.json');
		} else if (platform === 'win32') {
			// Windows
			return path.join(process.env.APPDATA || '', 'Code', 'User', 'mcp.json');
		} else {
			// Linux
			return path.join(homeDir, '.config', 'Code', 'User', 'mcp.json');
		}
	}

	/**
	 * Add MCP server to config file
	 */
	async addMCPServer(
		serverName: string,
		config: MCPConfig,
		configLocation?: ConfigLocation
	): Promise<void> {
		// Get config location
		const location = configLocation || await this.getPrimaryConfigLocation();

		console.log(`[Clean] Adding MCP server "${serverName}" to ${location.configPath}`);

		// Create config file if it doesn't exist
		if (!location.exists) {
			await this.createConfigFile(location.configPath);
		}

		// Read current config
		const content = await fs.readFile(location.configPath, 'utf-8');

		// Create backup
		await this.createBackup(location.configPath);

		// Modify config using jsonc-parser (preserves formatting and comments)
		const edits = jsonc.modify(
			content,
			['mcpServers', serverName],
			config,
			{
				formattingOptions: {
					tabSize: 2,
					insertSpaces: true,
					eol: '\n'
				}
			}
		);

		const newContent = jsonc.applyEdits(content, edits);

		// Write modified config
		await fs.writeFile(location.configPath, newContent, 'utf-8');

		console.log(`[Clean] Successfully added "${serverName}" to config`);
	}

	/**
	 * Remove MCP server from config file
	 */
	async removeMCPServer(
		serverName: string,
		configLocation?: ConfigLocation
	): Promise<void> {
		const location = configLocation || await this.getPrimaryConfigLocation();

		if (!location.exists) {
			throw new Error('Config file does not exist');
		}

		console.log(`[Clean] Removing MCP server "${serverName}" from ${location.configPath}`);

		// Read current config
		const content = await fs.readFile(location.configPath, 'utf-8');

		// Create backup
		await this.createBackup(location.configPath);

		// Remove using jsonc-parser
		const edits = jsonc.modify(
			content,
			['mcpServers', serverName],
			undefined, // undefined = remove
			{
				formattingOptions: {
					tabSize: 2,
					insertSpaces: true,
					eol: '\n'
				}
			}
		);

		const newContent = jsonc.applyEdits(content, edits);

		// Write modified config
		await fs.writeFile(location.configPath, newContent, 'utf-8');

		console.log(`[Clean] Successfully removed "${serverName}" from config`);
	}

	/**
	 * Check if MCP server exists in config
	 */
	async serverExists(
		serverName: string,
		configLocation?: ConfigLocation
	): Promise<boolean> {
		const location = configLocation || await this.getPrimaryConfigLocation();

		if (!location.exists) {
			return false;
		}

		try {
			const content = await fs.readFile(location.configPath, 'utf-8');
			const config = jsonc.parse(content);

			return config?.mcpServers?.[serverName] !== undefined;
		} catch {
			return false;
		}
	}

	/**
	 * Get all installed MCP servers from config
	 */
	async getInstalledServers(
		configLocation?: ConfigLocation
	): Promise<string[]> {
		const location = configLocation || await this.getPrimaryConfigLocation();

		if (!location.exists) {
			return [];
		}

		try {
			const content = await fs.readFile(location.configPath, 'utf-8');
			const config = jsonc.parse(content);

			return Object.keys(config?.mcpServers || {});
		} catch {
			return [];
		}
	}

	/**
	 * Create a new config file with default structure
	 */
	private async createConfigFile(configPath: string): Promise<void> {
		const defaultConfig = {
			mcpServers: {}
		};

		// Ensure directory exists
		await fs.mkdir(path.dirname(configPath), { recursive: true });

		// Write default config
		await fs.writeFile(
			configPath,
			JSON.stringify(defaultConfig, null, 2),
			'utf-8'
		);

		console.log(`[Clean] Created new config file at ${configPath}`);
	}

	/**
	 * Create backup of config file
	 */
	private async createBackup(configPath: string): Promise<void> {
		const backupPath = `${configPath}.backup`;

		try {
			await fs.copyFile(configPath, backupPath);
			console.log(`[Clean] Created backup at ${backupPath}`);
		} catch (error) {
			console.warn('[Clean] Failed to create backup:', error);
		}
	}

	/**
	 * Restore config from backup
	 */
	async restoreBackup(configPath: string): Promise<void> {
		const backupPath = `${configPath}.backup`;

		try {
			await fs.copyFile(backupPath, configPath);
			console.log(`[Clean] Restored config from backup`);
		} catch (error) {
			throw new Error(`Failed to restore backup: ${error}`);
		}
	}

	/**
	 * Check if file exists
	 */
	private async fileExists(filePath: string): Promise<boolean> {
		try {
			await fs.access(filePath);
			return true;
		} catch {
			return false;
		}
	}
}
