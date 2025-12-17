import {Blog} from "../blogs/types/blog";
import {Post} from "../posts/types/post";


export  const db = {
    blogs: <Blog[]>[
        {
            id:"1",
            name:'testName',
            description:"testDescription",
            websiteUrl:'websiteUrl'
        },
        {
            id:"2",
            name:'testName',
            description:"testDescription",
            websiteUrl:'websiteUrl'
        },
    ],
    posts: <Post[]> [
        {
            "id": "1",
            "title": "string",
            "shortDescription": "string",
            "content": "string",
            "blogId": "string",
            "blogName": "string"
        },
        {
            "id": "2",
            "title": "string",
            "shortDescription": "string",
            "content": "string",
            "blogId": "string",
            "blogName": "string"
        }
    ]

}