import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// Inject CORS headers for all proxied traffic (handles preflight too)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

// GET /api/status/healthz
// Description: Health check endpoint for readiness probes (Kubernetes compatibility)
// Returns: JSON object with status "ok" and a message indicating router is healthy
app.get("/api/status/healthz", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Sandbox router is healthy and running"
    });
});

// GET /api/status/readyz
// Description: Readiness check endpoint for Kubernetes readiness probes
// Returns: JSON object with status "ready" and a message indicating router is ready to handle traffic
app.get("/api/status/readyz", (req, res) => {
    res.status(200).json({
        status: "ready",
        message: "Sandbox router is healthy and running"
    });
});

app.use(morgan("combined"));

const proxies = {};
const agentProxies = {};

function getProxy(sandboxId) {
    const target = `http://sandbox-service-${sandboxId}`;

    if (!proxies[sandboxId]) {
        proxies[sandboxId] = createProxyMiddleware({
            target,
            changeOrigin: false,
            ws: true
        });
    }

    return proxies[sandboxId];
}

function getAgentProxy(sandboxId) {
    const target = `http://sandbox-service-${sandboxId}:3000`;

    if (!agentProxies[sandboxId]) {
        agentProxies[sandboxId] = createProxyMiddleware({
            target,
            changeOrigin: false,
            ws: true
        });
    }

    return agentProxies[sandboxId];
}

app.use((req, res, next) => {
    const host = req.headers.host;

    if (!host) {
        return next();
    }

    const parts = host.split(".");
    const sandboxId = parts[0];

    if (parts[1] === "agent") {
        return getAgentProxy(sandboxId)(req, res, next);
    }

    if (parts[1] === "preview") {
        console.log("Host:", host);
        return getProxy(sandboxId)(req, res, next);
    }

    next();
});

export { getAgentProxy };
export default app;