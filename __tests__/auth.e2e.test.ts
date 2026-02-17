import request from 'supertest';
import { createTestApp } from './utils/testApp';
import { userCollection } from '../src/db/mongo.db';
import { takeCodeByCreateMockUser } from './helpers/codeConfirmation.helper';
import { userRepository } from '../src/entities/user/repositories/user.repository';

describe('auth endpoint', () => {
  const app = createTestApp();

  it('main endPoint', async () => {
    await request(app).get('/').expect(200);
  });

  const newUser = {
    login: 'test',
    password: 'password123',
    email: 'example@example.dev',
  };

  describe('auth registration', () => {
    it('204 → Correct data, letter sent', async () => {
      await request(app)
        .post('/auth/registration')
        .send({
          login: newUser.login,
          password: newUser.password,
          email: newUser.email,
        })
        .expect(204);
    });

    it('400 → if the inputModel is incorrect (login or email is already taken)', async () => {
      const res = await request(app)
        .post('/auth/registration')
        .send({
          login: 'bad',
          password: '123',
          email: 'not-an-email',
        })
        .expect(400);

      expect(res.body.errorsMessages).toBeInstanceOf(Array);
      expect(res.body.errorsMessages[0]).toEqual(
        expect.objectContaining({
          message: expect.any(String),
          field: expect.any(String),
        })
      );
    });

    it('429 → more than 5 attempts from one IP in 10 seconds', async () => {
      for (let i = 0; i < 5; i++) {
        await request(app).post('/auth/registration').send(newUser);
      }

      await request(app).post('/auth/registration').send(newUser).expect(429);

      //Test passes but commented to avoid long execution time
      // await new Promise((resolve) => setTimeout(resolve, 11000));
      // const newUser2 = {
      //   login: 'test2',
      //   password: 'password123',
      //   email: 'example2@example.dev',
      // };
      //
      // await request(app).post('/auth/registration').send(newUser2).expect(204);
    });
  });

  describe('auth login', () => {
    it('200 → returns the accessToken and refreshToken cookies', async () => {
      await request(app)
        .post('/auth/registration')
        .send({
          login: newUser.login,
          password: newUser.password,
          email: newUser.email,
        })
        .expect(204);

      const res = await request(app)
        .post('/auth/login')
        .send({
          loginOrEmail: newUser.login,
          password: newUser.password,
        })
        .expect(200);

      expect(res.body).toEqual({
        accessToken: expect.any(String),
      });

      const cookies = res.headers['set-cookie'];

      expect(cookies).toBeDefined();

      expect(cookies).toContainEqual(expect.stringContaining('refreshToken'));

      expect(cookies).toContainEqual(expect.stringContaining('HttpOnly'));
    });

    it('400 → if inputModel is incorrect', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          loginOrEmail: '',
          password: '',
        })
        .expect(400);

      expect(res.body.errorsMessages).toBeInstanceOf(Array);
      expect(res.body.errorsMessages.length).toBeGreaterThan(0);
    });

    it('429 → more than 5 attempts from one IP in 10 seconds', async () => {
      for (let i = 0; i < 5; i++) {
        await request(app).post('/auth/login').send(newUser);
      }

      await request(app).post('/auth/login').send(newUser).expect(429);
    });
  });

  describe('auth registration-confirmation', () => {
    const endpoint = '/auth/registration-confirmation';

    it('204 -> should confirm email and activate account with correct code', async () => {
      const { id, code } = await takeCodeByCreateMockUser();

      const firstTry = await userRepository.findUserById(id);
      expect(firstTry).not.toBeNull();
      expect(firstTry?.emailConfirmation.isConfirmed).toBe(false);

      await request(app).post(endpoint).send({ code }).expect(204);

      const secondTry = await userRepository.findUserById(id);
      expect(secondTry?.emailConfirmation.isConfirmed).toBe(true);
    });

    it('400 -> should return error if confirmation code is incorrect, expired or already applied', async () => {
      const res = await request(app)
        .post(endpoint)
        .send({ code: 'invalid-or-expired-code' })
        .expect(400);

      expect(res.body.errorsMessages).toContainEqual(
        expect.objectContaining({
          message: expect.any(String),
          field: 'code',
        })
      );
    });

    it('429 -> should return error if more than 5 attempts from one IP-address during 10 seconds', async () => {
      const payload = { code: 'any-code' };

      for (let i = 0; i < 5; i++) {
        await request(app).post(endpoint).send(payload);
      }

      await request(app).post(endpoint).send(payload).expect(429);
    });
  });

  describe('auth registration-email-resending', () => {
    const endpoint = '/auth/registration-email-resending';

    it('204 -> should resend confirmation email if user exists but not confirmed yet', async () => {
      const { email } = await takeCodeByCreateMockUser();

      await request(app).post(endpoint).send({ email }).expect(204);
    });

    it('400 -> should return error if email is incorrect, already confirmed or doesn’t exist', async () => {
      //non existent email
      await request(app).post(endpoint).send({ email: 'non-existent@test.com' }).expect(400);
      //invalid email
      const resInvalid = await request(app)
        .post(endpoint)
        .send({ email: 'not-an-email' })
        .expect(400);

      expect(resInvalid.body.errorsMessages).toContainEqual(
        expect.objectContaining({
          field: 'email',
        })
      );
    });

    it('429 -> should return error if more than 5 attempts from one IP during 10 seconds', async () => {
      const payload = { email: 'any@mail.com' };

      for (let i = 0; i < 5; i++) {
        await request(app).post(endpoint).send(payload);
      }

      await request(app).post(endpoint).send(payload).expect(429);
    });
  });

  describe('auth logout', () => {
    const logoutEndpoint = '/auth/logout';
    const loginEndpoint = '/auth/login';

    it('204 -> should logout user and clear cookies', async () => {
      //  Register a new user
      await request(app)
        .post('/auth/registration')
        .send({
          login: newUser.login,
          password: newUser.password,
          email: newUser.email,
        })
        .expect(204);

      //  Manually activate user in DB or via confirmation endpoint to allow login
      await userCollection.updateOne(
        { login: newUser.login },
        { $set: { 'emailConfirmation.isConfirmed': true } }
      );

      //  Login to receive valid tokens
      const loginRes = await request(app)
        .post(loginEndpoint)
        .send({
          loginOrEmail: newUser.login,
          password: newUser.password,
        })
        .expect(200);

      const cookie = loginRes.headers['set-cookie'];

      // Send logout request with the received cookie
      const logoutRes = await request(app).post(logoutEndpoint).set('Cookie', cookie).expect(204);

      // Check if the cookie is being cleared (sent back as empty)
      const logoutCookies = logoutRes.headers['set-cookie'];
      expect(logoutCookies).toBeDefined();
      expect(logoutCookies[0]).toContain('refreshToken=;');
    });

    it('401 -> should return 401 if refreshToken in cookie is missing, expired or incorrect', async () => {
      //  Request without any cookies
      await request(app).post(logoutEndpoint).expect(401);

      //  Request with an invalid/malformed cookie
      await request(app)
        .post(logoutEndpoint)
        .set('Cookie', ['refreshToken=wrong-token-value'])
        .expect(401);
    });
  });

  describe('auth me', () => {
    const meEndpoint = '/auth/me';
    const loginEndpoint = '/auth/login';

    it('200 -> should return current user data with valid access token', async () => {
      // Register a new user
      await request(app)
        .post('/auth/registration')
        .send({
          login: newUser.login,
          password: newUser.password,
          email: newUser.email,
        })
        .expect(204);

      //  Manually activate user in DB
      await userCollection.updateOne(
        { login: newUser.login },
        { $set: { 'emailConfirmation.isConfirmed': true } }
      );

      // Login to get the accessToken
      const loginRes = await request(app)
        .post(loginEndpoint)
        .send({
          loginOrEmail: newUser.login,
          password: newUser.password,
        })
        .expect(200);

      const accessToken = loginRes.body.accessToken;

      const user = await userCollection.findOne({ login: newUser.login });

      const res = await request(app)
        .get(meEndpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Assert the response body matches the user data
      expect(res.body).toEqual({
        email: newUser.email,
        login: newUser.login,
        userId: user!._id.toString(),
      });
    });

    it('401 -> should not return user data if access token is invalid', async () => {
      await request(app).get(meEndpoint).set('Authorization', `Bearer invalid-token`).expect(401);
    });

    it('401 -> should return 401 if access token is missing, invalid or expired', async () => {
      //  No token provided
      await request(app).get(meEndpoint).expect(401);

      // Invalid token provided
      await request(app)
        .get(meEndpoint)
        .set('Authorization', 'Bearer invalid_token_here')
        .expect(401);
    });
  });

  describe('auth refresh-token', () => {
    const refreshEndpoint = '/auth/refresh-token';
    const loginEndpoint = '/auth/login';

    it('200 -> should generate new pair of tokens and revoke old refresh token', async () => {
      //  Register a new user
      await request(app)
        .post('/auth/registration')
        .send({
          login: newUser.login,
          password: newUser.password,
          email: newUser.email,
        })
        .expect(204);

      // Manually activate user in DB
      await userCollection.updateOne(
        { login: newUser.login },
        { $set: { 'emailConfirmation.isConfirmed': true } }
      );

      //  Login to get the initial pair of tokens
      const loginRes = await request(app)
        .post(loginEndpoint)
        .send({
          loginOrEmail: newUser.login,
          password: newUser.password,
        })
        .expect(200);

      const firstRefreshToken = loginRes.headers['set-cookie'];

      // Optional: small delay to ensure LastActiveDate actually changes
      await new Promise((resolve) => setTimeout(resolve, 1000));

      //  use the refresh token to get a new pair
      const refreshRes = await request(app)
        .post(refreshEndpoint)
        .set('Cookie', firstRefreshToken)
        .expect(200);

      // Assert: Check new access token and new cookie
      expect(refreshRes.body).toEqual({
        accessToken: expect.any(String),
      });

      const secondRefreshToken = refreshRes.headers['set-cookie'];
      expect(secondRefreshToken).toBeDefined();
      expect(secondRefreshToken[0]).toContain('refreshToken');

      // Verify that the new cookie is different from the old one
      expect(secondRefreshToken[0]).not.toBe(firstRefreshToken[0]);

      //  Assert: Try to use the OLD refresh token again (it must be revoked/expired)
      await request(app).post(refreshEndpoint).set('Cookie', firstRefreshToken).expect(401);
    });

    it('401 -> should return 401 if refresh token is missing or incorrect', async () => {
      //  No cookie provided
      await request(app).post(refreshEndpoint).expect(401);

      // Invalid cookie provided
      await request(app)
        .post(refreshEndpoint)
        .set('Cookie', ['refreshToken=invalid_token_value'])
        .expect(401);
    });
  });
});
