import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.get("/api/status/healthz", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Sandbox router is healthy and running"
    });
});

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