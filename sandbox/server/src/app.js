import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createPod } from './kubernetes/pod.js';
import { createService } from './kubernetes/service.js';
import {v7 as uuid} from 'uuid';
const app = express();

// Allow requests from the React frontend (and any other origin in dev)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// GET /api/sandbox/health
// Description: Health check endpoint to verify Sandbox Server is running and healthy
// Returns: JSON object with status 'ok' and a message indicating the server is healthy
app.get('/api/sandbox/health' ,  (req , res)=>{
    res.status(200).json({
        status: 'ok',
        message : "Sandbox server is healthy and running"

    })
})

// POST /api/sandbox/start
// Description: Creates and starts a new sandbox environment with a unique ID
// Functionality: Generates a UUID, creates a pod and service in Kubernetes, and returns sandbox details
// Returns: JSON with sandboxId, previewUrl, and success message; Error response if creation fails
console.log("Registering POST /api/sandbox/start");
app.post('/api/sandbox/start', async (req, res) => {
    try {
        const sandboxId = uuid();

        await Promise.all([
            createPod(sandboxId),
            createService(sandboxId)
        ]);

        res.status(200).json({
            message: `Sandbox with id ${sandboxId} has been created successfully`,
            sandboxId,
            previewUrl: `http://${sandboxId}.preview.localhost`
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Failed to create sandbox",
            error: err.message
        });
    }
});

export default app;