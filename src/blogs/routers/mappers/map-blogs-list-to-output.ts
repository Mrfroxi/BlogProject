import {Blog} from "../../types/blog";
import {BlogListOutput} from "../../dto/blog-list.output";


export function mapBlogsListToOutput(blogs:Blog[]){

    return blogs.map((elem:Blog):BlogListOutput => ({
        id: elem.id,
        name: elem.name,
        description:elem.description,
        websiteUrl:elem.websiteUrl,
    }))
}

