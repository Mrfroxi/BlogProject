import request from 'supertest';
import { ObjectId } from 'mongodb';
import { createTestApp } from './utils/testApp';
import { createBlog } from './utils/blog/blog-create.test.helper';
import { POSTS_PATH, USER_PATH } from '../src/core/paths/paths';
import { SETTINGS } from '../src/core/setting/settings';

describe('Post Likes', () => {
  const app = createTestApp();

  const ctx = {
    blogId: '',
    postId: '',
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

    // Create 4 users and get their tokens
    const users = [];
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
      users.push(userRes.body);

      const loginRes = await request(app)
        .post('/auth/login')
        .send({ loginOrEmail: `user${i}@test.com`, password: 'password123' })
        .expect(200);

      if (i === 1) ctx.user1Token = loginRes.body.accessToken;
      if (i === 2) ctx.user2Token = loginRes.body.accessToken;
      if (i === 3) ctx.user3Token = loginRes.body.accessToken;
      if (i === 4) ctx.user4Token = loginRes.body.accessToken;
    }
  });

  it('should like post by user 1', async () => {
    const likeDto = { likeStatus: 'Like' };

    await request(app)
      .put(`${POSTS_PATH}/${ctx.postId}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send(likeDto)
      .expect(204);

    // Check post
    const postRes = await request(app)
      .get(`${POSTS_PATH}/${ctx.postId}`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(postRes.body.extendedLikesInfo.likesCount).toBe(1);
    expect(postRes.body.extendedLikesInfo.dislikesCount).toBe(0);
    expect(postRes.body.extendedLikesInfo.myStatus).toBe('Like');
    expect(postRes.body.extendedLikesInfo.newestLikes).toHaveLength(1);
    expect(postRes.body.extendedLikesInfo.newestLikes[0].userId).toBeDefined();
    expect(postRes.body.extendedLikesInfo.newestLikes[0].login).toBe('user1test');
  });

  it('should like post by multiple users', async () => {
    // User 1 likes
    await request(app)
      .put(`${POSTS_PATH}/${ctx.postId}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // User 2 likes
    await request(app)
      .put(`${POSTS_PATH}/${ctx.postId}/like-status`)
      .set('Authorization', `Bearer ${ctx.user2Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // User 3 likes
    await request(app)
      .put(`${POSTS_PATH}/${ctx.postId}/like-status`)
      .set('Authorization', `Bearer ${ctx.user3Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // Check from user 1
    const postRes = await request(app)
      .get(`${POSTS_PATH}/${ctx.postId}`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(postRes.body.extendedLikesInfo.likesCount).toBe(3);
    expect(postRes.body.extendedLikesInfo.dislikesCount).toBe(0);
    expect(postRes.body.extendedLikesInfo.myStatus).toBe('Like');
    expect(postRes.body.extendedLikesInfo.newestLikes).toHaveLength(3);
  });

  it('should change like to dislike', async () => {
    // User 1 likes
    await request(app)
      .put(`${POSTS_PATH}/${ctx.postId}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // User 1 changes to dislike
    await request(app)
      .put(`${POSTS_PATH}/${ctx.postId}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Dislike' })
      .expect(204);

    const postRes = await request(app)
      .get(`${POSTS_PATH}/${ctx.postId}`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(postRes.body.extendedLikesInfo.likesCount).toBe(0);
    expect(postRes.body.extendedLikesInfo.dislikesCount).toBe(1);
    expect(postRes.body.extendedLikesInfo.myStatus).toBe('Dislike');
    expect(postRes.body.extendedLikesInfo.newestLikes).toHaveLength(0);
  });

  it('should remove like with None status', async () => {
    // User 1 likes
    await request(app)
      .put(`${POSTS_PATH}/${ctx.postId}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // User 1 removes like
    await request(app)
      .put(`${POSTS_PATH}/${ctx.postId}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'None' })
      .expect(204);

    const postRes = await request(app)
      .get(`${POSTS_PATH}/${ctx.postId}`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(postRes.body.extendedLikesInfo.likesCount).toBe(0);
    expect(postRes.body.extendedLikesInfo.dislikesCount).toBe(0);
    expect(postRes.body.extendedLikesInfo.myStatus).toBe('None');
  });

  it('should return 404 for non-existent post', async () => {
    const fakePostId = new ObjectId().toString();

    await request(app)
      .put(`${POSTS_PATH}/${fakePostId}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Like' })
      .expect(404);
  });

  it('should return 401 without authorization', async () => {
    await request(app)
      .put(`${POSTS_PATH}/${ctx.postId}/like-status`)
      .send({ likeStatus: 'Like' })
      .expect(401);
  });

  it('should return newestLikes sorted by date descending', async () => {
    // User 1 likes
    await request(app)
      .put(`${POSTS_PATH}/${ctx.postId}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 10));

    // User 2 likes
    await request(app)
      .put(`${POSTS_PATH}/${ctx.postId}/like-status`)
      .set('Authorization', `Bearer ${ctx.user2Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 10));

    // User 3 likes
    await request(app)
      .put(`${POSTS_PATH}/${ctx.postId}/like-status`)
      .set('Authorization', `Bearer ${ctx.user3Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    const postRes = await request(app)
      .get(`${POSTS_PATH}/${ctx.postId}`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(postRes.body.extendedLikesInfo.newestLikes).toHaveLength(3);
    // Last liker should be first
    expect(postRes.body.extendedLikesInfo.newestLikes[0].login).toBe('user3test');
    expect(postRes.body.extendedLikesInfo.newestLikes[1].login).toBe('user2test');
    expect(postRes.body.extendedLikesInfo.newestLikes[2].login).toBe('user1test');
  });

  it('should limit newestLikes to 3', async () => {
    // All 4 users like
    for (let i = 1; i <= 4; i++) {
      const token = [ctx.user1Token, ctx.user2Token, ctx.user3Token, ctx.user4Token][i - 1];
      await request(app)
        .put(`${POSTS_PATH}/${ctx.postId}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
    }

    const postRes = await request(app)
      .get(`${POSTS_PATH}/${ctx.postId}`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .expect(200);

    expect(postRes.body.extendedLikesInfo.likesCount).toBe(4);
    expect(postRes.body.extendedLikesInfo.newestLikes).toHaveLength(3);
  });

  it('should return myStatus None for user without token', async () => {
    // User 1 likes
    await request(app)
      .put(`${POSTS_PATH}/${ctx.postId}/like-status`)
      .set('Authorization', `Bearer ${ctx.user1Token}`)
      .send({ likeStatus: 'Like' })
      .expect(204);

    // Request without token
    const postRes = await request(app)
      .get(`${POSTS_PATH}/${ctx.postId}`)
      .expect(200);

    expect(postRes.body.extendedLikesInfo.likesCount).toBe(1);
    expect(postRes.body.extendedLikesInfo.myStatus).toBe('None');
  });
});
