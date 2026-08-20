import express from 'express';
import morgan from 'morgan';
import agentRouter from './routes/agent.route.js';
const app = express()


app.use(morgan('dev'));
app.use(express.json())



// GET /api/status/health
// Description: Health check endpoint to verify AI Orchestration service is running and accessible
// Returns: JSON object with status "ok" if service is healthy
app.get('/api/status/health', (req , res) =>{
    console.log("Version changed");
    console.log(process.env.MISTRAL_API_KEY);
    res.status(200).json({
        status: "ok"
    })
})

// Route: /api/ai/agent
// Description: Mounts all AI Agent related routes for managing and interacting with AI agents
app.use("/api/ai/agent" , agentRouter)


export default app