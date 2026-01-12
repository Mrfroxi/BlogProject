import {Blog} from "../../types/blog";
import {BlogListOutput} from "../../dto/blog-list.output";
import {WithId} from "mongodb";
import {PaginationOutput} from "./dto/blog-pagination-output";


export function mapBlogsListToOutput(blogs:WithId<Blog>[],setup:PaginationOutput){

    const {
        totalCount,
        pageNumber,
        pageSize
    } = setup

    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
        page:pageNumber,
        totalCount,
        pagesCount,
        pageSize,
        items:   blogs.map((elem:WithId<Blog>):BlogListOutput => ({
                id: `${elem._id.toString()}`,
                name: elem.name,
                description:elem.description,
                websiteUrl:elem.websiteUrl,
                createdAt:elem.createdAt,
                isMembership:elem.isMembership,
            }))
    }
}

