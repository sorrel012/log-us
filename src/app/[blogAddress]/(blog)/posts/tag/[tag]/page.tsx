'use client';

import { useParams } from 'next/navigation';
import { useBlogStore } from '@/store/useBlogStore';
import { useEffect, useMemo, useState } from 'react';
import { Post } from '@/components/blog/post/PostCard';
import SelectBox from '@/components/SelectBox';
import { PAGE_SIZE_OPTIONS } from '@/constants/constant';
import PostListSkeleton from '@/components/blog/post/PostListSkeleton';
import PostList from '@/components/blog/post/PostList';
import Pagination from '@/components/Pagination';
import AlertPopup from '@/components/AlertPopup';
import { customFetch } from '@/utils/customFetch';

export default function TagList() {
    const { tag } = useParams();
    let tagName = '';
    if (typeof tag === 'string') {
        tagName = decodeURIComponent(tag);
    }
    const { blogId } = useBlogStore();

    const [size, setSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [posts, setPosts] = useState<Post[]>(null);

    const params = useMemo(
        () => ({
            blogId,
            tag: tagName,
            size,
            page: page - 1,
        }),
        [blogId, tagName, size, page],
    );

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        (async () => {
            if (blogId) {
                try {
                    const response = await customFetch<any>(
                        '/posts/tag-search',
                        {
                            queryKey: ['posts', blogId, tagName, page, size],
                            params,
                        },
                    );

                    setPosts(response.data.content);
                    setTotalPages(response.data.totalPages || 1);
                    setTotalPosts(response.data.totalElements || 0);
                    setIsLoading(false);
                } catch (error) {
                    setIsError(true);
                    setShowPopup(true);
                    setPopupMessage(error || '게시글을 불러올 수 없습니다.');
                    setIsLoading(false);
                }
            }
        })();
    }, [blogId, page, tagName, size, params]);

    const handleItemsPerValueChange = (value: number) => {
        setSize(value);
        setPage(1);
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <section className="mx-auto max-w-screen-2xl">
            <div className="flex h-full items-center justify-between border-b border-solid border-customLightBlue-100 pb-3">
                <h2 className="font-bold">
                    {tagName}
                    {!isError && (
                        <span
                            className="relative ml-0.5 text-sm text-customLightBlue-200"
                            style={{ top: '-0.1em' }}
                        >
                            {totalPosts}
                        </span>
                    )}
                </h2>
                <SelectBox
                    onItemsPerValueChange={handleItemsPerValueChange}
                    items={PAGE_SIZE_OPTIONS}
                    defaultValue={size}
                    containerWidth="w-70"
                />
            </div>

            {isLoading ? (
                <section className="mt-8 flex flex-col gap-6">
                    {Array.from({ length: size }).map((_, index) => (
                        <PostListSkeleton key={index} />
                    ))}
                </section>
            ) : isError ? (
                <div className="mt-4 leading-6">
                    <div>게시글을 불러올 수 없습니다.</div>
                    <div>잠시 후 다시 시도해주세요.</div>
                </div>
            ) : posts?.length === 0 ? (
                <div className="mt-4">게시글이 존재하지 않습니다.</div>
            ) : (
                <>
                    <PostList posts={posts} />
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            <AlertPopup
                show={showPopup}
                title={popupMessage}
                onConfirm={handleClosePopup}
            />
        </section>
    );
}
