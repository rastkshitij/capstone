import axios from "axios";
import { tool } from 'langchain';
import * as z from 'zod';

/**
 * @route: http://019f7a1a-6596-708e-be38-ce508f067810.agent.localhost/list-files
 * @description: Lists all files in the sandbox workspace folder.
 */
export const listFiles = tool(
    async () => {
        console.log('==============================');
        console.log("using listfiles");
        console.log('==============================');

        const response = await axios.get("http://019f8a55-1389-70a7-be47-12766df3f166.agent.localhost/list-files");

        console.log('==============================');
        console.log('response from list file tools\t', response.data);
        console.log('==============================');

        return JSON.stringify(response.data.files);
    },
    {
        name: "list_files",
        description: "List all files in the project directory. This is useful for understanding what files are available to work with.",
        schema: z.object({})
    }
);

/**
 * @route: http://019f7a1a-6596-708e-be38-ce508f067810.agent.localhost/read-files
 * @description: Reads the content of one or more files from the sandbox workspace.
 */
export const readFiles = tool(
    async ({ files }) => {
        console.log('==============================');
        console.log("using read file tool", files);
        console.log('==============================');

        const response = await axios.get(
            'http://019f8a55-1389-70a7-be47-12766df3f166.agent.localhost/read-files?files=' + files.join(',')
        );

        console.log('==============================');
        console.log("response from read file", response.data);
        console.log('==============================');

        return JSON.stringify(response.data);
    },
    {
        name: "read_files",
        description: "Read the content of the specified files. This is useful for understanding the content of files that are relevant to the task at hand.",
        schema: z.object({
            files: z.array(z.string()).describe("The list of file paths to read. These should be files that were listed using the list_files tool or created later.")
        })
    }
);

/**
 * @route: http://019f7a1a-6596-708e-be38-ce508f067810.agent.localhost/update-files
 * @description: Updates or creates files in the sandbox workspace by sending the file contents to the sandbox agent.
 */
export const updateFiles = tool(
    async ({ files }) => {
        console.log('==============================');
        console.log("using update files", files);
        console.log('==============================');

        const response = await axios.patch(
            "http://019f8a55-1389-70a7-be47-12766df3f166.agent.localhost/update-files",
            { updates: files }
        );

        console.log('==============================');
        console.log("response from update files", response.data);
        console.log('==============================');

        return JSON.stringify(response.data.results);
    },
    {
        name: 'update_files',
        description: "Updates the contents of the specified files. This is useful for making changes to files based on the requirements of the task at hand. This tool can also be used to create new files by providing the content to be added.",
        schema: z.object({
            files: z.array(
                z.object({
                    file: z.string().describe("The absolute path of the file to update"),
                    content: z.string().describe("The new content of the file")
                })
            ).describe("The list of files to update and their new contents")
        })
    }
);