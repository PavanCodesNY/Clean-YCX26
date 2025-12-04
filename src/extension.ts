import * as vscode from 'vscode';
import { SmitheryClient } from './services/smitheryClient';
import { MCPTreeProvider } from './providers/mcpTreeProvider';
import { MCPInstaller } from './services/mcpInstaller';

export async function activate(context: vscode.ExtensionContext) {
	console.log('[Clean] Extension activating...');

	// Initialize services
	const smitheryClient = new SmitheryClient(context);
	const mcpInstaller = new MCPInstaller(context);

	// Create tree provider
	const treeProvider = new MCPTreeProvider(context, smitheryClient);

	// Register tree view
	const treeView = vscode.window.createTreeView('mcpServers', {
		treeDataProvider: treeProvider,
		showCollapseAll: true
	});

	context.subscriptions.push(treeView);

	// Initialize tree data (fetch MCP servers)
	await treeProvider.initialize();

	// Register commands
	registerCommands(context, smitheryClient, treeProvider, mcpInstaller);

	// Create status bar item
	const statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100
	);
	statusBarItem.text = "$(zap) Clean";
	statusBarItem.tooltip = "Clean MCP Manager";
	statusBarItem.command = 'clean.showStats';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	console.log('[Clean] Extension activated successfully!');
	vscode.window.showInformationMessage('Clean MCP Manager activated! 🧹');
}

function registerCommands(
	context: vscode.ExtensionContext,
	smitheryClient: SmitheryClient,
	treeProvider: MCPTreeProvider,
	mcpInstaller: MCPInstaller
) {
	// Refresh servers command
	context.subscriptions.push(
		vscode.commands.registerCommand('clean.refreshServers', async () => {
			try {
				await smitheryClient.clearCache();
				await treeProvider.initialize();
				vscode.window.showInformationMessage('MCP servers refreshed! 🔄');
			} catch (error) {
				vscode.window.showErrorMessage(
					`Failed to refresh: ${error instanceof Error ? error.message : String(error)}`
				);
			}
		})
	);

	// Browse MCPs command (opens webview - to be implemented)
	context.subscriptions.push(
		vscode.commands.registerCommand('clean.browseMCPs', async () => {
			vscode.window.showInformationMessage('MCP Browser (coming soon!)');
		})
	);

	// Install MCP command
	context.subscriptions.push(
		vscode.commands.registerCommand('clean.installMCP', async (server) => {
			if (!server || !server.server) {
				vscode.window.showErrorMessage('No server selected for installation');
				return;
			}

			try {
				const result = await mcpInstaller.installServer(server.server);

				if (result.success) {
					vscode.window.showInformationMessage(result.message);

					// Prompt to reload if needed
					if (result.requiresReload) {
						await mcpInstaller.promptReload(server.server.displayName);
					}

					// Refresh tree view to show installed server
					await treeProvider.initialize();
				} else {
					vscode.window.showErrorMessage(result.message);
				}
			} catch (error) {
				vscode.window.showErrorMessage(
					`Installation failed: ${error instanceof Error ? error.message : String(error)}`
				);
			}
		})
	);

	// Show server details command (to be implemented)
	context.subscriptions.push(
		vscode.commands.registerCommand('clean.showServerDetails', async (server) => {
			if (server) {
				vscode.window.showInformationMessage(
					`Server details for ${server.displayName} (coming soon!)`
				);
			}
		})
	);

	// Show stats command (to be implemented)
	context.subscriptions.push(
		vscode.commands.registerCommand('clean.showStats', async () => {
			const message = `Clean MCP Manager\n\nServers available: ${(await smitheryClient.getServers()).length}\n\nContext optimization coming soon!`;
			vscode.window.showInformationMessage(message);
		})
	);
}

export function deactivate() {
	console.log('[Clean] Extension deactivated');
}
