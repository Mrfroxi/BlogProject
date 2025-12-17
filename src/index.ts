import express, {Express} from 'express'
import {setupApp} from "./setup-app";
import dotenv from 'dotenv';

const app:Express = express();

dotenv.config();

setupApp(app);


const PORT:string|number = process.env["PORT"] || 5009;

app.listen(PORT , () => { console.log(`server start on port: ${PORT}`)});