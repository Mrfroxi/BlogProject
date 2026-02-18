import { WithId } from 'mongodb';
import { Blog } from '../types/blog';
import { BlogCreateInput } from '../dto/blog-create.input';
import { BlogUpdateDto } from '../dto/blog-update';
import { BlogsRepository } from '../repositories/blogs.repository';
import { injectable, inject } from 'inversify';

@injectable()
export class BlogService {
  constructor(
    @inject(BlogsRepository) private blogsRepository: BlogsRepository
  ) {}

  async findAll(querySetup: any) {
    return this.blogsRepository.findAll(querySetup);
  }

  async findById(blogId: string): Promise<WithId<Blog>> {
    return this.blogsRepository.findById(blogId);
  }

  async createBlog(dto: BlogCreateInput) {
    const newBlog: Blog = {
      name: dto.name,
      createdAt: `${new Date().toISOString()}`,
      description: dto.description,
      isMembership: false,
      websiteUrl: dto.websiteUrl,
    };

    return await this.blogsRepository.createBlog(newBlog);
  }

  async updateBlog(blogId: string, reqBody: BlogUpdateDto) {
    return await this.blogsRepository.updateBlog(blogId, reqBody);
  }

  async deleteBlog(id: string): Promise<void> {
    return this.blogsRepository.deleteBlog(id);
  }
}
