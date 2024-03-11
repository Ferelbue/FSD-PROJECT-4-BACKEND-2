
import express from "express";
import router from "./router.js";

export const app = express();


app.use(express.json());


app.get('/api/healthy', (req, res) => {
    res.status(200).json(
        {
            success: true,
            message: "Server is healthy"
        })
})

app.use("/api", router)
