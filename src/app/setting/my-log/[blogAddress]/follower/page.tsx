'use client';

import UserGrid from '@/components/UserGrid';
import React, { useEffect, useState } from 'react';
import { useBlogStore } from '@/store/useBlogStore';
import AlertPopup from '@/components/AlertPopup';
import { customFetch } from '@/utils/customFetch';
import { IoIosArrowDown } from 'react-icons/io';

export default function FollowerPage() {
    const { blogId } = useBlogStore();

    const [size, setSize] = useState(30);
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    useEffect(() => {
        setUsers([]);
        setPage(1);
    }, [blogId]);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        if (blogId) {
            (async () => {
                const params = {
                    blogId,
                    size,
                    page: page - 1,
                };

                const res = await customFetch<any>('/follower', {
                    queryKey: ['follower', blogId, size, page],
                    params: params,
                });

                if (!isMounted) return;

                if (res.isError) {
                    setPopupTitle('구독자 목록을 불러오지 못했습니다.');
                    setPopupText('잠시 후 다시 시도해 주세요.');
                    setShowPopup(true);
                    return;
                }

                const userData = res.data.content;
                if (page === 1) {
                    setUsers(userData);
                } else {
                    setUsers((prevState) => [...prevState, ...userData]);
                }
                setTotalPages(res.data.totalPages);
                setIsLoading(false);
            })();
        }

        return () => {
            isMounted = false;
        };
    }, [blogId, page, size]);

    const handleScroll = () => {
        if (page === totalPages) {
            return;
        }
        setPage((prevPage) => prevPage + 1);
    };

    const handleFollowCancel = async (followId: number) => {
        const res = await customFetch('/follower?followId=' + followId, {
            method: 'DELETE',
            queryKey: ['delete', 'follower', followId],
        });

        if (res.isError) {
            setPopupTitle('구독을 취소하지 못했습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
            return;
        }

        setPopupTitle('구독이 취소되었습니다.');
        setPopupText('');
        setTimeout(() => {
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.followId !== followId),
            );
        }, 600);
        setShowPopup(true);
        return;
    };

    return (
        <fieldset>
            <legend className="mb-8 text-lg font-bold">구독자 관리</legend>
            {isLoading ? (
                <div className="flex h-24 items-center justify-center">
                    <div className="spinner-brown" />
                </div>
            ) : users && users.length > 0 ? (
                <>
                    <div className="min-h-[40vh]">
                        <UserGrid
                            users={users}
                            type="BLOG"
                            onButtonClick={handleFollowCancel}
                        />
                    </div>
                    {page !== totalPages && (
                        <div className="mt-10 w-full text-center">
                            <button
                                className="text-customGray-100"
                                onClick={handleScroll}
                            >
                                <IoIosArrowDown className="size-10" />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div>구독자가 없습니다.</div>
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