import {Blog} from "../types/blog";
import {BlogUpdateDto} from "../dto/blog-update";
import {blogCollection} from "../../db/mongo.db";
import {ObjectId, WithId} from "mongodb";


export const blogsRepository = {
    async findAll():Promise<WithId<Blog>[]> {
        return blogCollection.find().toArray();
    },
    async findById(id:string): Promise<WithId<Blog>  | null>{
        return blogCollection.findOne({_id: new ObjectId(id)})
    },
    async createBlog(newBlog:Blog): Promise<WithId<Blog>>{
        const insertResult = await blogCollection.insertOne(newBlog);
        return { ...newBlog, _id: insertResult.insertedId };

    },
    async updateBlog(id: string, dto: BlogUpdateDto): Promise<void> {
        const updateResult = await blogCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                   name:dto.name,
                   description:dto.description,
                   websiteUrl:dto.websiteUrl,
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new Error('Blog not exist');
        }
        return;
    },

    async deleteBlog(id: string): Promise<void> {
        const deleteResult = await blogCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new Error('Driver not exist');
        }
        return;
    },
}