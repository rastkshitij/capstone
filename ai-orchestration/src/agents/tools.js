import axios from "axios";
import {tool} from 'langchain';
import * as z from 'zod';

export const listFiles = tool(
    async ({
        paths : []
    }) => {
        const response = await axios.get("http://019f7a1a-6596-708e-be38-ce508f067810.agent.localhost/list-files");
        return response.data.files;
    } ,
    {
        name: "list_files",
        description :"List all the file in the  project directory.This is useful for understanding what files are available to work with."
    }
)
