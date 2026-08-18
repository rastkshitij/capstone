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
 * GET /api/sandbox/health
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
 * POST /api/sandbox/start
 * @returns {Promise<{sandboxId: string, previewUrl: string, message: string}>}
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
 * GET /list-files
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
 * GET /read-files?files=src/App.jsx,package.json
 * @param {string} sandboxId
 * @param {string[]} filePaths
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
 * PATCH /update-files
 * @param {string} sandboxId
 * @param {Array<{file: string, content: string}>} updates
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
 * POST /create-files
 * @param {string} sandboxId
 * @param {Array<{file: string, content: string}>} files
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
