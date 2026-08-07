import http from "http";
import app from "./src/app.js";

const server = http.createServer(app);

server.listen(3000, () => {
    console.log("Sandbox router is running on port 3000");
});