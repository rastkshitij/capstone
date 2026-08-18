# Sandbox API Reference

This document describes the sandbox management APIs used by the project. The system creates isolated sandbox environments for frontend applications and exposes them through dynamic subdomains.

## 1. High-level architecture

The sandbox platform is made of three major parts:

- Sandbox Management API: Creates a new sandbox instance and returns the access URLs.
- Router Service: Routes traffic based on subdomain (`agent.localhost` and `preview.localhost`).
- Agent Service: Runs inside each sandbox and provides file system and code-editing APIs.

Common access patterns:

- Management API: `http://localhost`
- Preview URL: `http://{sandboxId}.preview.localhost`
- Agent API: `http://{sandboxId}.agent.localhost`

---

## 2. Sandbox Management API

These endpoints are served by the sandbox server and are used to create or inspect sandbox environments.

### Base URL

`http://localhost`

### GET /api/sandbox/health

Checks whether the sandbox management server is alive.

#### Request

```http
GET /api/sandbox/health HTTP/1.1
Host: localhost
```

#### Success Response (200)

```json
{
  "status": "ok",
  "message": "Sandbox server is healthy and running"
}
```

#### Response fields

- `status`: Health status of the service.
- `message`: Human readable confirmation.

---

### POST /api/sandbox/start

Creates a new sandbox environment and provisions a pod and a service for it. On success, it returns a unique sandbox ID and a preview URL.

#### Request

```http
POST /api/sandbox/start HTTP/1.1
Host: localhost
Content-Type: application/json
```

No request body is required for this endpoint.

#### Success Response (200)

```json
{
  "message": "Sandbox with id 01a01567-54e1-74cc-a9d2-5e747e6f72eb has been created successfully",
  "sandboxId": "01a01567-54e1-74cc-a9d2-5e747e6f72eb",
  "previewUrl": "http://01a01567-54e1-74cc-a9d2-5e747e6f72eb.preview.localhost"
}
```

#### Response fields

- `message`: Success message describing the newly created sandbox.
- `sandboxId`: A unique identifier for the sandbox.
- `previewUrl`: Public preview URL for the app. Use this URL in an iframe or browser tab to view the project.

#### Failure Response (500)

```json
{
  "message": "Failed to create sandbox",
  "error": "<detailed error message>"
}
```

#### Example usage

```bash
curl -X POST http://localhost/api/sandbox/start
```

#### Notes

- the service internally creates a Kubernetes pod and service for the sandbox.
- the generated preview URL is based on the sandbox ID: `http://{sandboxId}.preview.localhost`.
- the sandbox is isolated and can be addressed separately using its agent subdomain.

---

## 3. Router Service API

The router handles subdomain-based traffic. It proxies requests to the correct sandbox instance.

### Base URL

`http://{sandboxId}.agent.localhost` and `http://{sandboxId}.preview.localhost`

### GET /api/status/healthz

Returns the health status of the router.

#### Example

```http
GET /api/status/healthz HTTP/1.1
Host: localhost
```

#### Success Response (200)

```json
{
  "status": "ok",
  "message": "Sandbox router is healthy and running"
}
```

### GET /api/status/readyz

Returns readiness status.

#### Success Response (200)

```json
{
  "status": "ready",
  "message": "Sandbox router is healthy and running"
}
```

#### How routing works

The router checks the incoming host header:

- if host matches `{sandboxId}.agent.localhost`, it proxies to the sandbox agent service.
- if host matches `{sandboxId}.preview.localhost`, it proxies to the preview service.

This allows a single routing layer to forward requests to the appropriate sandbox without exposing internal service names.

---

## 4. Agent API inside each sandbox

These endpoints are served by the sandbox agent container. They are called through the subdomain route:

`http://{sandboxId}.agent.localhost`

### GET /

Simple health or container confirmation endpoint.

#### Example

```http
GET / HTTP/1.1
Host: 01a01567-54e1-74cc-a9d2-5e747e6f72eb.agent.localhost
```

#### Success Response (200)

```json
{
  "message": "Hello from sandbox agent",
  "status": "success"
}
```

---

### GET /list-files

Lists all files in the sandbox workspace, excluding common large folders such as `node_modules`, `.git`, `dist`, `.next`, and `build`.

#### Request

```http
GET /list-files HTTP/1.1
Host: 01a01567-54e1-74cc-a9d2-5e747e6f72eb.agent.localhost
```

#### Success Response (200)

```json
{
  "message": "files listed successfully",
  "files": [
    ".dockerignore",
    ".gitignore",
    ".oxlintrc.json",
    "README.md",
    "dockerfile",
    "index.html",
    "package-lock.json",
    "package.json",
    "public/favicon.svg",
    "public/icons.svg",
    "src/App.css",
    "src/App.jsx",
    "src/assets/hero.png",
    "src/assets/react.svg",
    "src/assets/vite.svg",
    "src/index.css",
    "src/main.jsx",
    "vite.config.js"
  ]
}
```

