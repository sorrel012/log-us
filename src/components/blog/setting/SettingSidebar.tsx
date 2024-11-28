'use client';

import PanelModule from '@/components/sidebar/PanelModule';
import { usePathname, useRouter } from 'next/navigation';
import { BlogInfo, useBlogStore } from '@/store/useBlogStore';
import { useEffect, useState } from 'react';
import { customFetch } from '@/utils/customFetch';
import AlertPopup from '@/components/AlertPopup';

export default function SettingSidebar() {
    const router = useRouter();
    const pathName = usePathname();
    const isOurLogPath = pathName.includes('/our-log');
    const blogAddress = pathName.split('/')[1];
    const { blogId, setBlogId, setBlogInfo } = useBlogStore();
    //TODO zustand에서 받아오는 걸로 수정
    const loginUser = 1;

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const response = await customFetch('/blog-id', {
                    params: { blogAddress },
                    queryKey: ['blogId', blogAddress],
                });

                if (response.isError) {
                    throw new Error(
                        response.error || '블로그 아이디 조회 에러',
                    );
                } else {
                    setBlogId(response.data.blogId);

                    const res = await customFetch<BlogInfo>('/blog-info', {
                        queryKey: ['memberInfo'],
                        params: { blogId: response.data.blogId },
                    });

                    if (res.isError) {
                        throw new Error(res.error || '블로그 정보 조회 에러');
                    } else {
                        const isMember = res.data?.members.some(
                            (member) => member.memberId === loginUser,
                        );
                        if (!res.data || !isMember) {
                            throw new Error(
                                res.error || '블로그 정보 조회 에러',
                            );
                        }

                        setBlogInfo(res.data!);
                    }
                }
            } catch (error) {
                setPopupTitle('유효하지 않은 접근입니다.');
                setShowPopup(true);
                return;
            }
        })();
    }, [blogAddress, setBlogId, setBlogInfo]);

    const basePath = `/${blogAddress}/setting`;
    const PROFILE = [
        { value: '회원정보 변경', link: `${basePath}` },
        { value: '구독 블로그 관리', link: `${basePath}/following` },
    ];
    const MY_LOG = [
        { value: '블로그 정보 변경', link: `${basePath}/info` },
        { value: '글 관리', link: `${basePath}/posts` },
        { value: '댓글 관리', link: `${basePath}/comments` },
        { value: '시리즈 관리', link: `${basePath}/series` },
        { value: '구독자 관리', link: `${basePath}/follower` },
        { value: '통계', link: `${basePath}/statistics` },
    ];
    const OUR_LOG = [
        { value: '블로그 목록', link: `${basePath}/lists` },
        { value: '블로그 개설', link: `${basePath}/new-blog` },
    ];

    const ourLogBasePath = `/${blogAddress}/setting/our-log`;
    const OUR_LOG_DTL = [
        { value: '글 관리', link: `${ourLogBasePath}/posts` },
        { value: '댓글 관리', link: `${ourLogBasePath}/comments` },
        { value: '시리즈 관리', link: `${ourLogBasePath}/series` },
        { value: '구독자 관리', link: `${ourLogBasePath}/subscribers` },
        { value: '통계', link: `${ourLogBasePath}/statistics` },
        { value: '블로그 탈퇴', link: `${ourLogBasePath}/delete-blog` },
    ];

    const handleConfirm = () => {
        setShowPopup(false);
        router.push('/main');
    };

    return (
        <aside className="fixed flex h-[100vh] w-1/5 flex-col gap-12 overflow-y-auto border-r border-solid border-customLightBlue-100 p-5 pt-14 lg:w-1/6">
            <PanelModule title="프로필" contents={PROFILE} />
            <PanelModule title="My-log" contents={MY_LOG} />
            {!isOurLogPath && (
                <PanelModule title="Our-log" contents={OUR_LOG} />
            )}
            {isOurLogPath && (
                <PanelModule title="Our-log" contents={OUR_LOG_DTL} />
            )}
            <AlertPopup
                show={showPopup}
                onConfirm={handleConfirm}
                title={popupTitle}
            />
        </aside>
    );
}
