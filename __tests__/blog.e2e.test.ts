import request from "supertest";
import {createTestApp} from "./utils/testApp";
import {BLOGS_PATH, POSTS_PATH} from "../src/core/paths/paths";
import {SETTINGS} from "../src/core/setting/settings";
import {createBlogList} from "./utils/blog/blogList.test.helper";
import {createPostList} from "./utils/post/post.test.helper";


describe('blog entity' , () => {

   const app = createTestApp()


    it('main endPoint', async () => {
        await request(app)
            .get('/')
            .expect(200);
    });

    const validBlogDto = {
        name: 'My Blog',
        description: 'About programming',
        websiteUrl: 'https://example.com',
    };

   describe('Blog POST create' , () => {

       it('should return entity ' ,async () => {
           const res = await request(app)
               .post(BLOGS_PATH)
               .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
               .send(validBlogDto)
               .expect(201);

           expect(res.body).toEqual({
               id: expect.any(String),
               name: validBlogDto.name,
               description: validBlogDto.description,
               websiteUrl: validBlogDto.websiteUrl,
               createdAt: expect.any(String),
               isMembership: false,
           });
       })

       it('should return 400 if name is empty', async () => {
           await request(app)
               .post(BLOGS_PATH)
               .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
               .send({
                   ...validBlogDto,
                   name: '',
               })
               .expect(400)
               .expect(res => {
                   expect(res.body.errorsMessages).toEqual(
                       expect.arrayContaining([
                           expect.objectContaining({
                               field: 'name',
                               message: expect.any(String),
                           }),
                       ]),
                   );
               });
       });

       it('should return 400 if websiteUrl is invalid', async () => {
           await request(app)
               .post(BLOGS_PATH)
               .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
               .send({
                   ...validBlogDto,
                   websiteUrl: 'invalid-url',
               })
               .expect(400)
               .expect(res => {
                   expect(res.body.errorsMessages).toEqual(
                       expect.arrayContaining([
                           expect.objectContaining({
                               field: 'websiteUrl',
                               message: "Regex"
                           }),
                       ]),
                   );
               });
       });

       it('should return 401 if no authorization header', async () => {
           await request(app)
               .post(BLOGS_PATH)
               .send(validBlogDto)
               .expect(401);
       });

   })

    describe('Blog POST->GET :id' , () => {
        it('should return blog by id', async () => {

            const resBlogEntity = await request(app)
                .post(BLOGS_PATH)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send(validBlogDto)
                .expect(201);


            const resGet = await request(app)
                .get(`${BLOGS_PATH}/${resBlogEntity.body.id}`)
                .expect(200);

            expect(resGet.body).toEqual({
                id: resBlogEntity.body.id,
                name: validBlogDto.name,
                description: validBlogDto.description,
                websiteUrl: validBlogDto.websiteUrl,
                createdAt: expect.any(String),
                isMembership: false,
            });

            expect(new Date(resGet.body.createdAt).toString()).not.toBe('Invalid Date');
        });

        it('should return 404 if blog does not exist', async () => {
            await request(app)
                .get(`${BLOGS_PATH}/999999999999999999999999`)
                .expect(404);
        });
    })

    describe('Blog PUT' , () => {

        it('POST ->PUT ->GET should update blog and return 204', async () => {

            const resBlogEntity = await request(app)
                .post(BLOGS_PATH)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send(validBlogDto)
                .expect(201);

            const createdBlogId = resBlogEntity.body.id

            const updateDto = {
                name: 'Updated Blog',
                description: 'Updated description',
                websiteUrl: 'https://updated.com',
            };

            await request(app)
                .put(`${BLOGS_PATH}/${createdBlogId}`)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send(updateDto)
                .expect(204);

            const res = await request(app)
                .get(`${BLOGS_PATH}/${createdBlogId}`)
                .expect(200);

            expect(res.body).toEqual({
                id: createdBlogId,
                ...updateDto,
                createdAt: expect.any(String),
                isMembership: false,
            });
        });

        it(' POST->PUT should return 400 if name is empty', async () => {

            const resBlogEntity = await request(app)
                .post(BLOGS_PATH)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send(validBlogDto)
                .expect(201);

            const createdBlogId = resBlogEntity.body.id

            await request(app)
                .put(`${BLOGS_PATH}/${createdBlogId}`)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send({
                    name: '',
                    description: 'desc',
                    websiteUrl: 'https://valid.com',
                })
                .expect(400)
                .expect(res => {
                    expect(res.body.errorsMessages).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({ field: 'name', message: expect.any(String) }),
                        ]),
                    );
                });
        });

        it(' POST->PUT should return 400 if websiteUrl is invalid', async () => {
            const resBlogEntity = await request(app)
                .post(BLOGS_PATH)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send(validBlogDto)
                .expect(201);

            const createdBlogId = resBlogEntity.body.id
            await request(app)
                .put(`${BLOGS_PATH}/${createdBlogId}`)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send({
                    name: 'Valid Name',
                    description: 'desc',
                    websiteUrl: 'invalid-url',
                })
                .expect(400)
                .expect(res => {
                    expect(res.body.errorsMessages).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({ field: 'websiteUrl', message: expect.any(String) }),
                        ]),
                    );
                });
        });

        it('401 if no authorization header', async () => {
            const resBlogEntity = await request(app)
                .post(BLOGS_PATH)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send(validBlogDto)
                .expect(201);

            const createdBlogId = resBlogEntity.body.id
            await request(app)
                .put(`${BLOGS_PATH}/${createdBlogId}`)
                .send({
                    name: 'Updated',
                    description: 'desc',
                    websiteUrl: 'https://valid.com',
                })
                .expect(401);
        });

        it('should return 404 if blog does not exist', async () => {
            const validButNotExistingMongoId = '507f1f77bcf86cd799439011';
            await request(app)
                .put(`${BLOGS_PATH}/${validButNotExistingMongoId}`)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send({
                    name: 'Updated',
                    description: 'desc',
                    websiteUrl: 'https://valid.com',
                })
                .expect(404);
        });

    })

    describe('Blog POST->DELETE' ,() => {

        it('should delete blog by id' , async () => {

            const res = await request(app)
                .post(BLOGS_PATH)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send(validBlogDto)
                .expect(201);

            await  request(app)
                .delete(`${BLOGS_PATH}/${res.body.id}`)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .expect(204)

        })

        it('should return 404 if blog does not exist', async () => {
            const validButNotExistingMongoId = '507f1f77bcf86cd799439011';
            await request(app)
                .delete(`${BLOGS_PATH}/${validButNotExistingMongoId}`)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .expect(404);
        });



    })

    describe('Blog GetList', () => {

        it('should return paginated blogs list with default params', async () => {

            const blogList = await createBlogList(5);

            await Promise.all(
                blogList.map(blog =>
                    request(app)
                        .post(BLOGS_PATH)
                        .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                        .send({
                            name: blog.name,
                            description: blog.description,
                            websiteUrl: blog.websiteUrl
                        })
                        .expect(201)
                )
            );
            const res = await request(app)
                .get(BLOGS_PATH)
                .expect(200);

            expect(res.body).toEqual({
                pagesCount: expect.any(Number),
                page: 1,
                pageSize: 10,
                totalCount: expect.any(Number),
                items: expect.any(Array),
            });
        });

        it('should filter blogs by searchNameTerm', async () => {

            const blogList = await createBlogList(4);

            await Promise.all(
                blogList.map(blog =>
                    request(app)
                        .post(BLOGS_PATH)
                        .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                        .send({
                            name: blog.name,
                            description: blog.description,
                            websiteUrl: blog.websiteUrl
                        })
                        .expect(201)
                )
            );

            const res = await request(app)
                .get(BLOGS_PATH)
                .query({ searchNameTerm: 'Mail' })
                .expect(200);


            expect(res.body.items.length).toBeGreaterThan(1);

            res.body.items.forEach((blog: any) => {
                expect(blog.name).toEqual(expect.stringContaining('blogMail'));
            });
        });


    })

    describe('Blog , create PostEntity BlogPOST -> BlogPostPOST ', () => {

        it('should return 201 create post by id', async () => {

            const blog = await request(app)
                .post(BLOGS_PATH)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send(validBlogDto)
                .expect(201);

           const blogId = blog.body.id

            const createRes = await request(app)
                .post(`${BLOGS_PATH}/${blogId}/posts`)
                .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                .send({
                    title: 'Post title',
                    shortDescription: 'Short desc',
                    content: 'Post content',
                })
                .expect(201);

            const postId = createRes.body.id;

            const res = await request(app)
                .get(`${POSTS_PATH}/${postId}`)
                .expect(200);

            // 3. проверяем контракт
            expect(res.body).toEqual({
                id: postId,
                title: 'Post title',
                shortDescription: 'Short desc',
                content: 'Post content',
                blogId: blogId,
                blogName: expect.any(String),
                createdAt: expect.any(String),
            });
        });

        it('should return 400 if title is empty', async () => {

            const blog = await request(app)
                .post(BLOGS_PATH)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send(validBlogDto)
                .expect(201);

            const blogId = blog.body.id

            await request(app)
                .post(`${BLOGS_PATH}/${blogId}/posts`)
                .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                .send({
                    title: '',
                    shortDescription: 'desc',
                    content: 'content',
                })
                .expect(400)
                .expect(res => {
                    expect(res.body.errorsMessages).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({ field: 'title' }),
                        ]),
                    );
                });
        });

        it('should return 401 if no authorization header', async () =>{
            const validButNotExistingBlogId = '507f1f77bcf86cd799439011';

            await request(app)
                .post(`${BLOGS_PATH}/${validButNotExistingBlogId}/posts`)
                .expect(401);
        });

        it('should return 404 if blog does not exist', async () => {
            const validButNotExistingBlogId = '507f1f77bcf86cd799439011';

            await request(app)
                .post(`${BLOGS_PATH}/${validButNotExistingBlogId}/posts`)
                .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                .send({
                    title: 'Post',
                    shortDescription: 'desc',
                    content: 'content',
                })
                .expect(404);
        });

    })

    describe('Blog getAll Posts for Blog', () => {
        const postsToCreateList = createPostList(3);

        it('should return posts for specific blog with pagination', async () => {


            const blog = await request(app)
                .post(BLOGS_PATH)
                .auth(SETTINGS.ADMIN_USER,SETTINGS.ADMIN_PASSWORD)
                .send(validBlogDto)
                .expect(201);

            const blogId = blog.body.id

            await Promise.all(
                postsToCreateList.map(post =>
                    request(app)
                        .post(`${BLOGS_PATH}/${blogId}/posts`)
                        .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
                        .send({
                            title: post.title,
                            shortDescription: post.shortDescription,
                            content: post.content,
                        })
                        .expect(201)
                )
            );

            const res = await request(app)
                .get(`${BLOGS_PATH}/${blogId}/posts`)
                .query({ pageNumber: 1, pageSize: 2 })
                .expect(200);

            expect(res.body.page).toBe(1);
            expect(res.body.pageSize).toBe(2);
            expect(res.body.totalCount).toBe(3);
            expect(res.body.items).toHaveLength(2);

            res.body.items.forEach((post: any) => {
                expect(post.blogId).toBe(blogId);
            });
        });

        it('should return 404 if blog does not exist', async () => {
            const validButNotExistingBlogId = '507f1f77bcf86cd799439011';

            await request(app)
                .get(`${BLOGS_PATH}/${validButNotExistingBlogId}/posts`)
                .expect(404);
        });

    })


})