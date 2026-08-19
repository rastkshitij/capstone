import app from './src/app.js';

// Port 8080 for local dev (Vite runs on 3000 and proxies /api → 8080).
// In Kubernetes this is wrapped by a Service so the internal port doesn't matter.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Sandbox API server is running on port ${PORT}`)
})

