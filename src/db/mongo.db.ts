import { Collection, Db, MongoClient } from 'mongodb';
import {SETTINGS} from "../core/setting/settings";
import {Blog} from "../entities/blogs/types/blog";
import {Post} from "../entities/posts/types/post";
import {User} from "../entities/user/types/user";


const BLOGS_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';
const USERS_COLLECTION_NAME = 'users';

export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;

export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME);

    blogCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
    postCollection = db.collection<Post>(POSTS_COLLECTION_NAME);
    userCollection = db.collection<User>(USERS_COLLECTION_NAME);

    try {
        await client.connect();
        await db.command({ ping: 1 });
        console.log('✅ Connected to the database');
        console.log('✅ url:', url);
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database is not connected: ${e}`);
    }
}
