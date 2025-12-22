import {Blog} from "../../types/blog";
import {BlogOutput} from "../../dto/blog.output";
import {WithId} from "mongodb";

export  function mapBlogToOutput(blog:WithId<Blog>):BlogOutput{

    return {
        id:blog._id.toString(),
        name:blog.name,
        description:blog.description,
        websiteUrl:blog.websiteUrl,
        createAt:blog.createdAt,
        isMembership:blog.isMembership,
    }

}