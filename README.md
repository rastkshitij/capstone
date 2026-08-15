# Capstone Project - AI-Powered Sandbox Architecture

## Overview

This is a **Kubernetes-based microservices architecture** designed to provide dynamic AI-powered sandbox environments. The system combines AI orchestration, dynamic container provisioning, and request routing to create isolated, on-demand sandboxes for AI agent execution.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                    Vite + React Application                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Ingress / Load Balancer                       │
│              (Routes based on subdomain patterns)                │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼─────┐    ┌────────▼────────┐   ┌──────▼────────┐
│   Router    │    │ AI Orchestration │   │  Sandbox Mgmt │
│  Service    │    │    Service       │   │   Service     │
│ (Port 3000) │    │   (Port 3000)    │   │  (Port 3000)  │
└───────┬─────┘    └────────┬────────┘   └──────┬────────┘
        │                    │                    │
        │        ┌───────────┘                    │
        │        │        (LangChain + MistralAI) │
        │        │                                 │
        │    ┌───────────────────────────────────┘
        │    │
        │    │  Kubernetes API
        │    │  (Creates Pods & Services)
        │    │
┌───────▼────▼──────────────────────────────────────────────────────┐
│              Dynamic Sandbox Pods (on demand)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Sandbox-1   │  │  Sandbox-2   │  │  Sandbox-N   │              │
│  │  (Agent Pod) │  │  (Agent Pod) │  │  (Agent Pod) │              │
│  │ Port: 3000   │  │ Port: 3000   │  │ Port: 3000   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└────────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
capstone/
├── ai-orchestration/          # AI Orchestration Service
│   ├── dockerfile
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── agents/
│       │   ├── code.agents.js
│       │   ├── test.js
│       │   └── tools.js
│       └── routes/
│           └── agent.route.js
│
├── sandbox/                   # Sandbox Management
│   ├── agent/                 # Agent Service (runs in dynamic pods)
│   │   ├── dockerfile
│   │   ├── package.json
│   │   └── server.js
│   │
│   ├── router/                # Request Router Service
│   │   ├── dockerfile
│   │   ├── package.json
│   │   └── server.js
│   │
│   ├── server/                # Sandbox Provisioning Service
│   │   ├── dockerfile
│   │   ├── package.json
│   │   ├── server.js
│   │   └── src/
│   │       ├── app.js
│   │       └── kubernetes/
│   │           ├── config.js
│   │           ├── pod.js
│   │           └── service.js
│   │
│   └── template/              # Frontend UI
│       ├── dockerfile
│       ├── package.json
│       ├── vite.config.js
│       ├── index.html
│       └── src/
│           ├── App.jsx
│           ├── main.jsx
│           └── assets/
│
├── k8s/                       # Kubernetes Manifests
│   ├── ai-deployment.yml      # AI Service Deployment
│   ├── ai-service.yml         # AI Service Exposure
│   ├── sandbox-deployment.yml # Sandbox Server Deployment
│   ├── sandbox-service.yml    # Sandbox Service Exposure
│   ├── router-deployment.yml  # Router Deployment
│   ├── router-service.yml     # Router Service Exposure
│   ├── ingress.yml            # Ingress Rules
│   └── rbac.yml               # Role-Based Access Control
│
├── auth/                      # Authentication Module
├── notification/              # Notification Service
│
├── skaffold.yml               # Skaffold Configuration
├── rendered.yaml              # Rendered Manifests
└── README.md                  # This file
```

## Core Services

### 1. **AI Orchestration Service** (`ai-orchestration/`)

**Purpose:** Handles AI agent orchestration and LLM interactions.

**Key Technologies:**
- **Express.js** - HTTP server framework
- **LangChain** - LLM orchestration framework
- **MistralAI** - Large Language Model API
- **Axios** - HTTP client

**Port:** 3000

**Endpoints:**
- `GET /api/status/health` - Health check
- `POST/GET /api/ai/agent/*` - AI agent operations

**Features:**
- Agent orchestration using LangChain
- Integration with MistralAI for LLM capabilities
- Tool execution and planning
- Request logging with Morgan

---

### 2. **Sandbox Router Service** (`sandbox/router/`)

**Purpose:** Routes incoming requests to appropriate sandbox instances based on subdomain.

**Key Technologies:**
- **Express.js** - HTTP server framework
- **http-proxy-middleware** - Request proxying and WebSocket upgrade handling
- **Morgan** - HTTP request logging

**Port:** 3000

**Features:**
- **Subdomain-based routing:**
  - `{sandboxId}.agent.localhost` → Routes to Agent pod
  - `{sandboxId}.preview.localhost` → Routes to Preview service
- **WebSocket support** - Handles socket upgrades for real-time communication
- **Health & Readiness endpoints:**
  - `GET /api/status/healthz` - Liveness probe
  - `GET /api/status/readyz` - Readiness probe

**Endpoints:**
- `/api/status/healthz` - Health check
- `/api/status/readyz` - Readiness check
- Dynamic proxy routing based on host headers

---

### 3. **Sandbox Management Service** (`sandbox/server/`)

**Purpose:** Manages dynamic creation and provisioning of sandbox environments.

**Key Technologies:**
- **Express.js** - HTTP server framework
- **@kubernetes/client-node** - Kubernetes API client
- **Mongoose** - Database ORM (for persistence)
- **UUID** - Unique identifier generation

**Port:** 3000

**Kubernetes Integration:**
- Creates Kubernetes Pods on-demand
- Provisions Kubernetes Services for networking
- Uses Service Account with proper RBAC permissions

**Endpoints:**
- `GET /api/sandbox/health` - Health check
- `POST /api/sandbox/start` - Create new sandbox
  - **Request:** Creates a unique sandboxId (UUID v7)
  - **Response:** Returns sandboxId and preview URL
  - **Example Response:**
    ```json
    {
      "message": "Sandbox with id {sandboxId} has been created successfully",
      "sandboxId": "uuid-v7",
      "previewUrl": "http://{sandboxId}.preview.localhost"
    }
    ```

**Kubernetes Resource Creation:**
- Dynamically creates `Pod` with unique naming: `sandbox-{sandboxId}`
- Dynamically creates `Service` with unique naming: `sandbox-service-{sandboxId}`
- Each sandbox is isolated in its own pod with dedicated service

---

### 4. **Agent Service** (`sandbox/agent/`)

**Purpose:** The actual agent service that runs inside dynamic sandbox pods.

**Key Technologies:**
- **Express.js** - HTTP server framework
- **Morgan** - HTTP request logging

**Port:** 3000

**Deployment:** Runs inside dynamically created Kubernetes pods

**Role:** Executes agent logic and processes requests from the sandbox router

---

### 5. **Frontend Template** (`sandbox/template/`)

**Purpose:** User-facing React application for interacting with the system.

**Key Technologies:**
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React DOM** - DOM rendering
- **OxLint** - Linting

**Build Artifacts:**
- Development server: `npm run dev`
- Production build: `npm run build`
- Preview: `npm run preview`

**Features:**
- Modern React components
- Fast HMR with Vite
- TypeScript support ready

---

## Data Flow

### Sandbox Creation Flow

```
1. User requests sandbox creation via Frontend
        ↓
2. Frontend calls POST /api/sandbox/start (Sandbox Server)
        ↓
3. Sandbox Server generates UUID for sandboxId
        ↓
4. Creates Kubernetes Pod: sandbox-{sandboxId}
   - Image: agent:latest
   - Port: 3000
   - Service Account: resource-manager
        ↓
5. Creates Kubernetes Service: sandbox-service-{sandboxId}
   - Routes traffic to the pod
        ↓
6. Returns sandboxId and previewUrl to Frontend
```

### Request Routing Flow

```
1. User sends request to {sandboxId}.agent.localhost
        ↓
2. Ingress routes to Router Service
        ↓
3. Router extracts sandboxId from subdomain
        ↓
4. Router creates proxy to: http://sandbox-service-{sandboxId}:3000
        ↓
5. Request forwarded to specific Sandbox Pod
```

### AI Agent Execution Flow

```
1. Request arrives at AI Orchestration Service
        ↓
2. AI Service processes request using LangChain
        ↓
3. MistralAI LLM is invoked for processing
        ↓
4. Agents execute tools (code.agents.js)
        ↓
5. Response returned to client
```

---

## Technology Stack

### Backend
| Component | Technology |
|-----------|-----------|
| Runtime | Node.js (ES Modules) |
| Web Framework | Express.js v5.2.1 |
| Container Orchestration | Kubernetes |
| Container Runtime | Docker |
| Kubernetes Client | @kubernetes/client-node v1.4.0 |
| Database ORM | Mongoose v9.7.3 |
| LLM Framework | LangChain v1.5.3 |
| LLM Provider | MistralAI v1.2.0 |
| HTTP Client | Axios v1.18.1 |
| Proxying | http-proxy-middleware v3.0.7 |
| HTTP Logger | Morgan v1.11.0 |
| ID Generation | UUID v14.0.1 |
| Validation | Zod v4.4.3 |
| Environment | Dotenv v17.4.2 |

### Frontend
| Component | Technology |
|-----------|-----------|
| Framework | React v19.2.7 |
| Build Tool | Vite v8.1.1 |
| Styling | CSS Modules |
| Linting | OxLint v1.71.0 |

### DevOps
| Component | Technology |
|-----------|-----------|
| Orchestration | Skaffold v4beta13 |
| Container Image | Docker |
| Kubernetes | Latest API (v1) |
| Config Management | YAML Manifests |

---

## Kubernetes Resources

### Deployments
- **ai-deployment** - 2 replicas of AI Orchestration Service
- **sandbox-deployment** - Sandbox Management Server (1 replica)
- **router-deployment** - Router Service

### Services
- **ai-service** - Exposes AI Orchestration
- **sandbox-service** - Exposes Sandbox Server
- **router-service** - Exposes Router
- **sandbox-service-{sandboxId}** - Dynamically created per sandbox

### Ingress
- Routes external traffic based on hostname/subdomain patterns

### RBAC
- **ServiceAccount: resource-manager** - Required for Kubernetes API access to create/manage pods

---

## Deployment

### Build Images with Skaffold
```bash
skaffold build
```

### Deploy to Kubernetes
```bash
skaffold run
```

### Development Mode with Live Reload
```bash
skaffold dev
```

### Images Built
1. `ai-orchestration` - AI Service
2. `agent` - Agent Service
3. `router` - Router Service
4. `sandbox` - Sandbox Server
5. `template` - Frontend UI

---

## Configuration

### Environment Variables

**AI Orchestration Service:**
- `MISTRAL_API_KEY` - Kubernetes Secret for MistralAI API

**All Services:**
- `.env` files for local development
- Kubernetes Secrets/ConfigMaps for production

---

## Key Features

✅ **Dynamic Sandbox Provisioning** - On-demand sandbox creation via Kubernetes

✅ **Subdomain-based Routing** - Intelligent routing based on subdomains

✅ **AI Orchestration** - LangChain + MistralAI integration

✅ **WebSocket Support** - Real-time communication between agents

✅ **Kubernetes Native** - Full Kubernetes integration with RBAC

✅ **Microservices Architecture** - Loosely coupled, independently deployable services

✅ **Health Checks** - Liveness and readiness probes for all services

✅ **Resource Management** - CPU/Memory limits and requests configured

---

## Development

### Prerequisites
- Node.js 18+
- Docker
- Kubernetes cluster (local or remote)
- Skaffold
- kubectl

### Local Development Setup

```bash
# Install dependencies for each service
cd ai-orchestration && npm install
cd ../sandbox/router && npm install
cd ../sandbox/server && npm install
cd ../sandbox/agent && npm install
cd ../sandbox/template && npm install
```

### Running Services Locally

```bash
# In separate terminals

# AI Orchestration
cd ai-orchestration
npm run dev

# Router
cd sandbox/router
npm run dev

# Sandbox Server
cd sandbox/server
npm run dev

# Template Frontend
cd sandbox/template
npm run dev
```

---

## Security Considerations

- **RBAC:** Sandbox Server uses limited service account for pod creation
- **Resource Limits:** All containers have CPU/Memory limits
- **Secrets Management:** API keys stored in Kubernetes Secrets
- **Network Policies:** Can be configured for inter-service communication
- **Image Pull Policy:** Set to `Never` for local development (should be updated for production)

---

## Future Enhancements

- [ ] Database persistence layer
- [ ] Notification system integration
- [ ] Authentication & Authorization
- [ ] Advanced monitoring and logging
- [ ] Sandbox cleanup/garbage collection
- [ ] Rate limiting and quota management
- [ ] Multi-region deployment
- [ ] Horizontal scaling for services

---

## Contributing

When modifying the architecture:
1. Update relevant service documentation
2. Ensure Kubernetes manifests are valid
3. Test with Skaffold before deployment
4. Update this README with architectural changes

---

## License

ISC

---

**Last Updated:** 2024
