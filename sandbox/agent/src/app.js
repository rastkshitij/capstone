import express from 'express';
import morgan from 'morgan';
import fs from 'fs'
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';
import pty from 'node-pty';
import os from 'os';
const WORK_DIR = '/workspace'

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH"]
    }

})

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hello from sandbox agent",
        status: 'success'
    })
})

const shell = process.env.SHELL || "bash";
const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: "/workspace",
    env: process.env
});

ptyProcess.on('data', function (data) {
    io.emit('terminal-output', data);
});

ptyProcess.onExit(({ exitCode, signal }) => {
    console.log(`Terminal process exited with code ${exitCode} and signal ${signal}`);
});

io.on('connection', (socket) => {
    console.log(`a user connected with id ${socket.id}`);
    socket.on('terminal-input', (data) => {
        ptyProcess.write(data);
    });
    socket.on('disconnect', () => {
        console.log(`user with id ${socket.id} disconnected`);
    })
})

//this api list files 
app.get('/list-files', async (req, res) => {
    //this need to be codedoc
    console.log("WORK_DIR =", WORK_DIR);
    const listFiles = async (dir, baseDir) => {
        const entries = await fs.promises.readdir(dir, {
            withFileTypes: true,
        });

        const files = [];

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(baseDir, fullPath);

            if (entry.isDirectory()) {
                if (
                    ["node_modules", ".git", "dist", ".next", "build"].includes(entry.name)
                ) {
                    continue;
                }

                files.push(...await listFiles(fullPath, baseDir));
            } else {
                files.push(relativePath);
            }
        }

        return files;
    }
    try {
        const files = await listFiles(WORK_DIR, WORK_DIR);
        res.status(200).json({
            message: 'files listed successfully',
            files
        })
    } catch (err) {
        console.log(`the error is in the file reading is ${err}`)
    }
});

//this api read-files
app.get("/read-files", async (req, res) => {
    const files = req.query.files;
    if (!files) {
        return res.status(400).json(
            {
                message: "No files specified in query parameter",
                status: 'error'
            }
        )
    }
    const fileList = files.split(',');
    const results = await Promise.all(fileList.map(async (file) => {
        const filePath = path.join(WORK_DIR, file);
        try {
            const content = await fs.promises.readFile(filePath, 'utf-8');
            return {
                [filePath.replace(WORK_DIR, '')]: content
            }
        } catch (err) {
            return {
                [filePath.replace(WORK_DIR, '')]: `Error reading file: ${err.message}`,
            }
        }
    }));
    return res.status(200).json({
        message: "file content",
        files: results
    })
});

// patch api for updating files content of the files
app.patch('/update-files', async (req, res) => {
    console.log("===== UPDATE FILES CALLED =====");
    const updates = req.body.updates;
    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json(
            {
                message: 'Invalid request body.Expected a json object with an "updates" property containg an array of file updates.'
                , status: 'error'
            }
        )
    }

    const results = await Promise.all(updates.map(async (update) => {
        const { file, content } = update;
        const filePath = path.join(WORK_DIR, file);
        try {
            await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
            await fs.promises.writeFile(filePath, content, 'utf-8');
            return {
                [filePath]: 'file updated successfully'
            }
        } catch (err) {
            return {
                file,
                status: "error",
                message: err.message,
            };
        }
    }));
    res.status(200).json({
        message: 'Files updated results',
        results,
        status: "success"
    })
});

//
app.post("/create-files", async (req, res) => {
    const files = req.body.files;

    if (!files || !Array.isArray(files)) {
        return res.status(400).json({
            message: 'Invalid request body. Expected a "files" array.',
            status: "error",
        });
    }

    const results = await Promise.all(
        files.map(async ({ file, content }) => {
            const filePath = path.join(WORK_DIR, file);

            try {
                // Create parent directories
                await fs.promises.mkdir(path.dirname(filePath), {
                    recursive: true,
                });

                // Create the file
                await fs.promises.writeFile(filePath, content, "utf-8");

                return {
                    file,
                    status: "success",
                    message: "File created successfully",
                };
            } catch (err) {
                return {
                    file,
                    status: "error",
                    message: err.message,
                };
            }
        })
    );

    return res.status(200).json({
        message: "Files created successfully",
        results,
    });
});

export default httpServer;