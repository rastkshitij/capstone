import { Router } from "express";
import agent from "../agents/code.agents.js";

const agentRouter = Router()
// this is router which accept api from get /api/ai/agent 
agentRouter.post("/invoke", async (req, res) => {

    console.log("Request received");


    try {

const { message, projectId } = req.body;
console.log(projectId)
console.log(message);
console.log("Starting agent");

const response = await agent.invoke({
    messages: [
        {
            role: "user",
            content: message
        }
    ],
    context: {
        projectId
    }
});
console.dir(
    response.messages[response.messages.length - 1],
    { depth: null }
);

console.log("Agent finished");

res.status(200).json({
    response
});

    } catch (err) {

    console.error(err);

    res.status(500).json({
        error: err.message
    });

}

});


export default agentRouter;