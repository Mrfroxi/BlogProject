import { CommentCreateDto } from '../dto/comment-create.dto';
import { ResultType } from '../../../core/object-result/result.type';
import { UserOutputDto } from '../../user/dto/user-output.dto';
import { PostOutput } from '../../posts/dto/post.output';
import { postService } from '../../posts/services/post.service';
import { Comment } from '../types/comment';
import { ResultStatus } from '../../../core/object-result/resultCode';
import { WithId } from 'mongodb';
import { mapCommentToOutput } from '../repositories/mappers/map-comment-to-Output';
import { CommentOutputDto } from '../dto/comment-outPut.dto';
import { CommentDeleteInputDto } from '../dto/comment-delete-input.dto';
import { CommentRepository } from '../repositories/commentRepository';
import { UserService } from '../../user/services/user.service';
import { injectable, inject } from 'inversify';

@injectable()
export class CommentService {
  constructor(
    @inject(CommentRepository) private commentRepository: CommentRepository,
    @inject(UserService) private userService: UserService
  ) {}
  async findById(commentId: string): Promise<ResultType<CommentOutputDto | null>> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        extensions: [{ field: 'commentId', message: ' Not Found commentId' }],
      };
    }

    const outPutData: CommentOutputDto = await mapCommentToOutput(comment);
    return {
      status: ResultStatus.Success,
      data: outPutData,
      extensions: [{ field: ' ', message: ' ' }],
    };
  }

  async createComment(dto: CommentCreateDto): Promise<ResultType<CommentOutputDto | null>> {
    const { userId, postId, content } = dto;

    const userResult: ResultType<UserOutputDto | null> =
      await this.userService.findUserById(userId);

    if (!userResult.data) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        extensions: [{ field: 'userId', message: ' userId Not Found' }],
        errorMessage: 'userId Not Found',
      };
    }

    const postResult: ResultType<PostOutput | null> = await postService.findPostById(postId);

    if (!postResult.data) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        extensions: [{ field: 'post', message: ' post Not Found' }],
        errorMessage: 'post Not Found',
      };
    }

    const commentDto: Comment = {
      content: content,
      postId: postId,
      commentatorInfo: {
        userId: userResult.data?.id!,
        userLogin: userResult.data?.login!,
      },
      createdAt: `${new Date().toISOString()}`,
    };

    const commented: WithId<Comment> = await this.commentRepository.createComment(commentDto);

    const outPutData: CommentOutputDto = await mapCommentToOutput(commented);

    return {
      status: ResultStatus.Success,
      data: outPutData,
      extensions: [{ field: ' ', message: ' ' }],
    };
  }

  async deleteComment(dto: CommentDeleteInputDto): Promise<ResultType<boolean | null>> {
    const { commentId } = dto;

    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        extensions: [{ field: 'commentId', message: 'Not found comment' }],
      };
    }

    const isOwner = await this.commentRepository.isCommentOwner(dto);

    if (!isOwner) {
      return {
        status: ResultStatus.Forbidden,
        data: null,
        extensions: [{ field: 'userId', message: 'Forbidden' }],
      };
    }

    const deleteComment = await this.commentRepository.deleteComment(commentId);

    if (!deleteComment) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'deleted', message: 'deleted' }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: true,
      extensions: [{ field: ' ', message: ' ' }],
    };
  }

  async updateComment(dto: {
    commentId: string;
    userId: string;
    content: string;
  }): Promise<ResultType<CommentOutputDto | null>> {
    const { commentId, userId, content } = dto;

    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        extensions: [{ field: 'commentId', message: 'Comment not found' }],
      };
    }

    const isOwner = await this.commentRepository.isCommentOwner({ commentId, userId });

    if (!isOwner) {
      return {
        status: ResultStatus.Forbidden,
        data: null,
        extensions: [{ field: 'userId', message: 'Forbidden: not the owner' }],
      };
    }

    const updatedComment = await this.commentRepository.updateCommentContent(commentId, content);

    if (!updatedComment) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'content', message: 'Failed to update comment' }],
      };
    }

    const outPutData: CommentOutputDto = await mapCommentToOutput(updatedComment);

    return {
      status: ResultStatus.Success,
      data: outPutData,
      extensions: [{ field: ' ', message: ' ' }],
    };
  }
}
