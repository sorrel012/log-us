import PanelModule from '@/components/sidebar/PanelModule';

const basePath = '/admin';
const statistics = [
    { title: '통계 ', link: `${basePath}/statistics` },
    { title: '상세 통계 ', link: `${basePath}/statistics-dtl` },
];
const member = [
    { title: '회원 정보 관리', link: `${basePath}/member-info` },
    { title: '회원 블로그 관리', link: `${basePath}/member-blog` },
];
const blogSystem = [
    { title: '글 관리', link: `${basePath}/posts` },
    { title: '댓글 관리', link: `${basePath}/comments` },
    { title: '카테고리 관리', link: `${basePath}/categories` },
    { title: '신고 컨텐츠 관리', link: `${basePath}/report` },
];
const admin = [
    { title: '내 정보 관리', link: `${basePath}/profile` },
    { title: '관리자 정보 관리', link: `${basePath}/admin-info` },
    { title: '관리자 권한 부여', link: `${basePath}/register` },
];
const adminPosts = [
    { title: '공지사항 관리', link: `${basePath}/announcement` },
    { title: 'Q&A 관리', link: `${basePath}/qna` },
];
const commonCodes = [
    { title: '공통 코드 관리', link: `${basePath}/common-codes` },
];

export default function AdminSidebar() {
    return (
        <aside className="fixed flex h-[100vh] w-1/6 flex-col gap-8 overflow-y-auto border-r border-solid border-customLightBlue-100 p-5 lg:w-[14.2851%]">
            <PanelModule title="통계" contents={statistics} />
            <PanelModule title="회원 관리" contents={member} />
            <PanelModule title="블로그 시스템 관리" contents={blogSystem} />
            <PanelModule title="관리자 관리" contents={admin} />
            <PanelModule title="관리자 게시글 관리" contents={adminPosts} />
            <PanelModule title="개발 공통 코드 관리" contents={commonCodes} />
        </aside>
    );
}
