import { Container } from 'inversify';
import { UserRepository } from './entities/user/repositories/user.repository';
import { UserQueryRepository } from './entities/user/repositories/user-query.repository';
import { UserService } from './entities/user/services/user.service';
import { BcryptService } from './core/services/bcrypt.service';
import { UserController } from './entities/user/routers/user.controller';
import { CommentRepository } from './entities/comments/repositories/commentRepository';
import { CommentService } from './entities/comments/services/comment.service';
import { CommentController } from './entities/comments/routers/comment.controller';
import { PostsRepository } from './entities/posts/repositories/posts.repository';
import { PostService } from './entities/posts/services/post.service';
import { PostController } from './entities/posts/routers/post.controller';
import { BlogsRepository } from './entities/blogs/repositories/blogs.repository';
import { BlogService } from './entities/blogs/services/blog.service';
import { BlogController } from './entities/blogs/routers/blog.controller';
import { AuthService } from './auth/services/auth.service';
import { AuthController } from './auth/routers/auth.controller';

export const container = new Container();

// Регистрация зависимостей
container.bind<UserRepository>(UserRepository).to(UserRepository);
container.bind<UserQueryRepository>(UserQueryRepository).to(UserQueryRepository);
container.bind<UserService>(UserService).to(UserService);
container.bind<BcryptService>(BcryptService).to(BcryptService);
container.bind<UserController>(UserController).to(UserController);
container.bind<CommentRepository>(CommentRepository).to(CommentRepository);
container.bind<CommentService>(CommentService).to(CommentService);
container.bind<CommentController>(CommentController).to(CommentController);
container.bind<PostsRepository>(PostsRepository).to(PostsRepository);
container.bind<PostService>(PostService).to(PostService);
container.bind<PostController>(PostController).to(PostController);
container.bind<BlogsRepository>(BlogsRepository).to(BlogsRepository);
container.bind<BlogService>(BlogService).to(BlogService);
container.bind<BlogController>(BlogController).to(BlogController);
container.bind<AuthService>(AuthService).to(AuthService);
container.bind<AuthController>(AuthController).to(AuthController);

