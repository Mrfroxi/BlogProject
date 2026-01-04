import {Post} from "../types/post";
import {postCreateDto} from "../dto/post-create.input";
import {postUpdateDto} from "../dto/post-update.input";
import {ObjectId, WithId} from "mongodb";
import {postCollection} from "../../db/mongo.db";


export const postsRepository = {
    async findAll():Promise<WithId<Post>[]> {
        return postCollection.find().toArray();
    },
    async findById(id:string): Promise<WithId<Post>  | null>{
        return postCollection.findOne({_id: new ObjectId(id)})
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
            throw new Error('Post not exist');
        }

        return;
    },
    async deletePost(id: string): Promise<void> {
        const deleteResult = await postCollection.deleteOne({
            _id: new ObjectId(id),
        });

        if (deleteResult.deletedCount < 1) {
            throw new Error('Post not exist');
        }

        return;
    }

}