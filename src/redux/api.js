import axios from "axios";

const api = axios.create({
    baseURL: "/",
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("auth"),
    }
});

export default api;