/**
 * MCP Server interface matching Smithery API response
 */
export interface MCPServer {
	// Identity
	name: string;
	displayName: string;
	description: string;

	// Author info
	author: string;

	// Links
	repository: string;
	homepage: string;
	icon?: string;

	// Classification
	category: string;
	tags: string[];

	// Version info
	version: string;
	lastUpdated: string;

	// Runtime
	runtime: 'npx' | 'docker' | 'binary';
	command: string;

	// Configuration
	configSchema?: {
		type: 'object';
		properties: Record<string, {
			type: string;
			description: string;
			secret?: boolean;
			default?: any;
		}>;
		required?: string[];
	};

	// Metrics
	downloads?: number;
	stars?: number;
}
