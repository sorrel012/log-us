import OurLogsUserProfile from '@/components/sidebar/OurLogsUserProfile';
import MyLogUserProfile from '@/components/sidebar/MyLogUserProfile';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useBlogStore } from '@/store/useBlogStore';
import { useAuthStore } from '@/store/useAuthStore';

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
    const { blogInfo } = useBlogStore();
    const router = useRouter();

    const isContain =
        blogInfo?.members?.some((member) => member.memberId === loginUser) ||
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