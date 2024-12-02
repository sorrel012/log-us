'use client';

import PanelModule from '@/components/sidebar/PanelModule';
import { usePathname, useRouter } from 'next/navigation';

export default function SettingSidebar() {
    const router = useRouter();
    const pathName = usePathname();
    const isOurLogPath = pathName.includes('/our-log');

    const basePath = '/setting';
    const PROFILE = [
        { value: '회원정보 변경', link: `${basePath}` },
        { value: '구독 블로그 관리', link: `${basePath}/following` },
    ];
    const OUR_LOG = [
        { value: '블로그 목록', link: `${basePath}/blogs` },
        { value: '블로그 개설', link: `${basePath}/new-blog` },
    ];

    const myLogBasePath = '/setting/my-log';
    const MY_LOG = [
        { value: '블로그 정보 변경', link: `${myLogBasePath}` },
        { value: '글 관리', link: `${myLogBasePath}/posts` },
        { value: '댓글 관리', link: `${myLogBasePath}/comments` },
        { value: '시리즈 관리', link: `${myLogBasePath}/series` },
        { value: '구독자 관리', link: `${myLogBasePath}/follower` },
        { value: '통계', link: `${myLogBasePath}/statistics` },
    ];

    const ourLogBasePath = '/setting/our-log';
    const OUR_LOG_DTL = [
        { value: '글 관리', link: `${ourLogBasePath}/posts` },
        { value: '댓글 관리', link: `${ourLogBasePath}/comments` },
        { value: '시리즈 관리', link: `${ourLogBasePath}/series` },
        { value: '구독자 관리', link: `${ourLogBasePath}/subscribers` },
        { value: '통계', link: `${ourLogBasePath}/statistics` },
        { value: '블로그 탈퇴', link: `${ourLogBasePath}/delete-blog` },
    ];

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
        </aside>
    );
}
