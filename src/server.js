// IMPORTAMOS DEPENDENCIAS DE LIBRERIAS
import express from "express";
import "dotenv/config";
import { dbConnection } from "./db.js";
import router from "./router.js"

const app = express();

//PARSEA EL BODY
app.use(express.json());

const PORT = process.env.PORT || 4001;

// API ROUTES

app.get("/api/healthy", (req, res) => {
    res.status(200).json(
        {
            success: true,
            message: "Server is healthy",
        }
    )
})

app.use("/api", router)

dbConnection()
    .then(() => {
        console.log("Database connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    })






