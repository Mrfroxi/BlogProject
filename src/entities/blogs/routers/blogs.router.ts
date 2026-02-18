import { Router } from 'express';
import { container } from '../../../composition-root';
import { BlogController } from './blog.controller';
import { idParamValidator } from '../../../core/middlewares/validation/id-param.validator';
import { inputValidationResultMiddleware } from '../../../core/middlewares/validation/input-validation-result';
import { SuperAdminGuard } from '../../../auth/routers/middleware/super-admin.guard-middleware';
import { paginationSortingValidator } from '../../../core/middlewares/validation/pagination.sorting.validator';
import { BlogSortField } from '../types/blog-sortField';
import { blogCreateValidator } from '../validators/blog-create.validator';
import { blogUpdateValidator } from '../validators/blog-update.validator';
import { blogIdParamValidator } from '../../../core/middlewares/validation/blogId-param.validator';
import { blogPostCreateValidator } from '../validators/blog-post-create.validator';
import { PostSortField } from '../../posts/types/post-sort-fields';

export const blogsRouter = Router({});

const blogController = container.get<BlogController>(BlogController);

blogsRouter
  .get(
    '',
    paginationSortingValidator(BlogSortField),
    inputValidationResultMiddleware,
    blogController.getBlogsList.bind(blogController)
  )

  .get('/:id', idParamValidator, inputValidationResultMiddleware, blogController.getBlog.bind(blogController))
  .post(
    '',
    SuperAdminGuard,
    blogCreateValidator,
    inputValidationResultMiddleware,
    blogController.createBlog.bind(blogController)
  )
  .put(
    '/:id',
    SuperAdminGuard,
    idParamValidator,
    blogUpdateValidator,
    inputValidationResultMiddleware,
    blogController.updateBlog.bind(blogController)
  )
  .delete(
    '/:id',
    SuperAdminGuard,
    idParamValidator,
    inputValidationResultMiddleware,
    blogController.deleteBlog.bind(blogController)
  )

  .post(
    '/:blogId/posts',
    SuperAdminGuard,
    blogIdParamValidator,
    blogPostCreateValidator,
    inputValidationResultMiddleware,
    blogController.createBlogPost.bind(blogController)
  )

  .get(
    '/:blogId/posts',
    paginationSortingValidator(PostSortField),
    blogIdParamValidator,
    inputValidationResultMiddleware,
    blogController.getBlogPostList.bind(blogController)
  );
