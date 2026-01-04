import {Blog} from "../../types/blog";
import {BlogListOutput} from "../../dto/blog-list.output";
import {WithId} from "mongodb";


export function mapBlogsListToOutput(blogs:WithId<Blog>[]){

    return blogs.map((elem:WithId<Blog>):BlogListOutput => ({
        id: `${elem._id.toString()}`,
        name: elem.name,
        description:elem.description,
        websiteUrl:elem.websiteUrl,
        createdAt:elem.createdAt,
        isMembership:elem.isMembership,
    }))
}

