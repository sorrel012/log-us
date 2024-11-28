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
import ConfirmPopup from '@/components/ConfirmPopup';
import { useRouter } from 'next/navigation';

export default function PostsManagePage() {
    const router = useRouter();
    const { blogId } = useBlogStore();

    const [isLoading, setIsLoading] = useState(true);
    const [size, setSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [posts, setPosts] = useState<Post[]>(null);
    const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);

    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');
    const [popupId, setPopupId] = useState('CLOSE');

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
                    setPopupTitle('게시글을 불러올 수 없습니다.');
                    setPopupText('잠시 후 다시 시도해 주세요.');
                    setPopupId('CLOSE');
                    setShowPopup(true);
                })
                .finally(() => {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 500);
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

    const handleConfirm = () => {
        if (popupId === 'CLOSE') {
            setShowPopup(false);
        } else {
            router.refresh();
        }
    };

    const handleDeleteConfirm = async () => {
        for (const post of selectedPosts) {
            try {
                const res = await customFetch(`/posts/${post.postId}`, {
                    method: 'DELETE',
                    queryKey: ['deletePost', post.postId],
                });

                if (res.isError) {
                    throw new Error(
                        res.error || '게시글을 삭제할 수 없습니다.',
                    );
                }

                setShowConfirmPopup(false);
                setPopupTitle('삭제되었습니다.');
                setPopupText('');
                setPopupId('REFRESH');
                setShowPopup(true);
            } catch (e) {
                setShowConfirmPopup(false);
                setPopupTitle('게시글을 삭제할 수 없습니다.');
                setPopupText('잠시 후 다시 시도해 주세요.');
                setPopupId('CLOSE');
                setShowPopup(true);
            }
        }
    };

    const handleDelete = async () => {
        setPopupTitle(`${selectedPosts.length}건의 글을 삭제하시겠습니까?`);
        setPopupText('삭제한 글은 복구할 수 없습니다.');
        setShowConfirmPopup(true);
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
                            onClick={handleDelete}
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
                onConfirm={handleConfirm}
                title={popupTitle}
                text={popupText}
            />
            <ConfirmPopup
                show={showConfirmPopup}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowConfirmPopup(false)}
                title={popupTitle}
                text={popupText}
            />
        </fieldset>
    );
}
