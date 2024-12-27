import { Blog } from '@/components/UserGrid';
import BlogCard from '@/components/blog/setting/BlogCard';

export default function BlogGrid({ blogs }: { blogs: Blog[] }) {
    return (
        <section className="flex flex-wrap gap-10">
            {blogs &&
                blogs.map((blog) => <BlogCard key={blog.blogId} {...blog} />)}
        </section>
    );
}