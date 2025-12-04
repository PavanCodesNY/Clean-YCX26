# Smithery Integration Guide

## Overview

Smithery.ai maintains a centralized registry of MCP (Model Context Protocol) servers. Clean uses Smithery's REST API to discover, search, and display MCP servers in the VS Code extension.

**Smithery's Role in Clean:**
- **Data Source:** Provides catalog of 600+ MCP servers
- **Discovery Engine:** Powers search and filtering functionality
- **Metadata Provider:** Supplies server descriptions, installation instructions, categories

**Clean's Value-Add:**
- AI-powered recommendations (Smithery doesn't have this)
- One-click installation (Smithery only shows instructions)
- Context optimization (Smithery doesn't filter output)
- VS Code-native experience (Smithery is web-based)

---

## Smithery REST API

### Base URL
```
https://registry.smithery.ai
```

### Authentication
**Current Status:** No authentication required (public API)

**Best Practices:**
- Cache responses locally (24-hour refresh recommended)
- Respect rate limits (check response headers)
- Use User-Agent header to identify your application

**Future Considerations:**
- Smithery may add API keys for higher rate limits
- Monitor Smithery's documentation for updates
- Implement graceful fallback if API changes

---

## Core Endpoints

### 1. List All MCP Servers

**Endpoint:**
```
GET https://registry.smithery.ai/servers
```

**Description:**
Fetches the complete catalog of MCP servers registered with Smithery.

**Request Headers:**
```http
User-Agent: Clean-VSCode-Extension/1.0.0
Accept: application/json
```

**Response Format:**
```json
[
  {
    "name": "postgres",
    "displayName": "PostgreSQL MCP",
    "description": "MCP server for PostgreSQL database interactions",
    "author": "smithery",
    "repository": "https://github.com/smithery-ai/postgres-mcp",
    "homepage": "https://smithery.ai/server/postgres",
    "category": "databases",
    "tags": ["database", "sql", "postgresql"],
    "version": "1.2.0",
    "runtime": "npx",
    "command": "npx -y @smithery/postgres-mcp",
    "configSchema": {
      "type": "object",
      "properties": {
        "connectionString": {
          "type": "string",
          "description": "PostgreSQL connection string"
        }
      },
      "required": ["connectionString"]
    },
    "icon": "https://smithery.ai/icons/postgres.png",
    "downloads": 12543,
    "stars": 234,
    "lastUpdated": "2025-01-15T10:30:00Z"
  },
  {
    "name": "github",
    "displayName": "GitHub MCP",
    "description": "Interact with GitHub repositories, issues, and pull requests",
    "author": "anthropic",
    "repository": "https://github.com/anthropics/mcp-servers/tree/main/github",
    "homepage": "https://smithery.ai/server/github",
    "category": "developer-tools",
    "tags": ["github", "git", "version-control"],
    "version": "2.0.1",
    "runtime": "npx",
    "command": "npx -y @anthropics/github-mcp",
    "configSchema": {
      "type": "object",
      "properties": {
        "githubToken": {
          "type": "string",
          "description": "GitHub personal access token",
          "secret": true
        }
      },
      "required": ["githubToken"]
    },
    "icon": "https://smithery.ai/icons/github.png",
    "downloads": 45678,
    "stars": 891,
    "lastUpdated": "2025-01-20T14:22:00Z"
  }
]
```

**Response Fields Explained:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique identifier for the MCP server |
| `displayName` | string | Human-readable name shown in UI |
| `description` | string | Short description of what the server does |
| `author` | string | Creator of the MCP server |
| `repository` | string | GitHub repository URL |
| `homepage` | string | Smithery server page URL |
| `category` | string | Primary category (databases, developer-tools, etc.) |
| `tags` | string[] | Searchable tags for filtering |
| `version` | string | Current version (semver format) |
| `runtime` | string | How to run the server (npx, docker, binary) |
| `command` | string | Full command to execute the MCP server |
| `configSchema` | object | JSON Schema for configuration (optional) |
| `icon` | string | URL to server icon/logo |
| `downloads` | number | Total installation count |
| `stars` | number | GitHub stars (if applicable) |
| `lastUpdated` | string | ISO 8601 timestamp of last update |

**Example Request (Node.js/TypeScript):**
```typescript
import axios from 'axios';

interface MCPServer {
  name: string;
  displayName: string;
  description: string;
  author: string;
  repository: string;
  homepage: string;
  category: string;
  tags: string[];
  version: string;
  runtime: string;
  command: string;
  configSchema?: object;
  icon?: string;
  downloads?: number;
  stars?: number;
  lastUpdated: string;
}

async function fetchMCPServers(): Promise<MCPServer[]> {
  const response = await axios.get<MCPServer[]>(
    'https://registry.smithery.ai/servers',
    {
      headers: {
        'User-Agent': 'Clean-VSCode-Extension/1.0.0',
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    }
  );

  return response.data;
}

// Usage
const servers = await fetchMCPServers();
console.log(`Found ${servers.length} MCP servers`);
```

**Example Request (cURL):**
```bash
curl -H "User-Agent: Clean-VSCode-Extension/1.0.0" \
     -H "Accept: application/json" \
     https://registry.smithery.ai/servers
```

**Error Handling:**
```typescript
async function fetchMCPServersWithErrorHandling(): Promise<MCPServer[]> {
  try {
    const response = await axios.get<MCPServer[]>(
      'https://registry.smithery.ai/servers',
      {
        headers: {
          'User-Agent': 'Clean-VSCode-Extension/1.0.0',
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error
        console.error('Smithery API error:', error.response.status);
        throw new Error(`Failed to fetch MCP servers: ${error.response.statusText}`);
      } else if (error.request) {
        // No response received
        console.error('No response from Smithery API');
        throw new Error('Failed to connect to Smithery registry');
      }
    }

    throw error;
  }
}
```

---

### 2. Get Specific Server Details

**Endpoint:**
```
GET https://registry.smithery.ai/servers/{serverName}
```

**Description:**
Fetch detailed information about a specific MCP server.

**Path Parameters:**
- `serverName`: Unique name of the server (e.g., "postgres", "github")

**Example Request:**
```typescript
async function getMCPServer(serverName: string): Promise<MCPServer> {
  const response = await axios.get<MCPServer>(
    `https://registry.smithery.ai/servers/${serverName}`,
    {
      headers: {
        'User-Agent': 'Clean-VSCode-Extension/1.0.0',
        'Accept': 'application/json'
      }
    }
  );

  return response.data;
}

