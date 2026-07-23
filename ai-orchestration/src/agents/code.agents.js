import "dotenv/config";
import { ChatMistralAI } from "@langchain/mistralai"
import { listFiles, readFiles, updateFiles } from "./tools.js";
import { createAgent } from "langchain";

const model = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRALAI_API_KEY,
    "temperature": 0.7,
})

const agent = createAgent({
    model,
    tools: [ listFiles, readFiles, updateFiles ],
})

const result = await agent.invoke({
    messages: [
        {
            role: "user",
            content: `
Change the whole content of the website to a simple landing page of a e commerce website you can use image from unsplash
`
        }
    ]
});

console.log(JSON.stringify(result, null, 2));