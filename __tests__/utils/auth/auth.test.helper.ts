import request from "supertest";


export const getJwtTokenTest = async (app: any, loginOrEmail: string, password: string) => {
    const res = await request(app)
        .post('/auth/login')
        .send({ loginOrEmail, password })
        .expect(200);

    return res.body.accessToken;
};
