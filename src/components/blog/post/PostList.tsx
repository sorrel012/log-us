import PostCard, { Post } from '@/components/blog/post/PostCard';
import { useFetch } from '@/hooks/useFetch';

interface PostListProps {
    seriesId: number;
    blogId: number;
    size: number;
}

export default function PostList({ seriesId, blogId, size }: PostListProps) {
    const params = {
        blogId,
        ...(seriesId !== 0 && { seriesId }),
        size,
    };
    //TODO blogId, seriesId 넘겨야 함
    const { data, isLoading, isError, error } = useFetch('/posts.json', {
        queryKey: ['posts', blogId, seriesId],
        params,
    });

    const posts: Post[] = data?.content;

    return (
        <section className="mt-8 flex flex-col gap-6">
            {posts &&
                posts.map((post) => <PostCard key={post.postId} {...post} />)}
        </section>
    );
}
