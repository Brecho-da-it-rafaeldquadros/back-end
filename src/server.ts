import "dotenv/config"

import app from "./app";
import AppDataSource from "./data-source";
import { initializationUserDefault } from "./util/initialization.util";

( async ()=>{
    await AppDataSource.initialize()
        .then(_=>console.log("Database running"))
        .catch(err=>console.error("Database not running", err))

    app.listen( process.env.PORT || 3000, () =>{
        console.log("Server running")
    } )

    await initializationUserDefault()
})()