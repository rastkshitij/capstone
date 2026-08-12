import { Router } from "express";
import agent from "../agents/code.agents.js";

const agentRouter = Router()
// this is router which accept api from get /api/ai/agent 
agentRouter.post("/invoke", async (req, res) => {

    console.log("Request received");

    try {

        const { message, projectId } = req.body;
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        });

        console.log("Starting agent");
const response = await agent.stream(
    {
        messages: [
            {
                role: "user",
                content: message,
            },
        ],
    },
    {
        context: {
            projectId,
        },
        streamMode: "custom",
    }
);

for await (const chunk of response) {
    console.log("Chunk received:", chunk);

    res.write(
        `data: ${JSON.stringify(chunk)}\n\n`
    );
}

console.log("Agent finished");

res.end();

    }  catch (err) {
    console.error(err);

    if (!res.headersSent) {
        res.status(500).json({
            error: err.message
        });
    } else {
        res.write(`event: error\ndata: ${JSON.stringify({
            error: err.message
        })}\n\n`);
        res.end();
    }
}

});


export default agentRouter;