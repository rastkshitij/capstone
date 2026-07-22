import dotenv from "dotenv";
import { ChatMistralAI}  from '@langchain/mistralai';
import { createAgent } from 'langchain';
import { listFiles, readFiles, updateFiles } from './tools.js';
dotenv.config({
  path: "../../.env"
});
const model = new ChatMistralAI({
    model : "mistral-medium-latest" ,
    apiKey: process.env.MISTRAL_API_KEY
})

const agent = createAgent({
    model ,
    tools: [listFiles , updateFiles , readFiles] ,

})

await agent.invoke({
    messages : [
        {
            role: "user" ,
            content : "update the the theme of the project to light"
        }
    ]
})