import express from 'express';
import morgan from 'morgan';
import agentRouter from './routes/agent.route.js';
const app = express()


app.use(morgan('dev'));
app.use(express.json())



app.get('/api/status/health', (req , res) =>{
    console.log("Version changed");
    res.status(200).json({
        status: "ok"
    })
})

app.use("/api/ai/agent" , agentRouter)


export default app