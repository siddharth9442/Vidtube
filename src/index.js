import connectDB from "./db/index.js";
import dotenv from "dotenv"
import 'dotenv/config.js'
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`App is listening on port:${PORT}`);
    })
})
.catch(err => {
    console.log("MONGODB connection failed !!!", err);
})