import { createTestApp } from './utils/testApp';
import request from 'supertest';
import { userCollection } from '../src/db/mongo.db';

describe('Security Device endpoint', () => {
  const app = createTestApp();

  it('main endPoint', async () => {
    await request(app).get('/').expect(200);
  });

  const newUser = {
    login: 'test',
    password: 'password123',
    email: 'example@example.dev',
  };

  describe('security/devices', () => {
    const devicesEndpoint = '/security/devices';
    const loginEndpoint = '/auth/login';

    it('200 -> should return all active sessions for current user', async () => {
      await request(app).post('/auth/registration').send(newUser).expect(204);

      await userCollection.updateOne(
        { login: newUser.login },
        { $set: { 'emailConfirmation.isConfirmed': true } }
      );

      const loginRes = await request(app)
        .post(loginEndpoint)
        .set('user-agent', 'Chrome/122.0.0.0')
        .send({
          loginOrEmail: newUser.login,
          password: newUser.password,
        })
        .expect(200);

      const cookie = loginRes.headers['set-cookie'];

      const res = await request(app).get(devicesEndpoint).set('Cookie', cookie).expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);

      expect(res.body[0]).toEqual({
        ip: expect.stringMatching('127.0.0.1'),
        title: expect.stringContaining('Chrome'),
        lastActiveDate: expect.any(String),
        deviceId: expect.any(String),
      });

      const secondLoginRes = await request(app)
        .post(loginEndpoint)
        .set('user-agent', 'Yandex/122.0.0.0')
        .send({
          loginOrEmail: newUser.login,
          password: newUser.password,
        })
        .expect(200);

      const secondCookie = secondLoginRes.headers['set-cookie'];

      const secRes = await request(app)
        .get(devicesEndpoint)
        .set('Cookie', secondCookie)
        .expect(200);

      expect(Array.isArray(secRes.body)).toBe(true);
      expect(secRes.body.length).toBe(2);

      expect(secRes.body[1]).toEqual({
        ip: expect.stringMatching('127.0.0.1'),
        title: expect.stringContaining('Yandex'),
        lastActiveDate: expect.any(String),
        deviceId: expect.any(String),
      });
    });

    it('401 -> should return 401 if refresh token in cookie is missing or incorrect', async () => {
      await request(app)
        .get(devicesEndpoint)
        .set('Cookie', ['refreshToken=wrong_token'])
        .expect(401);
    });
  });

  describe('DELETE /security/devices', () => {
    const devicesEndpoint = '/security/devices';
    const loginEndpoint = '/auth/login';

    it('204 -> should terminate all other sessions except current one', async () => {
      // Register and activate user
      await request(app).post('/auth/registration').send(newUser).expect(204);

      await userCollection.updateOne(
        { login: newUser.login },
        { $set: { 'emailConfirmation.isConfirmed': true } }
      );

      // Login from Device 1 (e.g., Chrome)
      const loginRes1 = await request(app)
        .post(loginEndpoint)
        .set('user-agent', 'Chrome')
        .send({ loginOrEmail: newUser.login, password: newUser.password })
        .expect(200);
      const cookieDevice1 = loginRes1.headers['set-cookie'];

      // Login from Device 2 (e.g., Firefox)
      const loginRes2 = await request(app)
        .post(loginEndpoint)
        .set('user-agent', 'Firefox')
        .send({ loginOrEmail: newUser.login, password: newUser.password })
        .expect(200);
      const cookieDevice2 = loginRes2.headers['set-cookie'];

      //  Terminate all sessions except Device 2
      await request(app).delete(devicesEndpoint).set('Cookie', cookieDevice2).expect(204);

      //  Assert: Check devices list via Device 2
      const res = await request(app).get(devicesEndpoint).set('Cookie', cookieDevice2).expect(200);

      // Only one session (the current one) should remain
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Firefox');

      //  Verify Device 1 is actually unauthorized now
      await request(app).get(devicesEndpoint).set('Cookie', cookieDevice1).expect(401);
    });

    it('401 -> should return 401 if refresh token is invalid', async () => {
      await request(app).delete(devicesEndpoint).set('Cookie', ['refreshToken=wrong']).expect(401);
    });
  });

  describe('DELETE /security/devices/:deviceId', () => {
    const devicesEndpoint = '/security/devices';
    const loginEndpoint = '/auth/login';

    it('204 -> should delete specific device and return 204', async () => {
      // Create and activate user
      await request(app).post('/auth/registration').send(newUser).expect(204);
      await userCollection.updateOne(
        { login: newUser.login },
        { $set: { 'emailConfirmation.isConfirmed': true } }
      );

      //  Login to get deviceId
      const loginRes = await request(app)
        .post(loginEndpoint)
        .send({ loginOrEmail: newUser.login, password: newUser.password })
        .expect(200);

      const cookie = loginRes.headers['set-cookie'];

      //  Get the deviceId from the list
      const devicesRes = await request(app).get(devicesEndpoint).set('Cookie', cookie);
      const deviceIdToDelete = devicesRes.body[0].deviceId;

      //  Delete this specific device
      await request(app)
        .delete(`${devicesEndpoint}/${deviceIdToDelete}`)
        .set('Cookie', cookie)
        .expect(204);

      await request(app).get(devicesEndpoint).set('Cookie', cookie).expect(401);
    });

    it("403 -> should return 403 if trying to delete another user's device", async () => {
      //  Create two users
      const user1 = { login: 'user1', email: 'u1@test.com', password: 'password123' };
      const user2 = { login: 'user2', email: 'u2@test.com', password: 'password123' };

      await request(app).post('/auth/registration').send(user1);
      await request(app).post('/auth/registration').send(user2);
      await userCollection.updateMany({}, { $set: { 'emailConfirmation.isConfirmed': true } });

      //  Login User 1 and get his deviceId
      const loginRes1 = await request(app)
        .post(loginEndpoint)
        .send({ loginOrEmail: user1.login, password: user1.password });
      const devicesRes1 = await request(app)
        .get(devicesEndpoint)
        .set('Cookie', loginRes1.headers['set-cookie']);
      const deviceIdOfUser1 = devicesRes1.body[0].deviceId;

      // Login User 2
      const loginRes2 = await request(app)
        .post(loginEndpoint)
        .send({ loginOrEmail: user2.login, password: user2.password });
      const cookieUser2 = loginRes2.headers['set-cookie'];

      //User 2 tries to delete User 1's device
      await request(app)
        .delete(`${devicesEndpoint}/${deviceIdOfUser1}`)
        .set('Cookie', cookieUser2)
        .expect(403); // Forbidden!
    });

    it('404 -> should return 404 if deviceId does not exist', async () => {
      //  Ensure user exists and is confirmed so login succeeds
      await request(app).post('/auth/registration').send(newUser);
      await userCollection.updateOne(
        { login: newUser.login },
        { $set: { 'emailConfirmation.isConfirmed': true } }
      );

      //Login to get a valid session cookie
      const loginRes = await request(app)
        .post(loginEndpoint)
        .send({ loginOrEmail: newUser.login, password: newUser.password })
        .expect(200); // We must ensure login is successful

      const cookie = loginRes.headers['set-cookie'];

      //  Check if cookie is present to avoid the "undefined" error
      expect(cookie).toBeDefined();

      //  Try to delete a non-existent deviceId
      await request(app)
        .delete(`${devicesEndpoint}/65f1a2b3c4d5e6f7a8b9c0d1`)
        .set('Cookie', cookie!)
        .expect(404);
    });
  });
});
