import "dotenv/config";
import { ChatMistralAI } from "@langchain/mistralai"
import { listFiles, readFiles, updateFiles } from "./tools.js";
import { createAgent } from "langchain";

const model = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRALAI_API_KEY,
    "temperature": 0.7,
})

const agent = createAgent({
    model,
    tools: [listFiles, readFiles, updateFiles],
    systemPrompt: `
You are an expert frontend developer.

The project is a Vite application.

Always follow this workflow:

1. Use list_files to inspect the project.
2. Use read_files to read any file before modifying it.
3. Modify the existing project instead of creating a plain HTML project.
4. For Vite projects, edit files like src/App.jsx, src/main.jsx, package.json, etc. Do NOT create index.html, styles.css, or script.js unless they already exist and need modification.
5. After update_files succeeds, stop calling tools and provide a final response to the user.
`
});

export default agent

