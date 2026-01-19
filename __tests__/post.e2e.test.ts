import { ObjectId } from 'mongodb';
import request from "supertest";
import {createTestApp} from "./utils/testApp";
import {createBlog} from "./utils/blog/blog-create.test.helper";
import {POSTS_PATH, USER_PATH} from "../src/core/paths/paths";
import {SETTINGS} from "../src/core/setting/settings";
import {createPostList} from "./utils/post/postList.test.helper";
import {userTestHelper} from "./utils/user/user.test.helper";
import {getJwtTokenTest} from "./utils/auth/auth.test.helper";
import {createCommentsForPost} from "./utils/comment/commentList.test.helper";

describe('post entity' , () => {

        const app = createTestApp()

        const ctx = {
            blogId: '',
            blogName: '',
        };

        beforeEach(async () => {
            const blog = await createBlog(app);
            ctx.blogName = blog.name;
            ctx.blogId = blog.id;
        });

        it('main endPoint', async () => {
            await request(app)
                .get('/')
                .expect(200);
        });

        describe('Post create POST' ,  () => {

            it('should create post with existing blogId', async () => {
                const dto = {
                    title: 'Post title',
                    shortDescription: 'Short desc',
                    content: 'Post content',
                    blogId: ctx.blogId,
                };

                const res = await request(app)
                    .post(POSTS_PATH)
                    .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                    .send(dto)
                    .expect(201);

                expect(res.body).toEqual({
                    id: expect.any(String),
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: ctx.blogId,
                    blogName: ctx.blogName,
                    createdAt: expect.any(String),
                });
            });

            it('should return 401 if user is not authorized', async () => {
                await request(app)
                    .post(POSTS_PATH)
                    .send({
                        title: 'Post',
                        shortDescription: 'Desc',
                        content: 'Content',
                        blogId: ctx.blogId,
                    })
                    .expect(401);
            });

            it('should return 400 if title is invalid', async () => {
                const res = await request(app)
                    .post(POSTS_PATH)
                    .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                    .send({
                        title: '',
                        shortDescription: 'Desc',
                        content: 'Content',
                        blogId: ctx.blogId,
                    })
                    .expect(400);

                expect(res.body.errorsMessages).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ field: 'title' }),
                    ]),
                );
            });



        })

        describe('Post POST->GET by id', ()=>{

            it('should return post by id', async () => {
                const createRes = await request(app)
                    .post(POSTS_PATH)
                    .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                    .send({
                        title: 'Post title',
                        shortDescription: 'Short desc',
                        content: 'Post content',
                        blogId: ctx.blogId,
                    })
                    .expect(201);

                const postId = createRes.body.id;

                const res = await request(app)
                    .get(`${POSTS_PATH}/${postId}`)
                    .expect(200);

                expect(res.body).toEqual({
                    id: postId,
                    title: 'Post title',
                    shortDescription: 'Short desc',
                    content: 'Post content',
                    blogId: ctx.blogId,
                    blogName: ctx.blogName,
                    createdAt: expect.any(String),
                });
            });

            it('should return 404 if post does not exist', async () => {
                const nonExistingPostId = new ObjectId().toString();

                await request(app)
                    .get(`${POSTS_PATH}/${nonExistingPostId}`)
                    .expect(404);
            });


        })

        describe('Post POST->PUT', () => {

            it('should update post by id', async () => {
                const createRes = await request(app)
                    .post(POSTS_PATH)
                    .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                    .send({
                        title: 'Old title',
                        shortDescription: 'Old desc',
                        content: 'Old content',
                        blogId: ctx.blogId,
                    })
                    .expect(201);

                const postId = createRes.body.id;

                await request(app)
                    .put(`${POSTS_PATH}/${postId}`)
                    .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                    .send({
                        title: 'New title',
                        shortDescription: 'New desc',
                        content: 'New content',
                        blogId: ctx.blogId,
                    })
                    .expect(204);

                const getRes = await request(app)
                    .get(`${POSTS_PATH}/${postId}`)
                    .expect(200);

                expect(getRes.body.title).toBe('New title');
                expect(getRes.body.shortDescription).toBe('New desc');
                expect(getRes.body.content).toBe('New content');
            });

            it('should return 404 if post does not exist', async () => {
                const nonExistingPostId = new ObjectId().toString();

                await request(app)
                    .put(`${POSTS_PATH}/${nonExistingPostId}`)
                    .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                    .send({
                        title: 'Title',
                        shortDescription: 'Desc',
                        content: 'Content',
                        blogId: ctx.blogId,
                    })
                    .expect(404);
            });

            it('should return 400 if title is invalid', async () => {
                const createRes = await request(app)
                    .post(POSTS_PATH)
                    .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                    .send({
                        title: 'Title',
                        shortDescription: 'Desc',
                        content: 'Content',
                        blogId: ctx.blogId,
                    })
                    .expect(201);

                const res = await request(app)
                    .put(`${POSTS_PATH}/${createRes.body.id}`)
                    .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                    .send({
                        title: '',
                        shortDescription: 'Desc',
                        content: 'Content',
                        blogId: ctx.blogId,
                    })
                    .expect(400);

                expect(res.body.errorsMessages).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ field: 'title' }),
                    ]),
                );
            });



        })

        describe('Post POST->DELETE->GET',()=>{
            it('should delete post by id', async () => {
                const createRes = await request(app)
                    .post(POSTS_PATH)
                    .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                    .send({
                        title: 'Post title',
                        shortDescription: 'Desc',
                        content: 'Content',
                        blogId: ctx.blogId,
                    })
                    .expect(201);

                const postId = createRes.body.id;

                await request(app)
                    .delete(`${POSTS_PATH}/${postId}`)
                    .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                    .expect(204);

                await request(app)
                    .get(`${POSTS_PATH}/${postId}`)
                    .expect(404);
            });

            it('should return 401 if not authorized', async () => {
                const createRes = await request(app)
                    .post(POSTS_PATH)
                    .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                    .send({
                        title: 'Post',
                        shortDescription: 'Desc',
                        content: 'Content',
                        blogId: ctx.blogId,
                    })
                    .expect(201);

                await request(app)
                    .delete(`${POSTS_PATH}/${createRes.body.id}`)
                    .expect(401);
            });


            it('should return 404 if post does not exist', async () => {
                const nonExistingPostId = new ObjectId().toString();

                await request(app)
                    .delete(`${POSTS_PATH}/${nonExistingPostId}`)
                    .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                    .expect(404);
            });

        })

        describe('Post GET List' , () =>{

            it('should return posts with pagination', async () => {

                const postList = createPostList(ctx.blogId,5)

                await Promise.all(
                    postList.map(post =>
                        request(app)
                            .post(POSTS_PATH)
                            .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                            .send(post)
                            .expect(201)
                    ))

                const res = await request(app)
                    .get(POSTS_PATH)  // /posts
                    .query({
                        pageNumber: 2,
                        pageSize: 2,
                        sortBy: 'createdAt',
                        sortDirection: 'desc',
                    })
                    .expect(200);

                expect(res.body.page).toBe(2);
                expect(res.body.pageSize).toBe(2);
                expect(res.body.totalCount).toBe(5);
                expect(res.body.pagesCount).toBe(3);
                expect(res.body.items).toHaveLength(2);

                res.body.items.forEach((post: any) => {
                    expect(post.blogId).toBe(ctx.blogId);
                    expect(post.id).toBeDefined();
                    expect(post.title).toBeDefined();
                });
            });

        })

        describe('Post create comment', () => {

            it('should return comment POST User -> AUTH Login -> POST Post -> Post Comment',async () =>{
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

                const token = await getJwtTokenTest(app, createdUser.body.email, user.pass);

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

                const commentRes = await request(app)
                    .post(`${POSTS_PATH}/${resPost.body.id}/comments`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ content: 'Mycommentstringstringstringststrststringststringstringstringst' })
                    .expect(201);

                expect(commentRes.body.commentatorInfo.userId).toBe(createdUser.body.id)
                expect(commentRes.body.commentatorInfo.userLogin).toBe(createdUser.body.login)

            })

            it('should return pagination comment POST User -> AUTH Login -> POST Post -> Post Comment',async () =>{
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

                const token = await getJwtTokenTest(app, createdUser.body.email, user.pass);

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

                const postId = resPost.body.id;

                await createCommentsForPost(app, postId, token, 5);

                const res = await request(app)
                    .get(`/posts/${postId}/comments`)
                    .query({ pageNumber: 2, pageSize: 2, sortBy: 'createdAt', sortDirection: 'desc' })
                    .expect(200);

                expect(res.body.page).toBe(2);
                expect(res.body.pageSize).toBe(2);
                expect(res.body.totalCount).toBe(5);
                expect(res.body.pagesCount).toBe(3);
                expect(res.body.items).toHaveLength(2);

                res.body.items.forEach((comment: any) => {
                    expect(comment.id).toBeDefined();
                    expect(comment.content).toBeDefined();
                    expect(comment.commentatorInfo.userId).toBe(createdUser.body.id);
                });

            })

        })
}
)