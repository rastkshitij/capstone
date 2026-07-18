import express from 'express';
import morgan from 'morgan';
import fs from 'fs'
import path from 'path';
const WORK_DIR = '/workspace'

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended : true}));

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hello from sandbox agent",
        status: 'success'
    })
})





app.get('/list-files', async (req, res) => {
    //this need to be codedoc
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
})


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
        const filePath = `${WORK_DIR}/${file}`;
        try {
            const content = await fs.promises.readFile(filePath, 'utf-8');
            return {
                [filePath]: content
            }
        } catch (err) {
            return {
                [filePath]: `Error reading file: ${err.message}`,
            }
        }
    }));
    return res.status(200).json({
        message: "file contant",
        files: results
    })
})

// pathch api for updating files content of the files
app.patch('/update-files', async (req, res) => {
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
            await fs.promises.writeFile(filePath, content, 'utf-8');
            return {
                [filePath]: 'file updated successfully'
            }
        } catch (err) {
            return { [filePath]: `Error updating file:${err.message}` }
        }
    }));
    res.status(200).json({
        message: 'Files updated results',
        results
    })
})

app.post('/create-files', async (req, res) => {
    const files = req.body.files;
    if (!files || !Array.isArray(files)) {
        return res.status(400).json({
            message: 'Invalid request body. Expected a json object with a "files" property containing a array of file',
            status: 'error'
        })
    }
const result = await Promise.all(
    files.map(async (fileObj) => {
        const { file, content } = fileObj;
        const filePath = path.join(WORK_DIR, file);

        try {
            await fs.promises.writeFile(filePath, content, "utf-8");

            return {
                [filePath]: "File created successfully",
            };
        } catch (err) {
            return {
                [filePath]: `Error creating file: ${err.message}`,
            };
        }
    })
);
 
res.status(200).json({
    message : 'Files created successfully ' ,
    result
})
})

export default app;