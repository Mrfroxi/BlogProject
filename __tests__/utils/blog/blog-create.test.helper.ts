import request from 'supertest';
import {BLOGS_PATH} from "../../../src/core/paths/paths";
import {SETTINGS} from "../../../src/core/setting/settings";


export const createBlog = async (app: any) => {
    const res = await request(app)
        .post(BLOGS_PATH)
        .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
        .send({
            name:'Test blog',
            description: 'Description',
            websiteUrl: 'https://example.com',
        })
        .expect(201);

    return res.body;
};
