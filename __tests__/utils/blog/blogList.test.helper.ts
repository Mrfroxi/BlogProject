const BASE_BLOG_NAMES = [
    'blogMail',
    'blogGoogle',
    'blogYandex',
];

export const createBlogList = async (count: number) => {
    const createdBlogs = [];

    for (let i = 0; i < count; i++) {
        const name =
            i < BASE_BLOG_NAMES.length
                ? BASE_BLOG_NAMES[i]
                : `blogMail${i - BASE_BLOG_NAMES.length + 1}`;

        const blog ={
            name,
            description: `Description for ${name}`,
            websiteUrl: `https://${name}.com`,
        };

        createdBlogs.push(blog);
    }

    return createdBlogs;
};

