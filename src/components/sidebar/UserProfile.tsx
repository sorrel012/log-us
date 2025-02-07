'use client';

import OurLogsUserProfile from '@/components/sidebar/OurLogsUserProfile';
import MyLogUserProfile from '@/components/sidebar/MyLogUserProfile';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBlogStore } from '@/store/useBlogStore';
import { useAuthStore } from '@/store/useAuthStore';
import { customFetch } from '@/utils/customFetch';

export interface Member {
    memberId: number;
    loginId?: string;
    nickname: string;
    blogAuth: string;
    imgUrl?: string;
    myLogAddress: string;
    email?: string;
    createDate?: string;
}

export default function UserProfile() {
    const { loginUser } = useAuthStore();
    const { blogId, blogInfo } = useBlogStore();

    const router = useRouter();

    const [isSubscribe, setIsSubscribe] = useState(false);
    const [followId, setFollowId] = useState(0);

    const isContain =
        blogInfo?.members?.some((member) => member.memberId === loginUser) ||
        false;

    useEffect(() => {
        (async () => {
            const res = await customFetch<any>('/follow', {
                queryKey: ['follow', blogId],
                params: { page: 0, size: 1000 },
            });

            const followings = res?.data.content || [];
            followings.forEach((following) => {
                if (following.blogId === blogId) {
                    setIsSubscribe(true);
                    setFollowId(following.followId);
                }
            });
        })();
    }, []);

    const handleButtonClick = () => {
        router.push(`/${blogInfo?.blogAddress}/newpost`);
    };

    const handleSubscribe = async () => {
        let url;
        let method;

        if (isSubscribe) {
            url = '/follow?followId=' + followId;
            method = 'DELETE';
        } else {
            url = '/follow?blogId=' + blogId;
            method = 'POST';
        }

        const res = await customFetch<any>(url, {
            queryKey: ['follow', method],
            method,
        });

        if (!res.isError) {
            setIsSubscribe((prevState) => !prevState);
        }
    };

    return (
        <>
            <section className="mb-4 flex flex-col border-b border-solid border-customLightBlue-100 pb-4 lg:mb-7 lg:pb-6">
                {blogInfo?.shareYn === 'N' && (
                    <MyLogUserProfile members={blogInfo.members} />
                )}
                {blogInfo?.shareYn === 'Y' && (
                    <OurLogsUserProfile members={blogInfo.members} />
                )}
                <p className="font-default mt-2 px-2 text-sm leading-4">
                    {blogInfo?.introduce}
                </p>
                {isContain ? (
                    <div className="text-center">
                        <button
                            className="font-default mt-4 rounded-md bg-customLightBlue-200 px-3 py-1.5 text-white outline-none hover:bg-customLightBlue-200/85"
                            onClick={handleButtonClick}
                        >
                            글쓰기
                        </button>
                    </div>
                ) : (
                    loginUser &&
                    (isSubscribe ? (
                        <div className="text-center">
                            <button
                                className="font-default mt-4 rounded-md bg-customLightBlue-200 px-3 py-1.5 text-white outline-none hover:bg-customLightBlue-200/85"
                                onClick={handleSubscribe}
                            >
                                구독 취소
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <button
                                className="font-default mt-4 rounded-md bg-customLightBlue-200 px-3 py-1.5 text-white outline-none hover:bg-customLightBlue-200/85"
                                onClick={handleSubscribe}
                            >
                                구독
                            </button>
                        </div>
                    ))
                )}
            </section>
        </>
    );
}