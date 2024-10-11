import PostCard, { Post } from '@/components/blog/post/PostCard';

interface PostListProps {
    posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
    return (
        <section className="mt-8 flex flex-col gap-6">
            {posts &&
                posts.map((post) => <PostCard key={post.postId} {...post} />)}
        </section>
    );
}
