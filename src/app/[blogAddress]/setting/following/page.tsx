'use client';

import Pagination from '@/components/Pagination';
import { useEffect, useState } from 'react';
import { customFetch } from '@/utils/customFetch';
import AlertPopup from '@/components/AlertPopup';
import FollowingList from '@/components/blog/setting/FollowingList';
import { FollowingsType } from '@/components/blog/setting/FollowingCard';

export default function FollowingPage() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);

    const [followings, setFollowings] = useState<FollowingsType[]>();

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await customFetch('/follow', {
                queryKey: ['follow', page, size],
                params: { page: page - 1, size },
            });

            if (res.isError) {
                setShowPopup(true);
            }

            setFollowings(res?.data.content);
            setTotalPages(Math.ceil(res?.data.totalElements / size));
        })();
    }, [page]);

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    return (
        <section>
            <h2 className="mb-8 text-lg font-bold">구독 블로그 목록</h2>
            {followings && followings.length >= 1 ? (
                <>
                    <FollowingList followings={followings} />
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
        </section>
    );
}
