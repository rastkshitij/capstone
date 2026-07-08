import express from 'express';
import morgan from 'morgan';
import { createPod } from './kubernetes/pod.js';
import { createService } from './kubernetes/service.js';
import {v7 as uuid} from 'uuid';
const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

app.get('/api/sandbox/health' ,  (req , res)=>{
    res.status(200).json({
        status: 'ok',
        message : "Sandbox server is healthy and running"

    })
})

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