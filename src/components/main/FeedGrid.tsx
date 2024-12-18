'use client';

import { ExtendedPost } from '@/components/main/MainGrid';
import MainGridItem from '@/components/main/MainGridItem';

export default function FeedGrid({ content }: { content: ExtendedPost[] }) {
    return (
        <section className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {content.map((post) => (
                    <MainGridItem key={post.postId} {...post} />
                ))}
            </div>
        </section>
    );
}
