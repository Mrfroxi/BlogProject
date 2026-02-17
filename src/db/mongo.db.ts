import { Collection, Db, MongoClient } from 'mongodb';
import { SETTINGS } from '../core/setting/settings';
import { Blog } from '../entities/blogs/types/blog';
import { Post } from '../entities/posts/types/post';
import { User } from '../entities/user/types/user';
import { Comment } from '../entities/comments/types/comment';
import { Session } from '../entities/session/types/session';
import { rateLimit } from '../entities/rateLimit/types/rateLimit';

const BLOGS_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';
const USERS_COLLECTION_NAME = 'users';
const COMMENTS_COLLECTION_NAME = 'comments';
const SESSION_COLLECTION_NAME = 'sessions';
const RATE_LIMIT_COLLECTION_NAME = 'rateLimit';

export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
export let commentCollection: Collection<Comment>;
export let sessionsCollection: Collection<Session>;
export let rateLimitsCollection: Collection<rateLimit>;

export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  blogCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
  postCollection = db.collection<Post>(POSTS_COLLECTION_NAME);
  userCollection = db.collection<User>(USERS_COLLECTION_NAME);
  commentCollection = db.collection<Comment>(COMMENTS_COLLECTION_NAME);
  sessionsCollection = db.collection<Session>(SESSION_COLLECTION_NAME);
  rateLimitsCollection = db.collection<rateLimit>(RATE_LIMIT_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to the database');
    console.log('✅ url:', url);

    await rateLimitsCollection.createIndex(
      { date: 1 }, // field date
      { expireAfterSeconds: Number(SETTINGS.WINDOW_TIME_DELAY) / 1000 }
    );
    console.log('✅ TTL index created for rateLimitsCollection');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database is not connected: ${e}`);
  }
}
