'use client';

import MainGridItem from '@/components/main/MainGridItem';

export interface ExtendedPost {
    postId: number;
    blogId: number;
    imgUrl?: string | null;
    title: string;
    content: string;
    views: number;
    commentCount: number;
    likeCount: number;
    blogAddress: string;
}

export interface MainData {
    categoryId: number;
    categoryName: string;
    postList: ExtendedPost[];
}

export default function MainGrid({ content }: { content: MainData }) {
    return (
        <section className="p-6">
            <div className="mb-3 flex items-baseline gap-3 font-bold">
                <div>
                    HOT <em className="text-red-500">POST</em>
                </div>
                <h3 className="shadow-custom rounded-xl bg-yellow-100 px-3 text-xs">
                    {content.categoryName}
                </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {content.postList.map((post) => (
                    <MainGridItem key={post.postId} {...post} />
                ))}
            </div>
        </section>
    );
}
