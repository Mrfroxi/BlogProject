import express, { Express } from 'express';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { runDB } from '../../src/db/mongo.db';
import { setupApp } from '../../src/setup-app';
import { TEST_ALLDATA_PATH } from '../../src/core/paths/paths';

export const createTestApp = () => {

    const app: Express = express();
    setupApp(app);

    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create({
            binary: {
                version: '6.0.6',
            },
        });
        await runDB(mongoServer.getUri());
    });

    beforeEach(async () => {
        await request(app).delete(`${TEST_ALLDATA_PATH}/all-data`);
    });

    afterAll(async () => {
        if (mongoServer) {
            await mongoServer.stop();
        }
    });

    return app;
};
