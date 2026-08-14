import http from "http";
import app, { getAgentProxy } from "./src/app.js";

const server = http.createServer(app);

server.on("upgrade", (req, socket, head) => {
    const host = req.headers.host;

    if (!host) {
        socket.destroy();
        return;
    }

    const parts = host.split(".");
    const sandboxId = parts[0];
    const subdomain = parts[1];

    if (subdomain === "agent") {
        const proxy = getAgentProxy(sandboxId);

        proxy.upgrade(req, socket, head);
    } else {
        socket.destroy();
    }
});

server.listen(3000, () => {
    console.log("Sandbox router is running on port 3000");
});