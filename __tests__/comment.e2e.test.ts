import {createTestApp} from "./utils/testApp";
import {userTestHelper} from "./utils/user/user.test.helper";
import request from "supertest";
import {POSTS_PATH, USER_PATH} from "../src/core/paths/paths";
import {SETTINGS} from "../src/core/setting/settings";
import {getJwtTokenTest} from "./utils/auth/auth.test.helper";
import {createBlog} from "./utils/blog/blog-create.test.helper";
import { ObjectId } from 'mongodb';

describe('comment entity' , () => {

    const app = createTestApp()
    const ctx = {
        blogId: '',
        postId: '',
        userToken: '',
        userPass:'',
        userLogin:'',
    };

    beforeEach(async () => {

        const blog = await createBlog(app);
        ctx.blogId = blog.id;

        const user = userTestHelper.createUserDto({})
        const createdUser = await request(app)
            .post(USER_PATH)
            .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
            .send({
                login: user.login,
                email: user.email,
                password: user.pass
            })
            .expect(201)

        ctx.userPass =user.pass
        ctx.userLogin =user.login

        ctx.userToken = await getJwtTokenTest(app, createdUser.body.email, user.pass);

        const PostDto = {
            title: 'Post title',
            shortDescription: 'Short desc',
            content: 'Post content',
            blogId: ctx.blogId,
        };
        const resPost = await request(app)
            .post(POSTS_PATH)
            .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
            .send(PostDto)
            .expect(201);

        ctx.postId = resPost.body.id;
    });


    describe('Comment GET by id',()=>{
        it('should return comment by id', async ()=>{
            const commentRes = await request(app)
                .post(`${POSTS_PATH}/${ctx.postId}/comments`)
                .set('Authorization', `Bearer ${ctx.userToken}`)
                .send({ content: 'Mycommentstringstringstringststrststringststringstringstringst' })
                .expect(201);


            const commentId = commentRes.body.id;

            const res = await request(app)
                .get(`/comments/${commentId}`)
                .expect(200);

            expect(res.body.id).toBe(commentId);
            expect(res.body.content).toBe(commentRes.body.content);
            expect(res.body.commentatorInfo.userId).toBe(commentRes.body.commentatorInfo.userId);
            expect(res.body.commentatorInfo.userLogin).toBe(ctx.userLogin);


        })
    })
    describe('Comment PUT' , () => {
        it('should update own comment', async () => {

            const commentRes = await request(app)
                .post(`${POSTS_PATH}/${ctx.postId}/comments`)
                .set('Authorization', `Bearer ${ctx.userToken}`)
                .send({ content: 'Original comment content' })
                .expect(201);

            const commentId = commentRes.body.id;

            await request(app)
                .put(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${ctx.userToken}`)
                .send({ content: 'Updated comment content' })
                .expect(204);

            const getRes = await request(app)
                .get(`/comments/${commentId}`)
                .expect(200);

            expect(getRes.body.content).toBe('Updated comment content');
            expect(getRes.body.commentatorInfo.userLogin).toBe(ctx.userLogin);
        });

        it('should not allow updating someone else\'s comment', async () => {
            const otherUser = userTestHelper.createUserDto({
                login: 'testDrive',
                email: 'testik@gmail.com',
                pass:'123456789'
            });

            const createdOtherUser = await request(app)
                .post(USER_PATH)
                .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                .send({
                    login: otherUser.login,
                    email: otherUser.email,
                    password: otherUser.pass
                })
                .expect(201)

            const otherToken = await getJwtTokenTest(app, createdOtherUser.body.email, otherUser.pass);

            const commentRes = await request(app)
                .post(`${POSTS_PATH}/${ctx.postId}/comments`)
                .set('Authorization', `Bearer ${otherToken}`)
                .send({ content: 'Other user commentOther user commentOther user commentOther user comment' })
                .expect(201);

            const commentId = commentRes.body.id;

            await request(app)
                .put(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${ctx.userToken}`)
                .send({ content: 'Trying to editOther user commentOther user commentOther user comment' })
                .expect(403);

        });

        it('should return 400 if content is invalid', async () => {
            const commentRes = await request(app)
                .post(`${POSTS_PATH}/${ctx.postId}/comments`)
                .set('Authorization', `Bearer ${ctx.userToken}`)
                .send({ content: 'ValidValid contentValid contentValid contentValid content' })
                .expect(201);

            const commentId = commentRes.body.id;

            await request(app)
                .put(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${ctx.userToken}`)
                .send({ content: '' }) // некорректное значение
                .expect(400);
        });


        it('should return 404 if comment does not exist', async () => {
            const fakeCommentId = new ObjectId().toString();

            await request(app)
                .put(`/comments/${fakeCommentId}`)
                .set('Authorization', `Bearer ${ctx.userToken}`)
                .send({ content: 'Any contentAny contentAny contentAny contentAny contentAny content' })
                .expect(404);
        });

    })

})