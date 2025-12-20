import express, {Express} from 'express'
import {setupApp} from "./setup-app";
import dotenv from 'dotenv';
dotenv.config();
import {SETTINGS} from "./core/setting/settings";
import {runDB} from "./db/mongo.db";

const bootstrap = async () => {
    const app:Express = express();
    setupApp(app);
    const PORT = SETTINGS.PORT;

    await runDB(SETTINGS.MONGO_URL);

    app.listen(PORT, () => console.log(`server start on port: ${PORT}`));
    return app;
};

bootstrap();
