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
    //TODO 임시 게시글
    const postList: ExtendedPost[] = [
        {
            postId: 2,
            blogId: 1,
            imgUrl: null,
            title: '2번째 포스팅 제목입니다.',
            content:
                '2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.2번째 포스팅 내용입니다.',
            views: 13,
            commentCount: 2,
            likeCount: 1,
            blogAddress: 'sorrel012',
        },
        {
            postId: 2,
            blogId: 1,
            imgUrl: null,
            title: '2번째 포스팅 제목입니다.',
            content: '2번째 포스팅 내용입니다.',
            views: 13,
            commentCount: 2,
            likeCount: 1,
            blogAddress: 'sorrel012',
        },
        {
            postId: 2,
            blogId: 1,
            imgUrl: null,
            title: '2번째 포스팅 제목입니다.',
            content: '2번째 포스팅 내용입니다.',
            views: 13,
            commentCount: 2,
            likeCount: 1,
            blogAddress: 'sorrel012',
        },
        {
            postId: 2,
            blogId: 1,
            imgUrl: null,
            title: '2번째 포스팅 제목입니다.',
            content: '2번째 포스팅 내용입니다.',
            views: 13,
            commentCount: 2,
            likeCount: 1,
            blogAddress: 'sorrel012',
        },
        {
            postId: 2,
            blogId: 1,
            imgUrl: null,
            title: '2번째 포스팅 제목입니다.',
            content: '2번째 포스팅 내용입니다.',
            views: 13,
            commentCount: 2,
            likeCount: 1,
            blogAddress: 'sorrel012',
        },
        {
            postId: 2,
            blogId: 1,
            imgUrl: null,
            title: '2번째 포스팅 제목입니다.',
            content: '2번째 포스팅 내용입니다.',
            views: 13,
            commentCount: 2,
            likeCount: 1,
            blogAddress: 'sorrel012',
        },
    ];

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
                {/*{content.postList.map((post) => (*/}
                {postList.map((post) => (
                    <MainGridItem
                        blogAddress={post.blogAddress}
                        postId={post.postId}
                        key={post.postId}
                        title={post.title!}
                        content={post.content!}
                        views={post.views!}
                        commentCount={post.commentCount!}
                        likeCount={post.likeCount!}
                    />
                ))}
            </div>
        </section>
    );
}
