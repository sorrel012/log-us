'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useBlogStore } from '@/store/useBlogStore';
import { customFetch } from '@/utils/customFetch';
import AlertPopup from '@/components/AlertPopup';
import { Post } from '@/components/blog/post/PostCard';
import SelectBox from '@/components/SelectBox';
import { PAGE_SIZE_OPTIONS } from '@/utils/constant';
import PostSettingList from '@/components/blog/setting/PostSettingList';
import Pagination from '@/components/Pagination';

export default function PostsManagePage() {
    const { blogId } = useBlogStore();

    const [isLoading, setIsLoading] = useState(true);
    const [size, setSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [posts, setPosts] = useState<Post[]>(null);
    const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    const params = useMemo(
        () => ({
            blogId,
            size,
            page: page - 1,
        }),
        [blogId, size, page],
    );

    useEffect(() => {
        if (blogId) {
            setIsLoading(true);
            customFetch<any>('/posts', {
                queryKey: ['posts', 'setting', blogId, page, size],
                params,
                invalidateCache: true,
            })
                .then((response) => {
                    setPosts(response.data.content);
                    setTotalPages(response.data.totalPages || 1);
                    setTotalPosts(response.data.totalElements || 0);
                })
                .catch(() => {
                    setShowPopup(true);
                    setPopupTitle('게시글을 불러올 수 없습니다.');
                    setPopupText('잠시 후 다시 시도해 주세요.');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [blogId, page, size, params]);

    const handleItemsPerValueChange = (value: number) => {
        setSize(value);
    };

    const handleSelect = (posts: Post[]) => {
        setSelectedPosts(posts);
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    return (
        <fieldset>
            <div className="flex">
                <legend className="mb-8 text-lg font-bold">글 관리</legend>
                <span
                    className="relative ml-0.5 text-sm text-customLightBlue-200"
                    style={{ top: '-0.1em' }}
                >
                    {totalPosts}
                </span>
            </div>
            {isLoading ? (
                <div className="flex h-24 items-center justify-center">
                    <div className="spinner-brown" />
                </div>
            ) : posts && posts.length > 0 ? (
                <>
                    <div className="mb-4 flex items-center justify-between">
                        <button
                            className="rounded bg-customBeige-100 px-3 py-2.5 text-customBrown-100"
                            disabled={selectedPosts.length < 1}
                        >
                            삭제
                        </button>
                        <SelectBox
                            onItemsPerValueChange={handleItemsPerValueChange}
                            items={PAGE_SIZE_OPTIONS}
                            containerWidth="w-30"
                        />
                    </div>
                    <PostSettingList contents={posts} onSelect={handleSelect} />
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />{' '}
                </>
            ) : (
                <div> 게시글이 존재하지 않습니다. </div>
            )}

            <AlertPopup
                show={showPopup}
                onConfirm={() => setShowPopup(false)}
                title={popupTitle}
                text={popupText}
            />
        </fieldset>
    );
}
