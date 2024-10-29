'use client';

import { useParams } from 'next/navigation';
import { useBlogStore } from '@/store/useBlogStore';
import { useFetch } from '@/hooks/useFetch';
import { useEffect, useMemo, useState } from 'react';
import { Post } from '@/components/blog/post/PostCard';
import SelectBox from '@/components/SelectBox';
import { PAGE_SIZE_OPTIONS } from '@/utils/constant';
import PostListSkeleton from '@/components/blog/post/PostListSkeleton';
import PostList from '@/components/blog/post/PostList';
import { PostList as PostListType } from '@/app/[blogAddress]/(blog)/posts/series/[series]/page';
import Pagination from '@/components/Pagination';
import Popup from '@/components/Popup';

export default function TagList() {
    const { tag } = useParams();
    const { blogId } = useBlogStore();

    const [size, setSize] = useState(10);
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [posts, setPosts] = useState<Post[]>(null);

    const params = useMemo(
        () => ({
            blogId,
            tag,
            size,
            currPage: currPage - 1,
        }),
        [blogId, tag, size, currPage],
    );
    const { data, isLoading, isError, error } = useFetch<PostListType>(
        '/posts.json',
        {
            queryKey: ['posts', blogId, tag, currPage, size],
            params,
        },
    );

    useEffect(() => {
        if (data?.content && posts !== data.content) {
            setPosts(data.content);
            setTotalPages(data.totalPages || 1);
            setTotalPosts(data.totalElements || 0);
        }
    }, [data, posts]);

    const handleItemsPerValueChange = (value: number) => {
        setSize(value);
    };

    const handlePageChange = (page: number) => {
        setCurrPage(page);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <section>
            <div className="flex h-full items-center justify-between border-b border-solid border-customLightBlue-100 pb-3">
                <h2 className="font-bold">
                    {tag}
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
                <PostList posts={posts} />
            )}

            <Pagination
                currentPage={currPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            <Popup
                show={showPopup}
                title="에러"
                text={popupMessage}
                onConfirm={handleClosePopup}
            />
        </section>
    );
}
