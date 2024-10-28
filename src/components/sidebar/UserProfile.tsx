import { useFetch } from '@/hooks/useFetch';
import OurLogsUserProfile from '@/components/sidebar/OurLogsUserProfile';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import MyLogUserProfile from '@/components/sidebar/MyLogUserProfile';
import React, { useEffect, useState } from 'react';
import Popup from '@/components/Popup';
import { useRouter } from 'next/navigation';

export interface Member {
    memberId: number;
    nickname: string;
    blogAuth: string;
    imgUrl?: string;
    myLogAddress: string;
}

export interface BlogInfo {
    shareYn: string;
    blogAddress: string;
    introduce?: string;
    members: Member[];
}

export default function UserProfile() {
    const router = useRouter();

    const { data, isLoading, isError, error } = useFetch<BlogInfo>(
        '/blog-info.json',
        {
            queryKey: ['memberInfo'],
        },
    );
    const loginMember = 1; // TODO Zustand에서 받아와야 함
    const isContain =
        data?.members?.some((member) => member.memberId === loginMember) ||
        false;

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    useEffect(() => {
        if (isError && !showPopup) {
            setPopupMessage(
                isError ? error : '알 수 없는 오류가 발생했습니다.',
            );
            setShowPopup(true);
        }
    }, [isError, error, data]);
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleButtonClick = () => {
        router.push(`/${data?.blogAddress}/newpost`);
    };

    return (
        <>
            <section className="mb-4 flex flex-col border-b border-solid border-customLightBlue-100 pb-4 lg:mb-7 lg:pb-6">
                {isLoading && (
                    <div className="mt-3 px-2">
                        <LoadingSpinner />
                    </div>
                )}
                {data?.shareYn === 'N' && (
                    <MyLogUserProfile members={data.members} />
                )}
                {data?.shareYn === 'Y' && (
                    <OurLogsUserProfile members={data.members} />
                )}
                <p className="font-default mt-2 px-2 text-sm leading-4">
                    {data?.introduce}
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
            <Popup
                show={showPopup}
                title="에러"
                text={popupMessage}
                onConfirm={handleClosePopup}
            />
        </>
    );
}
