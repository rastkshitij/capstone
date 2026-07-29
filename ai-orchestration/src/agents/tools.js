import axios from 'axios';
import { tool } from "langchain"
import * as z from "zod";


export const listFiles = tool(
    async ({ }) => {
        console.log("=================================")
        console.log("using list files tool")
        console.log("=================================")

        const response = await axios.get(
            "http://localhost/list-files",
            {
                headers: {
                    Host: "019fae67-44ab-7571-8937-2e16810a6287.agent.localhost"
                }
            }
        );


        console.log("=================================")
        console.log("response from list files tool")
        console.dir(response.data, { depth: null });
        console.log("=================================")
        console.log("Returning from listFiles");

        return JSON.stringify(response.data.files);
    },
    {
        name: "list_files",
        description: "List all the files in the project directory. This is useful for understanding what files are available to work with.",
        schema: z.object({})
    }
)

export const readFiles = tool(
    async ({ files }) => {

        console.log("=================================")
        console.log("using read files tool with files", files)
        console.log("=================================")

        const response = await axios.get(
            "http://localhost/read-files?files=" + files.join(","),
            {
                timeout: 10000,
                headers: {
                    Host: "019fae67-44ab-7571-8937-2e16810a6287.agent.localhost"
                }
            }
        );
        //clg 
        console.log("=================================")
        console.log("response from read files tool", response.data)
        console.log("=================================")
        console.log("Returning from ReadFiles");

        return JSON.stringify(response.data);
    },
    {
        name: "read_files",
        description: "...",
        schema: z.object({
            files: z.array(z.string())
        })
    }
);

export const updateFiles = tool(
    async ({ files }) => {

        console.log("=================================")
        console.log("using update files tool with files", files)
        console.log("=================================")
        console.log("updateFiles started");
        const response = await axios.patch(
            "http://localhost/update-files",
            {
                updates: files
            },
            {
                headers: {
                    Host: "019fae67-44ab-7571-8937-2e16810a6287.agent.localhost"
                }
            }
        );
        console.log("updateFiles completed")
        console.log("=================================")
        console.log("response from update files tool", response.data)
        console.log("=================================")

        console.log("Returning from updateFiles");

        return JSON.stringify(response.data.results);
    },
    {
        name: "update_files",
        description: "Update the contents of specified files. This is useful for making changes to files based on the requirements of the task at hand. this tool can also use to create new files by providing a new file name in the file field and the content to be added in the content field.",
        schema: z.object({
            files: z.array(z.object({
                file: z.string().describe("The absolute path of the file to update"),
                content: z.string().describe("The new content for the file, the content should support json format.")
            })).describe("The list of files to update and their new contents")
        })
    }
)