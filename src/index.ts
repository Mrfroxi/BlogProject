import express, {Express} from 'express'
import {setupApp} from "./setup-app";


const app:Express = express();

setupApp(app);


const PORT:string|number = process.env.port || 5009;

app.listen(PORT , () => { console.log(`server start on port: ${PORT}`)});