'use client';

import React, { useEffect, useState } from 'react';
import { customFetch } from '@/utils/customFetch';
import AlertPopup from '@/components/AlertPopup';
import { FollowingsType } from '@/components/blog/setting/FollowingCard';
import FollowingGrid from '@/components/blog/setting/FollowingGrid';
import Pagination from '@/components/Pagination';

export default function FollowingPage() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);

    const [isLoading, setIsLoading] = useState(true);
    const [followings, setFollowings] = useState<FollowingsType[] | null>(null);

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const res = await customFetch<any>('/follow', {
                queryKey: ['follow', page, size],
                params: { page: page - 1, size },
            });

            if (res.isError) {
                setShowPopup(true);
            }

            setFollowings(res?.data.content || []);
            setTotalPages(Math.ceil(res?.data.totalElements / size));
            setIsLoading(false);
        })();
    }, [page]);

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    return (
        <fieldset>
            <legend className="mb-8 text-lg font-bold">구독 블로그 목록</legend>
            {isLoading ? (
                <div className="flex h-24 items-center justify-center">
                    <div className="spinner-brown" />
                </div>
            ) : followings && followings.length >= 1 ? (
                <>
                    <div className="min-h-[40vh]">
                        <FollowingGrid followings={followings} />
                    </div>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <div>구독 블로그가 존재하지 않습니다.</div>
            )}
            <AlertPopup
                show={showPopup}
                onConfirm={() => setShowPopup(false)}
                title="구독 블로그를 불러오지 못했습니다."
                text="잠시 후 다시 시도해 주세요."
            />
        </fieldset>
    );
}