'use client';

import { useRouter } from 'next/navigation';
import { useBlogStore } from '@/store/useBlogStore';
import React, { useEffect, useState } from 'react';
import { Comment } from '@/components/blog/post/PostCard';
import { customFetch } from '@/utils/customFetch';
import SearchContent from '@/components/blog/setting/SearchContent';
import SelectBox from '@/components/SelectBox';
import { PAGE_SIZE_OPTIONS } from '@/constants/constant';
import Pagination from '@/components/Pagination';
import SearchNothing from '@/components/blog/setting/SearchNothing';
import AlertPopup from '@/components/AlertPopup';
import ConfirmPopup from '@/components/ConfirmPopup';
import CommentSettingList from '@/components/blog/setting/CommentSettingList';

export default function CommentsManagePage() {
    const router = useRouter();
    const { blogId } = useBlogStore();

    const [isLoading, setIsLoading] = useState(true);
    const [size, setSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const [comments, setComments] = useState<Comment[]>([]);
    const [selectedComments, setSelectedComments] = useState<Comment[]>([]);
    const [isSearch, setIsSearch] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');
    const [popupId, setPopupId] = useState('CLOSE');

    useEffect(() => {
        const params = { blogId, condition: 'ALL', size, page: page - 1 };

        (async () => {
            if (blogId) {
                setIsLoading(true);
                setIsSearch(false);

                try {
                    const response = await customFetch<any>('/blog/comments', {
                        queryKey: ['comments', 'setting', blogId, page, size],
                        params,
                        invalidateCache: true,
                    });

                    setComments(response.data.content);
                    setTotalPages(response.data.totalPages || 1);
                    setTotalComments(response.data.totalElements || 0);
                } catch (error) {
                    setPopupTitle('댓글을 불러올 수 없습니다.');
                    setPopupText('잠시 후 다시 시도해 주세요.');
                    setPopupId('CLOSE');
                    setShowPopup(true);
                } finally {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 500);
                }
            }
        })();
    }, [blogId, page, size]);

    const handleSearch = async (value: number, keyword: string) => {
        setSearchKeyword(keyword);

        const res = await customFetch<any>('/blog/comments', {
            queryKey: ['search', 'comments', keyword, value, size, page],
            params: {
                blogId,
                ...(keyword && { keyword }),
                condition:
                    value === 0 ? 'ALL' : value === 1 ? 'TITLE' : 'CONTENT',
                size,
                page: page - 1,
            },
        });

        if (res.isError) {
            setPopupTitle('댓글을 검색하지 못했습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
            return;
        }

        setIsSearch(true);
        setComments(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalComments(res.data.totalElements);
    };

    const handleItemsPerValueChange = (value: number | string) => {
        setSize(+value);
    };

    const handleSelect = (comments: Comment[]) => {
        setSelectedComments(comments);
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const handleConfirm = () => {
        setShowPopup(false);
        if (popupId === 'REFRESH') {
            router.refresh();
        }
    };

    const handleDeleteConfirm = async () => {
        for (const comment of selectedComments) {
            try {
                const res = await customFetch<any>(
                    `/comments/${comment.commentId}`,
                    {
                        method: 'DELETE',
                        queryKey: ['deleteComment', comment.commentId],
                    },
                );

                if (res.isError) {
                    throw new Error(res.error || '댓글을 삭제할 수 없습니다.');
                }

                setShowConfirmPopup(false);
                setPopupTitle('삭제되었습니다.');
                setPopupText('');
                setPopupId('REFRESH');
                setShowPopup(true);
            } catch (e) {
                setShowConfirmPopup(false);
                setPopupTitle('댓글을 삭제할 수 없습니다.');
                setPopupText('잠시 후 다시 시도해 주세요.');
                setPopupId('CLOSE');
                setShowPopup(true);
            }
        }
    };

    const handleDelete = async () => {
        setPopupTitle(
            `${selectedComments.length}건의 댓글을 삭제하시겠습니까?`,
        );
        setPopupText('삭제한 댓글은 복구할 수 없습니다.');
        setShowConfirmPopup(true);
    };

    return (
        <fieldset>
            <div className="flex">
                <legend className="mb-8 text-lg font-bold">댓글 관리</legend>
                <span
                    className="relative ml-0.5 text-sm text-customLightBlue-200"
                    style={{ top: '-0.1em' }}
                >
                    {totalComments}
                </span>
            </div>
            <SearchContent onSearch={handleSearch} />
            {isLoading ? (
                <div className="flex h-24 items-center justify-center">
                    <div className="spinner-brown" />
                </div>
            ) : comments && comments.length > 0 ? (
                <>
                    <div className="mb-4 flex items-center justify-between">
                        <button
                            className="rounded bg-customBeige-100 px-3 py-2.5 text-customBrown-100"
                            disabled={selectedComments.length < 1}
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
                    <CommentSettingList
                        contents={comments}
                        onSelect={handleSelect}
                    />
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />{' '}
                </>
            ) : isSearch ? (
                <SearchNothing keyword={searchKeyword} />
            ) : (
                <div className="mt-6"> 댓글이 존재하지 않습니다. </div>
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