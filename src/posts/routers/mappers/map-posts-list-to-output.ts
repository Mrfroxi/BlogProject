
import {WithId} from "mongodb";
import {Post} from "../../types/post";
import {PostOutput} from "../../dto/post.output";
import {PaginationOutput} from "../../../blogs/routers/mappers/dto/blog-pagination-output";



export function mapPostListToOutput(posts:WithId<Post>[],setup:PaginationOutput){

    const {
        totalCount,
        pageNumber,
        pageSize
    } = setup

    const pageCount = Math.ceil(totalCount / pageSize)

    return {
        page:pageNumber,
        totalCount,
        pageCount,
        pageSize,
        items:   posts.map((post:WithId<Post>):PostOutput => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }))
    }
}
