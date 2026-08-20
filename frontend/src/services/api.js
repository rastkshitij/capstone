/**
 * Sandbox API Service - Level 1 Architecture
 * Provides REST interactions for Sandbox Management and Agent APIs
 */

const MANAGEMENT_BASE_URL = import.meta.env.VITE_MANAGEMENT_API_URL || 'http://localhost';

/**
 * Gets the Agent Base URL for a given sandbox ID
 * Defaults to http://{sandboxId}.agent.localhost
 */
export const getAgentBaseUrl = (sandboxId) => {
  if (!sandboxId) return MANAGEMENT_BASE_URL;
  return `http://${sandboxId}.agent.localhost`;
};

/**
 * Gets the Preview URL for a given sandbox ID
 */
export const getPreviewUrl = (sandboxId) => {
  if (!sandboxId) return '';
  return `http://${sandboxId}.preview.localhost`;
};

/**
 * Checks management server health
 * Route: GET /api/sandbox/health
 * Description: Verifies that the Sandbox Management server is running and healthy
 * @returns {Promise<{status: string, message: string}>} Health status response
 */
export async function checkSandboxHealth() {
  try {
    const res = await fetch(`${MANAGEMENT_BASE_URL}/api/sandbox/health`);
    if (!res.ok) throw new Error(`Health check failed with status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Health check failed, fallback mode available:', err);
    return { status: 'offline', message: err.message };
  }
}

/**
 * Creates/Starts a new Sandbox
 * Route: POST /api/sandbox/start
 * Description: Initiates creation of a new sandbox environment with Kubernetes pods and services
 * Response includes unique sandboxId, preview URL, and status message
 * @returns {Promise<{sandboxId: string, previewUrl: string, message: string, isMock?: boolean}>}
 */
export async function startSandbox() {
  try {
    const res = await fetch(`${MANAGEMENT_BASE_URL}/api/sandbox/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to create sandbox: HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      sandboxId: data.sandboxId,
      previewUrl: data.previewUrl || getPreviewUrl(data.sandboxId),
      message: data.message || 'Sandbox created successfully',
    };
  } catch (err) {
    console.error('[API] Error starting sandbox:', err);
    // If backend is not currently running locally, generate a mock sandbox session so UI remains fully interactive!
    const mockId = 'sb-' + Math.random().toString(36).substring(2, 9);
    return {
      sandboxId: mockId,
      previewUrl: `http://${mockId}.preview.localhost`,
      message: `Local demo sandbox initialized (${mockId})`,
      isMock: true
    };
  }
}

/**
 * Lists all files in sandbox workspace
 * Route: GET /list-files
 * Description: Retrieves a list of all files available in the sandbox's workspace directory
 * @param {string} sandboxId - The unique identifier of the sandbox
 * @returns {Promise<string[]>} Array of file paths in the sandbox
 */
export async function listSandboxFiles(sandboxId) {
  const agentUrl = getAgentBaseUrl(sandboxId);
  try {
    const res = await fetch(`${agentUrl}/list-files`);
    if (!res.ok) throw new Error(`List files failed: HTTP ${res.status}`);
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.warn(`[API] Could not fetch remote file list for ${sandboxId}:`, err);
    return [];
  }
}

/**
 * Reads content of specified files
 * Route: GET /read-files
 * Description: Retrieves content of one or more files from the sandbox workspace
 * Query Parameter: files=src/App.jsx,package.json (comma-separated file paths)
 * @param {string} sandboxId - The unique identifier of the sandbox
 * @param {string[]} filePaths - Array of file paths to read
 * @returns {Promise<Object>} Map of file paths to their contents
 */
export async function readSandboxFiles(sandboxId, filePaths) {
  if (!filePaths || filePaths.length === 0) return {};
  const agentUrl = getAgentBaseUrl(sandboxId);
  const filesQuery = filePaths.join(',');

  try {
    const res = await fetch(`${agentUrl}/read-files?files=${encodeURIComponent(filesQuery)}`);
    if (!res.ok) throw new Error(`Read files failed: HTTP ${res.status}`);
    const data = await res.json();

    // Transform array of objects [{ "/src/App.jsx": "..." }] into map { "src/App.jsx": "..." }
    const fileMap = {};
    if (Array.isArray(data.files)) {
      data.files.forEach(item => {
        Object.entries(item).forEach(([path, content]) => {
          const cleanPath = path.startsWith('/') ? path.slice(1) : path;
          fileMap[cleanPath] = content;
        });
      });
    }
    return fileMap;
  } catch (err) {
    console.warn(`[API] Read files error:`, err);
    return {};
  }
}

/**
 * Updates content of existing files
 * Route: PATCH /update-files
 * Description: Modifies content of one or more existing files in the sandbox workspace
 * Request Body: { updates: [{ file: "path/to/file", content: "new content" }] }
 * @param {string} sandboxId - The unique identifier of the sandbox
 * @param {Array<{file: string, content: string}>} updates - Array of file updates
 * @returns {Promise<Object>} Response with update status
 */
export async function updateSandboxFiles(sandboxId, updates) {
  const agentUrl = getAgentBaseUrl(sandboxId);
  try {
    const res = await fetch(`${agentUrl}/update-files`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Update files failed: HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API] Update files error:`, err);
    return { status: 'mock_saved', updates };
  }
}

/**
 * Creates new files inside sandbox
 * Route: POST /create-files
 * Description: Creates one or more new files in the sandbox workspace with specified content
 * Request Body: { files: [{ file: "path/to/file", content: "file content" }] }
 * @param {string} sandboxId - The unique identifier of the sandbox
 * @param {Array<{file: string, content: string}>} files - Array of files to create
 * @returns {Promise<Object>} Response with creation status
 */
export async function createSandboxFiles(sandboxId, files) {
  const agentUrl = getAgentBaseUrl(sandboxId);
  try {
    const res = await fetch(`${agentUrl}/create-files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Create files failed: HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API] Create files error:`, err);
    return { status: 'mock_created', files };
  }
}
