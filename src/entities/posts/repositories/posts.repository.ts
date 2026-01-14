import {Post} from "../types/post";
import {postUpdateDto} from "../dto/post-update.input";
import {ObjectId, WithId} from "mongodb";
import {RepositoryNotFoundError} from "../../../core/errors/repository-not-found";
import {PostQueryInput} from "../dto/post-query-input";
import {postCollection} from "../../../db/mongo.db";
import {PostSortField} from "../types/post-sort-fields";
import {mapPostToOutput} from "../routers/mappers/map-post-to-output";
import {PostOutput} from "../dto/post.output";


export const postsRepository = {
    async findAll(querySetup:PostQueryInput<PostSortField>): Promise<{ items: WithId<Post>[]; totalCount: number }> {

        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
            blogId,
        } = querySetup

        const skip = (pageNumber - 1) * pageSize;

        const filter: any = {};

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' };
        }

        if(blogId){
            filter.blogId = { $regex: blogId };
        }


        const items = await postCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();


        const totalCount = await postCollection.countDocuments(filter);

        return { items, totalCount };
    },

    async findById(id:string): Promise<PostOutput|null>{

        const postResult= await postCollection.findOne({_id: new ObjectId(id)})

        if(!postResult){
          return  null
        }

        return  mapPostToOutput(postResult)

    },
    async createPost(newPost:Post): Promise<WithId<Post>>{
        const insertResult = await postCollection.insertOne(newPost);
        return { ...newPost, _id: insertResult.insertedId };

    },
    async updatePost(id: string, dto: postUpdateDto): Promise<void> {

        const updateResult = await postCollection.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: dto.blogId,
                },
            },
        );

        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError('Post not exist');
        }

        return;
    },
    async deletePost(id: string): Promise<void> {
        const deleteResult = await postCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Post not exist');
        }

        return;
    },

}