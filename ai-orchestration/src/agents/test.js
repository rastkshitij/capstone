import axios from "axios";

try {
    const res = await axios.get(
        "http://019f8a55-1389-70a7-be47-12766df3f166.agent.localhost/list-files"
    );

    console.log(res.data);
} catch (err) {
    console.log(err.code);
    console.log(err.message);
}