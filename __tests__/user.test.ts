import express from 'express';
import {runDB} from "../src/db/mongo.db";
import request from 'supertest';
import {setupApp} from "../src/setup-app";
import { MongoMemoryServer } from 'mongodb-memory-server';
import {TEST_ALLDATA_PATH, USER_PATH} from "../src/core/paths/paths";
import {testingUserDtoCreator} from "./utils/testingUserDtoCreator";
import {SETTINGS} from "../src/core/setting/settings";


describe('userEntity', () => {

    const app = express();
    setupApp(app);

    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await runDB(mongoServer.getUri());

    });

    beforeEach(async () => {
        await request(app).delete(`${TEST_ALLDATA_PATH}/all-data`)
    });

    afterAll(async () => {
        await mongoServer.stop();
    });


    let userDto: any;

    it('main endPoint', async () => {
        await request(app)
            .get('/')
            .expect(200);
    });

    describe('user post', () =>{
        it('create User', async () => {

            userDto = testingUserDtoCreator.createUserDto({})

            const newUser = await request(app)
                .post(USER_PATH)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send({ login: userDto.login, email: userDto.email, password: userDto.pass })
                .expect(201);

            expect(newUser.body).toEqual({
                id: expect.any(String),
                login: userDto.login,
                email: userDto.email,
                createdAt: expect.any(String),
            });
        });

        it('create incorrect  User', async () => {

            userDto = testingUserDtoCreator.createUserDto({})

            await request(app)
                .post(USER_PATH)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send({ login: 1, email: userDto.email, password: userDto.pass })
                .expect(400);
        });

        it('create Unauthorized  User', async () => {

            userDto = testingUserDtoCreator.createUserDto({})

            await request(app)
                .post(USER_PATH)
                .send({ login: 1, email: userDto.email, password: userDto.pass })
                .expect(401);
        });

    })

    describe('user delete', () => {
        it('POST , DELETE  User 204', async () => {

            const newUser = await request(app)
                .post(USER_PATH)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send({ login: 'test', email: 'test@gmail.com', password: '123456789' })
                .expect(201);

            expect(newUser.body).toEqual({
                id: expect.any(String),
                login: newUser.body.login,
                email: newUser.body.email,
                createdAt: expect.any(String),
            });

            await request(app)
                .delete(`${USER_PATH}/${newUser.body.id}`)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .expect(204);
        });

        it('POST , DELETE  User Unauthorized 401', async () => {

                const newUser = await request(app)
                    .post(USER_PATH)
                    .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                    .send({ login: 'test', email: 'test@gmail.com', password: '123456789' })
                    .expect(201);

                await request(app)
                    .delete(`${USER_PATH}/${newUser.body.id}`)
                    .expect(401);
            });

        it('DELETE If specified user is not exists 404', async () => {

            await request(app)
                .delete(`${USER_PATH}/6967e77a654011d98e7968d5`)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .expect(404);
        });

    })

    describe('getAll endpoint', () => {

        const users = [
            { login: 'alice', email: 'alice@test.com', pass: '123456' },
            { login: 'bob', email: 'bob@test.com', pass: '123456' },
            { login: 'carol', email: 'carol@test.com', pass: '123456' },
            { login: 'dave', email: 'dave@test.com', pass: '123456' },
            { login: 'eve', email: 'eve@test.com', pass: '123456' },
        ];


        it('return all users 201', async () => {
            const users = testingUserDtoCreator.createUserDtos(3);

            await Promise.all(
                users.map(user =>
                    request(app)
                        .post(USER_PATH)
                        .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                        .send({
                            login: user.login,
                            email: user.email,
                            password: user.pass,
                        })
                        .expect(201)
                )
            );

            const response = await request(app)
                .get(`${USER_PATH}`)
                .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                .expect(200);

            expect(response.body.items.length).toBe(4);

        });

        it('should return users sorted by login ascending, first page 2 items', async () => {


            await Promise.all(
                users.map(user =>
                    request(app)
                        .post(USER_PATH)
                        .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                        .send({
                            login: user.login,
                            email: user.email,
                            password: user.pass
                        })
                        .expect(201)
                )
            );

            const response = await request(app)
                .get(`${USER_PATH}`)
                .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                .query({
                    sortBy: 'login',
                    sortDirection: 'asc',
                    pageNumber: 1,
                    pageSize: 2
                })
                .expect(200);

            expect(response.body.items.length).toBe(2);
            expect(response.body.items[0].login).toBe('alice');
            expect(response.body.items[1].login).toBe('bob');
        });

    });



});