#### Response fields

- `message`: Describes the action status.
- `files`: A flat list of relative file paths inside the workspace.

---

### GET /read-files

Reads the content of one or more files from the sandbox workspace.

#### Request

```http
GET /read-files?files=src/App.jsx HTTP/1.1
Host: 01a01567-54e1-74cc-a9d2-5e747e6f72eb.agent.localhost
```

You can also request multiple files using a comma-separated value:

```http
GET /read-files?files=src/App.jsx,src/main.jsx,package.json
```

#### Success Response (200)

```json
{
  "message": "file content",
  "files": [
    {
      "/src/App.jsx": "import { useState } from 'react'\nimport reactLogo from './assets/react.svg'\nimport viteLogo from './assets/vite.svg'\nimport heroImg from './assets/hero.png'\nimport './App.css'\n\nfunction App() {\n  const [count, setCount] = useState(0)\n\n  return (\n    <>\n      <section id=\"center\">\n        <div className=\"hero\">\n          <img src={heroImg} className=\"base\" width=\"170\" height=\"179\" alt=\"\" />\n          <img src={reactLogo} className=\"framework\" alt=\"React logo\" />\n          <img src={viteLogo} className=\"vite\" alt=\"Vite logo\" />\n        </div>\n        <div>\n          <h1>Get started</h1>\n          <p>\n            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>\n          </p>\n        </div>\n        <button\n          type=\"button\"\n          className=\"counter\"\n          onClick={() => setCount((count) => count + 1)}\n        >\n          Count is {count}\n        </button>\n      </section>\n\n      <div className=\"ticks\"></div>\n\n      <section id=\"next-steps\">\n        <div id=\"docs\">\n          <svg className=\"icon\" role=\"presentation\" aria-hidden=\"true\">\n            <use href=\"/icons.svg#documentation-icon\"></use>\n          </svg>\n          <h2>Documentation</h2>\n          <p>Your questions, answered</p>\n          <ul>\n            <li>\n              <a href=\"https://vite.dev/\" target=\"_blank\">\n                <img className=\"logo\" src={viteLogo} alt=\"\" />\n                Explore Vite\n              </a>\n            </li>\n            <li>\n              <a href=\"https://react.dev/\" target=\"_blank\">\n                <img className=\"button-icon\" src={reactLogo} alt=\"\" />\n                Learn more\n              </a>\n            </li>\n          </ul>\n        </div>\n        <div id=\"social\">\n          <svg className=\"icon\" role=\"presentation\" aria-hidden=\"true\">\n            <use href=\"/icons.svg#social-icon\"></use>\n          </svg>\n          <h2>Connect with us</h2>\n          <p>Join the Vite community</p>\n          <ul>\n            <li>\n              <a href=\"https://github.com/vitejs/vite\" target=\"_blank\">\n                <svg\n                  className=\"button-icon\"\n                  role=\"presentation\"\n                  aria-hidden=\"true\"\n                >\n                  <use href=\"/icons.svg#github-icon\"></use>\n                </svg>\n                GitHub\n              </a>\n            </li>\n            <li>\n              <a href=\"https://chat.vite.dev/\" target=\"_blank\">\n                <svg\n                  className=\"button-icon\"\n                  role=\"presentation\"\n                  aria-hidden=\"true\"\n                >\n                  <use href=\"/icons.svg#discord-icon\"></use>\n                </svg>\n                Discord\n              </a>\n            </li>\n            <li>\n              <a href=\"https://x.com/vite_js\" target=\"_blank\">\n                <svg\n                  className=\"button-icon\"\n                  role=\"presentation\"\n                  aria-hidden=\"true\"\n                >\n                  <use href=\"/icons.svg#x-icon\"></use>\n                </svg>\n                X.com\n              </a>\n            </li>\n            <li>\n              <a href=\"https://bsky.app/profile/vite.dev\" target=\"_blank\">\n                <svg\n                  className=\"button-icon\"\n                  role=\"presentation\"\n                  aria-hidden=\"true\"\n                >\n                  <use href=\"/icons.svg#bluesky-icon\"></use>\n                </svg>\n                Bluesky\n              </a>\n            </li>\n          </ul>\n        </div>\n      </section>\n\n      <div className=\"ticks\"></div>\n      <section id=\"spacer\"></section>\n    </>\n  )\n}\n\nexport default App\n"
    }
  ]
}
```

#### Validation / error cases

- If no `files` query parameter is provided, it returns:

```json
{
  "message": "No files specified in query parameter",
  "status": "error"
}
```

