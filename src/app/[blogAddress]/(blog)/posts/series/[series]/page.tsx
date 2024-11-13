'use client';

import { useParams } from 'next/navigation';
import { useBlogStore } from '@/store/useBlogStore';
import { useEffect, useMemo, useState } from 'react';
import Pagination from '@/components/Pagination';
import { Post } from '@/components/blog/post/PostCard';
import Popup from '@/components/Popup';
import { customFetch } from '@/utils/customFetch';
import SelectBox from '@/components/SelectBox';
import { PAGE_SIZE_OPTIONS } from '@/utils/constant';
import PostListSkeleton from '@/components/blog/post/PostListSkeleton';
import PostList from '@/components/blog/post/PostList';

interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface PostList {
    content: Post[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
}

export default function PostListPage() {
    const { blogId } = useBlogStore();
    const { series } = useParams();

    const [size, setSize] = useState(10);
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [posts, setPosts] = useState<Post[]>(null);

    const seriesValue = Array.isArray(series) ? series[0] : series || '';
    const [seriesId, seriesName] = seriesValue
        ? decodeURIComponent(seriesValue).split('&')
        : [null, ''];

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const params = useMemo(
        () => ({
            blogId,
            ...(seriesId !== 0 && { seriesId }),
            size,
            currPage: currPage - 1,
        }),
        [blogId, seriesId, size, currPage],
    );

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (blogId) {
            customFetch<any>('/posts', {
                queryKey: ['posts', blogId, seriesId, currPage, size],
                params,
            })
                .then((response) => {
                    setPosts(response.data.content);
                    setTotalPages(response.data.totalPages || 1);
                    setTotalPosts(response.data.totalElements || 0);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setIsError(true);
                    setShowPopup(true);
                    setPopupMessage(error || '게시글을 불러올 수 없습니다.');
                    setIsLoading(false);
                });
        }
    }, [blogId, currPage, seriesId, size, params]);

    const handleItemsPerValueChange = (value: number) => {
        setSize(value);
    };

    const handlePageChange = (page: number) => {
        setCurrPage(page);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <section className="mx-auto max-w-screen-2xl">
            <div className="flex h-full items-center justify-between border-b border-solid border-customLightBlue-100 pb-3">
                <h2 className="font-bold">
                    {seriesName}
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

            {isLoading && (
                <section className="mt-8 flex flex-col gap-6">
                    {Array.from({ length: size }).map((_, index) => (
                        <PostListSkeleton key={index} />
                    ))}
                </section>
            )}
            {isError && (
                <div className="mt-4 leading-6">
                    <div>게시글을 불러올 수 없습니다.</div>
                    <div>잠시 후 다시 시도해주세요.</div>
                </div>
            )}
            {!isLoading && posts ? (
                <PostList posts={posts} />
            ) : (
                <div className="mt-4">게시글이 존재하지 않습니다.</div>
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
