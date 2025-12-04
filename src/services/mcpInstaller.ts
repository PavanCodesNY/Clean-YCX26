import * as vscode from 'vscode';
import { MCPServer } from '../models/MCPServer';
import { ConfigManager, MCPConfig } from './configManager';

/**
 * Installation result
 */
export interface InstallResult {
	success: boolean;
	serverName: string;
	message: string;
	requiresReload: boolean;
}

/**
 * Handles MCP server installation
 * - Converts server info to MCP config format
 * - Adds to appropriate config file
 * - Handles errors and rollback
 */
export class MCPInstaller {
	private configManager: ConfigManager;

	constructor(private context: vscode.ExtensionContext) {
		this.configManager = new ConfigManager(context);
	}

	/**
	 * Install an MCP server
	 */
	async installServer(server: MCPServer): Promise<InstallResult> {
		try {
			console.log(`[Clean] Installing MCP server: ${server.displayName}`);

			// Check if already installed
			const alreadyInstalled = await this.configManager.serverExists(server.name);
			if (alreadyInstalled) {
				return {
					success: false,
					serverName: server.name,
					message: `${server.displayName} is already installed`,
					requiresReload: false
				};
			}

			// Convert server to MCP config format
			const mcpConfig = this.serverToConfig(server);

			// Get config location
			const configLocation = await this.configManager.getPrimaryConfigLocation();

			// Show confirmation dialog
			const confirmed = await this.confirmInstallation(server, configLocation.tool);
			if (!confirmed) {
				return {
					success: false,
					serverName: server.name,
					message: 'Installation cancelled by user',
					requiresReload: false
				};
			}

			// Add to config file
			await this.configManager.addMCPServer(server.name, mcpConfig, configLocation);

			// Track installation in extension state
			await this.trackInstallation(server.name);

			return {
				success: true,
				serverName: server.name,
				message: `Successfully installed ${server.displayName}`,
				requiresReload: true
			};
		} catch (error) {
			console.error('[Clean] Installation failed:', error);

			return {
				success: false,
				serverName: server.name,
				message: `Installation failed: ${error instanceof Error ? error.message : String(error)}`,
				requiresReload: false
			};
		}
	}

	/**
	 * Uninstall an MCP server
	 */
	async uninstallServer(serverName: string): Promise<InstallResult> {
		try {
			console.log(`[Clean] Uninstalling MCP server: ${serverName}`);

			// Check if installed
			const installed = await this.configManager.serverExists(serverName);
			if (!installed) {
				return {
					success: false,
					serverName,
					message: `${serverName} is not installed`,
					requiresReload: false
				};
			}

			// Show confirmation dialog
			const confirmed = await vscode.window.showWarningMessage(
				`Are you sure you want to uninstall "${serverName}"?`,
				{ modal: true },
				'Uninstall',
				'Cancel'
			);

			if (confirmed !== 'Uninstall') {
				return {
					success: false,
					serverName,
					message: 'Uninstall cancelled by user',
					requiresReload: false
				};
			}

			// Remove from config
			await this.configManager.removeMCPServer(serverName);

			// Remove from tracking
			await this.removeFromTracking(serverName);

			return {
				success: true,
				serverName,
				message: `Successfully uninstalled ${serverName}`,
				requiresReload: true
			};
		} catch (error) {
			console.error('[Clean] Uninstall failed:', error);

			return {
				success: false,
				serverName,
				message: `Uninstall failed: ${error instanceof Error ? error.message : String(error)}`,
				requiresReload: false
			};
		}
	}

	/**
	 * Get list of installed MCP servers
	 */
	async getInstalledServers(): Promise<string[]> {
		return this.configManager.getInstalledServers();
	}

	/**
	 * Check if server is installed
	 */
	async isInstalled(serverName: string): Promise<boolean> {
		return this.configManager.serverExists(serverName);
	}

	/**
	 * Convert MCPServer to MCP config format
	 */
	private serverToConfig(server: MCPServer): MCPConfig {
		const config: MCPConfig = {
			command: this.getCommand(server),
			args: this.getArgs(server)
		};

		// Add environment variables if needed
		if (server.configSchema) {
			config.env = this.extractEnvVars(server);
		}

		return config;
	}

	/**
	 * Get command based on runtime type
	 */
	private getCommand(server: MCPServer): string {
		switch (server.runtime) {
			case 'npx':
				return 'npx';
			case 'docker':
				return 'docker';
			case 'binary':
				return server.command;
			default:
				return 'npx'; // Default to npx
		}
	}

	/**
	 * Get args based on runtime type
	 */
	private getArgs(server: MCPServer): string[] {
		switch (server.runtime) {
			case 'npx':
				// npx -y @smithery/server-name
				return ['-y', `@smithery/${server.name}`];
			case 'docker':
				// docker run -i smithery/server-name
				return ['run', '-i', `smithery/${server.name}`];
			case 'binary':
				// Custom binary - use command as-is
				return [];
			default:
				return ['-y', `@smithery/${server.name}`];
		}
	}

	/**
	 * Extract environment variables from config schema
	 */
	private extractEnvVars(server: MCPServer): Record<string, string> | undefined {
		if (!server.configSchema?.properties) {
			return undefined;
		}

		// For now, return undefined - user will need to configure env vars manually
		// In future versions, we can prompt for required env vars
		return undefined;
	}

	/**
	 * Show confirmation dialog before installation
	 */
	private async confirmInstallation(server: MCPServer, aiTool: string): Promise<boolean> {
		const message = `Install ${server.displayName}?\n\n` +
			`This will add the MCP server to your ${aiTool} configuration.\n\n` +
			`Command: ${this.getCommand(server)} ${this.getArgs(server).join(' ')}`;

		const choice = await vscode.window.showInformationMessage(
			message,
			{ modal: true },
			'Install',
			'Cancel'
		);

		return choice === 'Install';
	}

	/**
	 * Track installation in extension state
	 */
	private async trackInstallation(serverName: string): Promise<void> {
		const installed = this.context.globalState.get<string[]>('installedServers', []);
		if (!installed.includes(serverName)) {
			installed.push(serverName);
			await this.context.globalState.update('installedServers', installed);
		}
	}

	/**
	 * Remove from tracking
	 */
	private async removeFromTracking(serverName: string): Promise<void> {
		const installed = this.context.globalState.get<string[]>('installedServers', []);
		const updated = installed.filter(name => name !== serverName);
		await this.context.globalState.update('installedServers', updated);
	}

	/**
	 * Prompt user to reload VS Code window
	 */
	async promptReload(serverName: string): Promise<void> {
		const choice = await vscode.window.showInformationMessage(
			`${serverName} installed successfully! Reload window to activate?`,
			'Reload Now',
			'Later'
		);

		if (choice === 'Reload Now') {
			await vscode.commands.executeCommand('workbench.action.reloadWindow');
		}
	}
}
