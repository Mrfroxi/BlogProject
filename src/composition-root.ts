import { Container } from 'inversify';
import { UserRepository } from './entities/user/repositories/user.repository';
import { UserQueryRepository } from './entities/user/repositories/user-query.repository';
import { UserService } from './entities/user/services/user.service';
import { BcryptService } from './core/services/bcrypt.service';
import { UserController } from './entities/user/routers/user.controller';
import { CommentRepository } from './entities/comments/repositories/commentRepository';
import { CommentService } from './entities/comments/services/comment.service';
import { CommentController } from './entities/comments/routers/comment.controller';

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
