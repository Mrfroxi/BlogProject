
import {WithId} from "mongodb";
import {Post} from "../../types/post";
import {PostOutput} from "../../dto/post.output";


export function mapPostsListToOutput(posts:WithId<Post>[]){

    return posts.map((post:WithId<Post>):PostOutput => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }))
}

