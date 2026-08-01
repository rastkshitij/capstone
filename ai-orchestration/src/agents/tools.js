import axios from 'axios';
import { tool } from "langchain"
import * as z from "zod";

//list file tool 
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

return response.data.files.join("\n");
    },
    {
        name: "list_files",
        description: `
Returns the complete project file list.

IMPORTANT:
- This tool should normally be called only ONCE.
- Never call this tool again if it has already returned a list.
- Reuse the previous result.
- If you know the target file, call read_files instead.
`,
        schema: z.object({})
    }
);

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

        return files
    .map(f => `${f.file}\n${f.content}`)
    .join("\n\n");
    },
    {
        name: "read_files",
        description:
"Read the contents of one or more project files. Use this tool only when you need to inspect file contents before making changes. Do not call it again for the same file unless it has been modified.",
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

       return [
    "Updated src/App.jsx",
    "Updated package.json"
].join("\n");
    },
    {
        name: "update_files",
        description:
"Update or create project files. After this tool succeeds, do NOT call it again with the same content. Instead, provide a final response to the user.",
        schema: z.object({
            files: z.array(z.object({
                file: z.string().describe("The absolute path of the file to update"),
                content: z.string().describe("The new content for the file, the content should support json format.")
            })).describe("The list of files to update and their new contents")
        })
    }
)