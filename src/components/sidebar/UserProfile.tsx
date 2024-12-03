import OurLogsUserProfile from '@/components/sidebar/OurLogsUserProfile';
import MyLogUserProfile from '@/components/sidebar/MyLogUserProfile';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useBlogStore } from '@/store/useBlogStore';

export interface Member {
    memberId: number;
    nickname: string;
    blogAuth: string;
    imgUrl?: string;
    myLogAddress: string;
    email?: string;
}

export default function UserProfile() {
    const { blogInfo } = useBlogStore();
    const router = useRouter();
    const loginMember = 1; // TODO Zustand에서 받아와야 함

    const isContain =
        blogInfo?.members?.some((member) => member.memberId === loginMember) ||
        false;

    const handleButtonClick = () => {
        router.push(`/${blogInfo?.blogAddress}/newpost`);
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
                {isContain && (
                    <div className="text-center">
                        {/*TODO 로그인 한 사용자와 비교*/}
                        <button
                            className="font-default mt-4 rounded-md bg-customLightBlue-200 px-3 py-1.5 text-white outline-none hover:bg-customLightBlue-200/85"
                            onClick={handleButtonClick}
                        >
                            글쓰기
                        </button>
                    </div>
                )}
            </section>
        </>
    );
}
