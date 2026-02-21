import mongoose from 'mongoose';
import { SETTINGS } from '../core/setting/settings';
import { UserModel } from './schemas/user.schema';
import { BlogModel } from './schemas/blog.schema';
import { PostModel } from './schemas/post.schema';
import { CommentModel } from './schemas/comment.schema';
import { SessionModel } from './schemas/session.schema';
import { RateLimitModel } from './schemas/rateLimit.schema';

export async function runDB(url: string): Promise<void> {
  try {
    await mongoose.connect(url, {
      dbName: SETTINGS.DB_NAME,
    });

    console.log('✅ Connected to the database');
    console.log('✅ url:', url);
  } catch (e) {
    throw new Error(`❌ Database is not connected: ${e}`);
  }
}

export async function closeDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('🔴 Database connection closed');
}

export { UserModel, BlogModel, PostModel, CommentModel, SessionModel, RateLimitModel };
