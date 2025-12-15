import express from 'express'
import {setupApp} from "./setup-app";


const app = express();

setupApp(app);


const PORT = process.env.port || 5009;


app.listen(PORT , () => { `server start on port: ${PORT}`});