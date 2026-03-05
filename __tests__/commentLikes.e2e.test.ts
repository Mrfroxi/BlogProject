import request from 'supertest';
import { ObjectId } from 'mongodb';
import { createTestApp } from './utils/testApp';
import { createBlog } from './utils/blog/blog-create.test.helper';
import { POSTS_PATH, USER_PATH, COMMENT_PATH } from '../src/core/paths/paths';
import { SETTINGS } from '../src/core/setting/settings';

describe('Comment Likes', () => {
  const app = createTestApp();

  const ctx = {
    blogId: '',
    postId: '',
    comment1Id: '',
    comment2Id: '',
    comment3Id: '',
    comment4Id: '',
    comment5Id: '',
    comment6Id: '',
    user1Token: '',
    user2Token: '',
    user3Token: '',
    user4Token: '',
    user1Id: '',
    user2Id: '',
    user3Id: '',
    user4Id: '',
  };

  beforeEach(async () => {
    // Create blog
    const blog = await createBlog(app);
    ctx.blogId = blog.id;

    // Create post
    const postDto = {
      title: 'Test Post',
      shortDescription: 'Test Description',
      content: 'Test Content',
      blogId: ctx.blogId,
    };
    const postRes = await request(app)
      .post(POSTS_PATH)
      .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
      .send(postDto)
      .expect(201);
    ctx.postId = postRes.body.id;

    // Create 4 users
    for (let i = 1; i <= 4; i++) {
      const userRes = await request(app)
        .post(USER_PATH)
        .auth(SETTINGS.ADMIN_USER, SETTINGS.ADMIN_PASSWORD)
        .send({
          login: `user${i}test`,
          email: `user${i}@test.com`,
          password: 'password123',
        })
        .expect(201);

      const loginRes = await request(app)
        .post('/auth/login')
        .send({ loginOrEmail: `user${i}@test.com`, password: 'password123' })
        .expect(200);
      
      if (i === 1) ctx.user1Token = loginRes.body.accessToken;
      if (i === 2) ctx.user2Token = loginRes.body.accessToken;
      if (i === 3) ctx.user3Token = loginRes.body.accessToken;
      if (i === 4) ctx.user4Token = loginRes.body.accessToken;
    }

    // Create 6 comments from user1
    for (let i = 1; i <= 6; i++) {
      const commentRes = await request(app)
        .post(`${POSTS_PATH}/${ctx.postId}/comments`)
        .set('Authorization', `Bearer ${ctx.user1Token}`)
        .send({ content: `Comment ${i} with some text here` })
        .expect(201);
      
      if (i === 1) ctx.comment1Id = commentRes.body.id;
      if (i === 2) ctx.comment2Id = commentRes.body.id;
      if (i === 3) ctx.comment3Id = commentRes.body.id;
      if (i === 4) ctx.comment4Id = commentRes.body.id;
      if (i === 5) ctx.comment5Id = commentRes.body.id;
      if (i === 6) ctx.comment6Id = commentRes.body.id;
    }
  });

  it('should like comment 1 by user 1 and user 2', async () => {
    // User 1 likes comment 1
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment1Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // User 2 likes comment 1
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment1Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user2Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // Check comment from user1
    const commentRes = await request(app)
      .get(`${COMMENT_PATH}/${ctx.comment1Id}`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(commentRes.body.likesInfo.likesCount).toBe(2);
    expect(commentRes.body.likesInfo.dislikesCount).toBe(0);
    expect(commentRes.body.likesInfo.myStatus).toBe('Like');
  });

  it('should like comment 2 by user 2 and user 3', async () => {
    // User 2 likes comment 2
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment2Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user2Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // User 3 likes comment 2
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment2Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user3Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    const commentRes = await request(app)
      .get(`${COMMENT_PATH}/${ctx.comment2Id}`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(commentRes.body.likesInfo.likesCount).toBe(2);
    expect(commentRes.body.likesInfo.myStatus).toBe('None');
  });

  it('should dislike comment 3 by user 1', async () => {
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment3Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Dislike' })
      .expect(204);

    const commentRes = await request(app)
      .get(`${COMMENT_PATH}/${ctx.comment3Id}`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(commentRes.body.likesInfo.likesCount).toBe(0);
    expect(commentRes.body.likesInfo.dislikesCount).toBe(1);
    expect(commentRes.body.likesInfo.myStatus).toBe('Dislike');
  });

  it('should like comment 4 by user 1, user 4, user 2, user 3', async () => {
    // All 4 users like comment 4
    const users = [
      { token: ctx.user1Token },
      { token: ctx.user4Token },
      { token: ctx.user2Token },
      { token: ctx.user3Token },
    ];

    for (const user of users) {
      await request(app)
        .put(`${COMMENT_PATH}/${ctx.comment4Id}/like-status`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
    }

    const commentRes = await request(app)
      .get(`${COMMENT_PATH}/${ctx.comment4Id}`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(commentRes.body.likesInfo.likesCount).toBe(4);
    expect(commentRes.body.likesInfo.dislikesCount).toBe(0);
    expect(commentRes.body.likesInfo.myStatus).toBe('Like');
  });

  it('should like comment 5 by user 2 and dislike by user 3', async () => {
    // User 2 likes
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment5Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user2Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // User 3 dislikes
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment5Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user3Token}`)
      .send({ likeStatus: 'Dislike' })
      .expect(204);

    const commentRes = await request(app)
      .get(`${COMMENT_PATH}/${ctx.comment5Id}`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(commentRes.body.likesInfo.likesCount).toBe(1);
    expect(commentRes.body.likesInfo.dislikesCount).toBe(1);
    expect(commentRes.body.likesInfo.myStatus).toBe('None');
  });

  it('should like comment 6 by user 1 and dislike by user 2', async () => {
    // User 1 likes
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment6Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // User 2 dislikes
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment6Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user2Token}`)
      .send({ likeStatus: 'Dislike' })
      .expect(204);

    const commentRes = await request(app)
      .get(`${COMMENT_PATH}/${ctx.comment6Id}`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(commentRes.body.likesInfo.likesCount).toBe(1);
    expect(commentRes.body.likesInfo.dislikesCount).toBe(1);
    expect(commentRes.body.likesInfo.myStatus).toBe('Like');
  });

  it('should change like to dislike', async () => {
    // User 1 likes
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment1Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // User 1 changes to dislike
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment1Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Dislike' })
      .expect(204);

    const commentRes = await request(app)
      .get(`${COMMENT_PATH}/${ctx.comment1Id}`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(commentRes.body.likesInfo.likesCount).toBe(0);
    expect(commentRes.body.likesInfo.dislikesCount).toBe(1);
    expect(commentRes.body.likesInfo.myStatus).toBe('Dislike');
  });

  it('should remove like with None status', async () => {
    // User 1 likes
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment1Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // User 1 removes like
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment1Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'None' })
      .expect(204);

    const commentRes = await request(app)
      .get(`${COMMENT_PATH}/${ctx.comment1Id}`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(commentRes.body.likesInfo.likesCount).toBe(0);
    expect(commentRes.body.likesInfo.dislikesCount).toBe(0);
    expect(commentRes.body.likesInfo.myStatus).toBe('None');
  });

  it('should return 404 for non-existent comment', async () => {
    const fakeCommentId = new ObjectId().toString();

    await request(app)
      .put(`${COMMENT_PATH}/${fakeCommentId}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Like' })
      .expect(404);
  });

  it('should return 401 without authorization', async () => {
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment1Id}/like-status`)
      .send({ likeStatus: 'Like' })
      .expect(401);
  });

  it('should return myStatus None for user without token', async () => {
    // User 1 likes
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment1Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // Request without token
    const commentRes = await request(app)
      .get(`${COMMENT_PATH}/${ctx.comment1Id}`)
      .expect(200);

    expect(commentRes.body.likesInfo.likesCount).toBe(1);
    expect(commentRes.body.likesInfo.myStatus).toBe('None');
  });

  it('should get comments for post with correct likesInfo', async () => {
    // Like comment 1 by user 1, user 2
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment1Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment1Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user2Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // Dislike comment 3 by user 1
    await request(app)
      .put(`${COMMENT_PATH}/${ctx.comment3Id}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Dislike' })
      .expect(204);

    // Get comments for post
    const commentsRes = await request(app)
      .get(`${POSTS_PATH}/${ctx.postId}/comments`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(commentsRes.body.items).toBeDefined();
    expect(commentsRes.body.items.length).toBe(6);

    // Find comment 1
    const comment1 = commentsRes.body.items.find((c: any) => c.id === ctx.comment1Id);
    expect(comment1.likesInfo.likesCount).toBe(2);
    expect(comment1.likesInfo.myStatus).toBe('Like');

    // Find comment 3
    const comment3 = commentsRes.body.items.find((c: any) => c.id === ctx.comment3Id);
    expect(comment3.likesInfo.likesCount).toBe(0);
    expect(comment3.likesInfo.dislikesCount).toBe(1);
    expect(comment3.likesInfo.myStatus).toBe('Dislike');
  });
});