- Returns HTTP 400 in that case.

#### Notes

- The endpoint accepts a comma-separated list of relative paths.
- It returns a JSON array containing an object per file.
- The key uses the full workspace-relative path, such as `/src/App.jsx`.

---

### PATCH /update-files

Updates the content of one or more files inside the sandbox workspace.

#### Request example

```http
PATCH /update-files HTTP/1.1
Host: 01a01567-54e1-74cc-a9d2-5e747e6f72eb.agent.localhost
Content-Type: application/json
```

```json
{
  "updates": [
    {
      "file": "src/App.jsx",
      "content": "import React from 'react';\n\nexport default function App() {\n  return <h1>Hello from patched sandbox</h1>;\n}"
    }
  ]
}
```

#### Success Response (200)

```json
{
  "message": "Files updated results",
  "results": [
    {
      "/workspace/src/App.jsx": "file updated successfully"
    }
  ],
  "status": "success"
}
```

#### Error Response (400)

```json
{
  "message": "Invalid request body.Expected a json object with an \"updates\" property containg an array of file updates.",
  "status": "error"
}
```

#### Notes

- The endpoint writes each file into the `/workspace` directory.
- Parent folders are created automatically as needed.
- The API supports batched updates using an array of objects.

---

### POST /create-files

Creates new files inside the sandbox project.

#### Request example

```http
POST /create-files HTTP/1.1
Host: 01a01567-54e1-74cc-a9d2-5e747e6f72eb.agent.localhost
Content-Type: application/json
```

```json
{
  "files": [
    {
      "file": "src/components/Example.jsx",
      "content": "export default function Example() {\n  return <div>Hello</div>;\n}\n"
    }
  ]
}
```

#### Success Response (200)

```json
{
  "message": "Files created successfully",
  "results": [
    {
      "file": "src/components/Example.jsx",
      "status": "success",
      "message": "File created successfully"
    }
  ]
}
```

#### Error Response (400)

```json
{
  "message": "Invalid request body. Expected a \"files\" array.",
  "status": "error"
}
```

#### Notes

- Parent directories are created recursively.
- Every file in the request is processed in parallel.
- The created files are stored under the sandbox workspace, which is typically `/workspace`.

---

## 5. Terminal / real-time interaction

The sandbox agent also exposes a Socket.IO terminal for interactive command execution. This is useful for running shell commands inside the workspace.

### Socket.IO setup

The agent uses Socket.IO to stream terminal output and capture input.

#### Events

- `terminal-input`: Send command input to the shell.
- `terminal-output`: Receive output from the shell.

#### Example usage

```javascript
const socket = io('http://{sandboxId}.agent.localhost');

socket.on('terminal-output', (data) => {
  console.log(data);
});

socket.emit('terminal-input', 'npm install\n');
```

This makes it possible to build, run, and debug code interactively inside the sandbox.

---

## 6. Typical workflow

A common development flow looks like this:

1. Call `POST /api/sandbox/start` to create a sandbox.
2. Read the returned `sandboxId` and `previewUrl`.
3. Open the preview URL in a browser or an iframe.
4. Query file contents with `GET /read-files`.
5. Edit files with `PATCH /update-files`.
6. Create new files with `POST /create-files`.
7. Use the terminal via Socket.IO for build or test commands.

---

## 7. Summary of status codes

- `200 OK`: Request succeeded.
- `400 Bad Request`: Invalid payload or missing query parameter.
- `500 Internal Server Error`: Sandbox creation or server-side processing failed.

---

## 8. Example end-to-end request flow

```bash
# 1. Create a sandbox
curl -X POST http://localhost/api/sandbox/start

# Response example
# {
#   "message": "Sandbox with id 01a01567-54e1-74cc-a9d2-5e747e6f72eb has been created successfully",
#   "sandboxId": "01a01567-54e1-74cc-a9d2-5e747e6f72eb",
#   "previewUrl": "http://01a01567-54e1-74cc-a9d2-5e747e6f72eb.preview.localhost"
# }

# 2. List files in the sandbox
curl "http://01a01567-54e1-74cc-a9d2-5e747e6f72eb.agent.localhost/list-files"

# 3. Read a file
curl "http://01a01567-54e1-74cc-a9d2-5e747e6f72eb.agent.localhost/read-files?files=src/App.jsx"

# 4. Update a file
curl -X PATCH "http://01a01567-54e1-74cc-a9d2-5e747e6f72eb.agent.localhost/update-files" \
  -H "Content-Type: application/json" \
  -d '{"updates":[{"file":"src/App.jsx","content":"export default function App(){return <div>Hello</div>}"}]}'
```

This reference should help you understand how to create, access, read, modify, and manage sandboxed applications in the project.
