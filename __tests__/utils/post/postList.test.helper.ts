const BASE_POST_TITLES = [
    'postFirst',
    'PostTwo',
    'PostThree',
];

export const createPostList = (blogId: string, count: number) => {
    const createdPosts = [];

    for (let i = 0; i < count; i++) {
        const title =
            i < BASE_POST_TITLES.length
                ? BASE_POST_TITLES[i]
                : `${BASE_POST_TITLES[i % BASE_POST_TITLES.length]}${i + 1}`;

        const post = {
            title,
            shortDescription: `Short description for ${title}`,
            content: `Content for ${title}`,
            blogId,
        };

        createdPosts.push(post);
    }

    return createdPosts;
};
