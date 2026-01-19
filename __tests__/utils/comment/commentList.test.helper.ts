import request from "supertest";

export const createCommentsForPost = async (
    app: any,
    postId: string,
    userToken: string,
    count: number
) => {
    const comments = [];

    for (let i = 0; i < count; i++) {
        const content = `Comment number ${i + 1} for post ${postId}`;

        const res = await request(app)
            .post(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ content })
            .expect(201);

        comments.push(res.body);
    }

    return comments;
};