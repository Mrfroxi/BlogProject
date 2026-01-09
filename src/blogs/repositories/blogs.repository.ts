import {Blog} from "../types/blog";
import {BlogUpdateDto} from "../dto/blog-update";
import {blogCollection} from "../../db/mongo.db";
import {ObjectId, WithId} from "mongodb";
import {BlogQueryInput} from "../dto/blog-query-input";


const blogsRepository = {
    async findAll(querySetup:BlogQueryInput):
        Promise<{ items: WithId<Blog>[]; totalCount: number }> {

    const {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchNameTerm,
    } = querySetup

        const skip = (pageNumber - 1) * pageSize;

        const filter: any = {};


        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }


        const items = await blogCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await blogCollection.countDocuments(filter);

        return { items, totalCount };
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
export default blogsRepository