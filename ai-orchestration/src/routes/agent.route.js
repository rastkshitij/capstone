import { Router } from "express";
import agent from "../agents/code.agents.js";

const agentRouter = Router()
 
agentRouter.post("/invoke" , async (req , res)=>{
    try{
        const { message } = req.body;
        const response = await agent.invoke({ messages : {
            role : "user" ,
            content: message
        } });
        res.json({  response });
    }catch (err) {
        console.log("Error invoking agent" , err);
        res.status(500).json({ error : "Failed to invoke agent"})
    }
})


export default agentRouter;