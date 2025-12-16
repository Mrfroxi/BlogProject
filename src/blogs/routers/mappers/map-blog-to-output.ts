import {Blog} from "../../types/blog";
import {BlogOutput} from "../../dto/blog.output";

export  function mapBlogToOutput(blog:Blog):BlogOutput{

    return {
        id:blog.id,
        name:blog.name,
        description:blog.description,
        websiteUrl:blog.websiteUrl,
    }

}