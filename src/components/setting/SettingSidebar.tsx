'use client';

import PanelModule from '@/components/sidebar/PanelModule';
import { usePathname } from 'next/navigation';

const basePath = '/setting';
const profile = [
    { title: '회원정보 변경', link: `${basePath}/profile` },
    { title: '구독 블로그 관리', link: `${basePath}/subscribe` },
];
const myLog = [
    { title: '블로그 정보 변경', link: `${basePath}/info` },
    { title: '글 관리', link: `${basePath}/posts` },
    { title: '댓글 관리', link: `${basePath}/comments` },
    { title: '시리즈 관리', link: `${basePath}/series` },
    { title: '구독자 관리', link: `${basePath}/subscribers` },
    { title: '통계', link: `${basePath}/statistics` },
];
const ourLog = [
    { title: '블로그 목록', link: `${basePath}/lists` },
    { title: '블로그 개설', link: `${basePath}/new-blog` },
];

const ourLogBasePath = '/setting/our-log';
const ourLogDtl = [
    { title: '글 관리', link: `${ourLogBasePath}/posts` },
    { title: '댓글 관리', link: `${ourLogBasePath}/comments` },
    { title: '시리즈 관리', link: `${ourLogBasePath}/series` },
    { title: '구독자 관리', link: `${ourLogBasePath}/subscribers` },
    { title: '통계', link: `${ourLogBasePath}/statistics` },
    { title: '블로그 탈퇴', link: `${ourLogBasePath}/delete-blog` },
];

export default function SettingSidebar() {
    const pathName = usePathname();
    const isOurLogPath = pathName.includes('/our-log');

    return (
        <aside className="fixed flex h-[100vh] w-1/6 flex-col gap-12 overflow-y-auto border-r border-solid border-customLightBlue-100 p-5 pt-14 lg:w-[14.2851%]">
            <PanelModule title="프로필" contents={profile} />
            <PanelModule title="My-log" contents={myLog} />
            {!isOurLogPath && (
                <>
                    <PanelModule title="Our-log" contents={ourLog} />
                </>
            )}
            {isOurLogPath && (
                <>
                    <PanelModule title="Our-log" contents={ourLogDtl} />
                </>
            )}
        </aside>
    );
}