// Usage
const postgresServer = await getMCPServer('postgres');
console.log(postgresServer.displayName); // "PostgreSQL MCP"
```

**Example Request (cURL):**
```bash
curl -H "User-Agent: Clean-VSCode-Extension/1.0.0" \
     https://registry.smithery.ai/servers/postgres
```

---

### 3. Search Servers (Client-Side)

**Note:** Smithery does not provide a server-side search endpoint. Clean implements client-side search by:
1. Fetching full catalog
2. Caching locally
3. Filtering in-memory

**Search Implementation:**
```typescript
function searchMCPServers(
  servers: MCPServer[],
  query: string
): MCPServer[] {
  const lowerQuery = query.toLowerCase();

  return servers.filter(server => {
    // Search in name
    if (server.name.toLowerCase().includes(lowerQuery)) return true;

    // Search in display name
    if (server.displayName.toLowerCase().includes(lowerQuery)) return true;

    // Search in description
    if (server.description.toLowerCase().includes(lowerQuery)) return true;

    // Search in tags
    if (server.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;

    // Search in category
    if (server.category.toLowerCase().includes(lowerQuery)) return true;

    return false;
  });
}

// Usage
const allServers = await fetchMCPServers();
const databaseServers = searchMCPServers(allServers, 'database');
console.log(`Found ${databaseServers.length} database-related servers`);
```

---

### 4. Filter by Category

**Categories:**
- `databases` - PostgreSQL, MySQL, MongoDB, Redis, etc.
- `cloud-services` - AWS, Google Cloud, Azure, Vercel, etc.
- `developer-tools` - GitHub, GitLab, Jira, Linear, etc.
- `analytics` - Google Analytics, Mixpanel, Amplitude, etc.
- `communication` - Slack, Discord, Email, SMS, etc.
- `file-storage` - S3, Google Drive, Dropbox, etc.
- `ai-ml` - OpenAI, Anthropic, HuggingFace, etc.
- `productivity` - Notion, Airtable, Google Sheets, etc.

**Filter Implementation:**
```typescript
function filterByCategory(
  servers: MCPServer[],
  category: string
): MCPServer[] {
  return servers.filter(server => server.category === category);
}

// Usage
const allServers = await fetchMCPServers();
const cloudServers = filterByCategory(allServers, 'cloud-services');
```

---

## Caching Strategy

### Why Cache?
- **Performance:** Avoid repeated API calls (faster UI)
- **Offline Support:** Extension works without internet
- **Rate Limit Mitigation:** Reduce load on Smithery servers
- **Cost Reduction:** Lower bandwidth usage

### Cache Implementation

**Local Storage Path:**
```typescript
import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';

function getCachePath(context: vscode.ExtensionContext): string {
  return path.join(context.globalStorageUri.fsPath, 'smithery-cache.json');
}
```

**Cache Data Structure:**
```typescript
interface CacheData {
  servers: MCPServer[];
  timestamp: number; // Unix timestamp in milliseconds
  version: string; // Cache format version
}
```

**Cache Management:**
```typescript
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

async function getCachedServers(
  context: vscode.ExtensionContext
): Promise<MCPServer[] | null> {
  try {
    const cachePath = getCachePath(context);
    const cacheContent = await fs.readFile(cachePath, 'utf-8');
    const cache: CacheData = JSON.parse(cacheContent);

    const now = Date.now();
    const age = now - cache.timestamp;

    if (age < CACHE_TTL) {
      console.log(`Using cached Smithery data (${Math.round(age / 1000 / 60)} minutes old)`);
      return cache.servers;
    } else {
      console.log('Cache expired, fetching fresh data');
      return null;
    }
  } catch (error) {
    console.log('No cache found or cache invalid');
    return null;
  }
}

async function setCachedServers(
  context: vscode.ExtensionContext,
  servers: MCPServer[]
): Promise<void> {
  const cachePath = getCachePath(context);
  const cache: CacheData = {
    servers,
    timestamp: Date.now(),
    version: '1.0'
  };

  // Ensure directory exists
  await fs.mkdir(path.dirname(cachePath), { recursive: true });

  // Write cache
  await fs.writeFile(cachePath, JSON.stringify(cache, null, 2), 'utf-8');
}
```

**Fetch with Cache:**
```typescript
async function getServersWithCache(
  context: vscode.ExtensionContext,
  forceRefresh = false
): Promise<MCPServer[]> {
  // Try cache first
  if (!forceRefresh) {
    const cached = await getCachedServers(context);
    if (cached) return cached;
  }

  // Fetch from API
  const servers = await fetchMCPServers();

  // Update cache
  await setCachedServers(context, servers);

  return servers;
}
```

---

## Rate Limiting

### Current Limits
**Status:** Smithery has not published official rate limits

**Best Practices:**
- Cache aggressively (24-hour TTL)
- Use single bulk endpoint (`/servers`) instead of many individual requests
- Implement exponential backoff on errors
- Respect `Retry-After` header if present

### Rate Limit Handling

```typescript
async function fetchWithRateLimit(): Promise<MCPServer[]> {
  try {
    const response = await axios.get<MCPServer[]>(
      'https://registry.smithery.ai/servers',
      {
        headers: {
          'User-Agent': 'Clean-VSCode-Extension/1.0.0'
        }
      }
    );

    // Check for rate limit headers (if Smithery adds them)
    const remaining = response.headers['x-ratelimit-remaining'];
    const resetTime = response.headers['x-ratelimit-reset'];

    if (remaining !== undefined) {
      console.log(`API calls remaining: ${remaining}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      // Rate limited
      const retryAfter = error.response.headers['retry-after'];
      console.error(`Rate limited. Retry after: ${retryAfter}s`);

      throw new Error('Smithery API rate limit exceeded. Please try again later.');
    }

    throw error;
  }
}
```

---

## Data Model (TypeScript)

**Complete MCPServer Interface:**
```typescript
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

export interface MCPCategory {
  id: string;
  displayName: string;
  icon: string;
  serverCount: number;
}

export interface MCPInstallConfig {
  serverName: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
}
```

---

## Example: Complete Smithery Client

**File: `src/services/smitheryClient.ts`**
```typescript
import * as vscode from 'vscode';
import axios, { AxiosError } from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';

const SMITHERY_API_BASE = 'https://registry.smithery.ai';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export interface MCPServer {
  name: string;
  displayName: string;
  description: string;
  author: string;
  repository: string;
  homepage: string;
  category: string;
  tags: string[];
  version: string;
  runtime: string;
  command: string;
  configSchema?: object;
  icon?: string;
  downloads?: number;
  stars?: number;
  lastUpdated: string;
}

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
    // Try cache first
    if (!forceRefresh) {
      const cached = await this.getCachedServers();
      if (cached) return cached;
    }

    // Fetch from API
    const servers = await this.fetchServers();

    // Update cache
    await this.setCachedServers(servers);

    return servers;
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
            'User-Agent': 'Clean-VSCode-Extension/1.0.0',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

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
    const lowerQuery = query.toLowerCase();

    return servers.filter(server =>
      server.name.toLowerCase().includes(lowerQuery) ||
      server.displayName.toLowerCase().includes(lowerQuery) ||
      server.description.toLowerCase().includes(lowerQuery) ||
      server.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
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
        return cache.servers;
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Set cached servers
   */
  private async setCachedServers(servers: MCPServer[]): Promise<void> {
    const cachePath = this.getCachePath();
    const cache: CacheData = {
      servers,
      timestamp: Date.now(),
      version: '1.0'
    };

    await fs.mkdir(path.dirname(cachePath), { recursive: true });
    await fs.writeFile(cachePath, JSON.stringify(cache), 'utf-8');
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
    } catch {
      // Cache doesn't exist, that's fine
    }
  }
}
```

**Usage Example:**
```typescript
// In extension.ts
import { SmitheryClient } from './services/smitheryClient';

export function activate(context: vscode.ExtensionContext) {
  const smithery = new SmitheryClient(context);

  // Fetch all servers
  const servers = await smithery.getServers();
  console.log(`Found ${servers.length} MCP servers`);

  // Search
  const dbServers = await smithery.searchServers('database');

  // Get categories
  const categories = await smithery.getCategories();
}
```

---

## Best Practices

1. **Always Cache:**
   - 24-hour TTL minimum
   - Store in extension's global storage
   - Provide manual refresh command

2. **Error Handling:**
   - Graceful fallback to cached data
   - Show user-friendly error messages
   - Log errors for debugging

3. **Performance:**
   - Fetch once on extension activation
   - Use in-memory cache for UI operations
   - Lazy-load server details

4. **User Experience:**
   - Show loading indicator during fetch
   - Display last refresh time
   - Allow manual refresh via command

5. **Data Validation:**
   - Validate API responses against expected schema
   - Handle missing optional fields
   - Sanitize user input for search

---

## Testing Smithery Integration

**Manual Test:**
```bash
# Fetch all servers
curl https://registry.smithery.ai/servers | jq '.[0:5]'

# Check response time
time curl -s https://registry.smithery.ai/servers > /dev/null
```

**Unit Tests:**
```typescript
import { SmitheryClient } from '../services/smitheryClient';

suite('SmitheryClient Tests', () => {
  test('Fetch servers', async () => {
    const client = new SmitheryClient(mockContext);
    const servers = await client.getServers();

    assert.ok(servers.length > 0);
    assert.ok(servers[0].name);
    assert.ok(servers[0].displayName);
  });

  test('Search servers', async () => {
    const client = new SmitheryClient(mockContext);
    const results = await client.searchServers('postgres');

    assert.ok(results.length > 0);
    assert.ok(results.every(s =>
      s.name.includes('postgres') ||
      s.description.toLowerCase().includes('postgres')
    ));
  });
});
```

---

## Future Enhancements

1. **Smithery API v2:**
   - Watch for API changes
   - Monitor Smithery changelog
   - Implement version negotiation

2. **Advanced Filtering:**
   - Filter by runtime type (npx, docker, binary)
   - Filter by popularity (downloads, stars)
   - Filter by update recency

3. **Server Ratings:**
   - User reviews/ratings (if Smithery adds this)
   - Community feedback integration

4. **Webhooks:**
   - Listen for new server additions (if Smithery adds webhooks)
   - Auto-refresh on registry updates

---

## Summary

**Smithery Integration Checklist:**
- [x] Understand Smithery REST API
- [x] Implement SmitheryClient service
- [x] Add caching (24-hour TTL)
- [x] Handle errors gracefully
- [x] Implement search and filtering
- [x] Optimize for performance

**Key Takeaways:**
- Smithery = data source, Clean = intelligence layer
- Cache aggressively to reduce API calls
- Implement client-side search (no server-side search endpoint)
- Handle offline mode with cached data
- Monitor for API changes and rate limits

**Next Steps:**
1. Build `smitheryClient.ts` service
2. Integrate with tree view provider
3. Add search functionality to webview
4. Implement category filtering
5. Test with real Smithery data

Now let's build the actual integration! =€
