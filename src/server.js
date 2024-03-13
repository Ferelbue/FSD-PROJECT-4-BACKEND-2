// IMPORTAMOS DEPENDENCIAS DE LIBRERIAS

import "dotenv/config";
import { dbConnection } from "./database/db.js";
import { app } from "./app.js";



const PORT = process.env.PORT || 4001;



dbConnection()
    .then(() => {
        console.log('------------------------');
        console.log('-- DATABASE CONNECTED --');

        app.listen(PORT, () => {

            console.log('------------------------');
            console.log('---- SERVER RUNNING ----');
            console.log(`----    PORT:${PORT}   ----`);
            console.log('------------------------');
        })
    })
    .catch(error => {
        console.log(error)
    })






