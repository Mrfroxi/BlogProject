import { Blog } from '../types/blog';
import { BlogUpdateDto } from '../dto/blog-update';
import { BlogModel, IBlog } from '../../../db/schemas/blog.schema';
import { BlogQueryInput } from '../dto/blog-query-input';
import { RepositoryNotFoundError } from '../../../core/errors/repository-not-found';
import { injectable } from 'inversify';

@injectable()
export class BlogsRepository {
  async findAll(
    querySetup: BlogQueryInput
  ): Promise<{ items: IBlog[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = querySetup;

    const skip = (pageNumber - 1) * pageSize;

    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const items = await BlogModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await BlogModel.countDocuments(filter);

    return { items, totalCount };
  }

  async findById(id: string): Promise<IBlog> {
    const res = await BlogModel.findById(id);

    if (!res) {
      throw new RepositoryNotFoundError('Blog not exist');
    }

    return res;
  }

  async createBlog(newBlog: Blog): Promise<IBlog> {
    return BlogModel.create(newBlog);
  }

  async updateBlog(id: string, dto: BlogUpdateDto): Promise<void> {
    const updateResult = await BlogModel.updateOne(
      { _id: id },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      }
    );

    if (updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError('Blog not exist');
    }
    return;
  }

  async deleteBlog(id: string): Promise<void> {
    const deleteResult = await BlogModel.deleteOne({ _id: id });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Blog not exist');
    }
    return;
  }
}
