'use client';

import PanelModule from '@/components/sidebar/PanelModule';
import { useParams } from 'next/navigation';
import { BlogInfo, useBlogStore } from '@/store/useBlogStore';
import { useEffect, useState } from 'react';
import { customFetch } from '@/utils/customFetch';
import { useAuthStore } from '@/store/useAuthStore';

export default function SettingSidebar({
    isOurLogPath,
}: {
    isOurLogPath: boolean;
}) {
    const { loginUser } = useAuthStore();
    const { setBlogId, setBlogInfo, setIsMember, setUserBlogAuth } =
        useBlogStore();
    const { blogAddress } = useParams();

    const myLogPath = '/setting/my-log';
    const [MY_LOG, setMY_LOG] = useState([
        { value: '글 관리', link: myLogPath },
        {
            value: '댓글 관리',
            link: myLogPath,
        },
        { value: '통계', link: myLogPath },
    ]);

    const basePath = '/setting';
    const PROFILE = [
        { value: '회원정보 변경', link: `${basePath}` },
        { value: '구독 블로그 관리', link: `${basePath}/following` },
    ];
    const OUR_LOG = [
        { value: '블로그 목록', link: `${basePath}/blogs` },
        { value: '블로그 개설', link: `${basePath}/new-blog` },
    ];

    const ourLogBasePath = `/setting/our-log/${blogAddress}`;
    const [OUR_LOG_DTL, setOUR_LOG_DTL] = useState([
        { value: '블로그 목록', link: `${basePath}/blogs` },
        { value: '블로그 개설', link: `${basePath}/new-blog` },
        { value: '글 관리', link: `${ourLogBasePath}/posts` },
        { value: '댓글 관리', link: `${ourLogBasePath}/comments` },
        { value: '통계', link: `${ourLogBasePath}/statistics` },
    ]);

    useEffect(() => {
        (async () => {
            setBlogInfo(null);
            if (isOurLogPath) {
                setBlogInfo(null);
                const response = await customFetch('/blog-id', {
                    params: { blogAddress },
                    queryKey: ['blogId', blogAddress, 'share'],
                });

                if (response?.data?.blogId) {
                    setBlogId(response.data.blogId);

                    const blogInfoRes = await customFetch<BlogInfo>(
                        '/blog-info',
                        {
                            queryKey: ['memberInfo'],
                            params: { blogId: response.data.blogId },
                        },
                    );

                    const data = blogInfoRes.data;
                    setBlogInfo(data!);
                    const me = data?.members.filter(
                        (member) => member.memberId === loginUser,
                    );
                    setIsMember(me.length === 1);
                    if (setIsMember.length > 0) {
                        setUserBlogAuth(me[0]?.blogAuth);
                    }
                    if (me[0]?.blogAuth === 'OWNER') {
                        setOUR_LOG_DTL([
                            { value: '블로그 목록', link: `${basePath}/blogs` },
                            {
                                value: '블로그 개설',
                                link: `${basePath}/new-blog`,
                            },
                            {
                                value: '블로그 정보 변경',
                                link: `${ourLogBasePath}`,
                            },
                            {
                                value: '블로그 권한 관리',
                                link: `${ourLogBasePath}/permissions`,
                            },
                            {
                                value: '글 관리',
                                link: `${ourLogBasePath}/posts`,
                            },
                            {
                                value: '댓글 관리',
                                link: `${ourLogBasePath}/comments`,
                            },
                            {
                                value: '시리즈 관리',
                                link: `${ourLogBasePath}/series`,
                            },
                            {
                                value: '구독자 관리',
                                link: `${ourLogBasePath}/follower`,
                            },
                            {
                                value: '통계',
                                link: `${ourLogBasePath}/statistics`,
                            },
                        ]);
                    } else if (me[0]?.blogAuth === 'ADMIN') {
                        setOUR_LOG_DTL([
                            { value: '블로그 목록', link: `${basePath}/blogs` },
                            {
                                value: '블로그 개설',
                                link: `${basePath}/new-blog`,
                            },
                            {
                                value: '블로그 권한 관리',
                                link: `${ourLogBasePath}/permissions`,
                            },
                            {
                                value: '글 관리',
                                link: `${ourLogBasePath}/posts`,
                            },
                            {
                                value: '댓글 관리',
                                link: `${ourLogBasePath}/comments`,
                            },
                            {
                                value: '시리즈 관리',
                                link: `${ourLogBasePath}/series`,
                            },
                            {
                                value: '구독자 관리',
                                link: `${ourLogBasePath}/follower`,
                            },
                            {
                                value: '통계',
                                link: `${ourLogBasePath}/statistics`,
                            },
                        ]);
                    } else {
                        setOUR_LOG_DTL([
                            { value: '블로그 목록', link: `${basePath}/blogs` },
                            {
                                value: '블로그 개설',
                                link: `${basePath}/new-blog`,
                            },
                            {
                                value: '글 관리',
                                link: `${ourLogBasePath}/posts`,
                            },
                            {
                                value: '댓글 관리',
                                link: `${ourLogBasePath}/comments`,
                            },
                            {
                                value: '통계',
                                link: `${ourLogBasePath}/statistics`,
                            },
                        ]);
                    }
                }
            } else {
                const res = await customFetch('/blog/my-log', {
                    queryKey: ['my-log'],
                });

                if (res.data.blogId) {
                    setBlogId(res.data.blogId);

                    const blogInfoRes = await customFetch<BlogInfo>(
                        '/blog-info',
                        {
                            queryKey: ['memberInfo'],
                            params: { blogId: res.data.blogId },
                        },
                    );

                    setBlogInfo(blogInfoRes.data!);
                    setIsMember(false);
                    setUserBlogAuth('');

                    const myLogBasePath = `/setting/my-log/${blogInfoRes.data?.blogAddress}`;
                    const myLog = [
                        { value: '블로그 정보 변경', link: `${myLogBasePath}` },
                        { value: '글 관리', link: `${myLogBasePath}/posts` },
                        {
                            value: '댓글 관리',
                            link: `${myLogBasePath}/comments`,
                        },
                        {
                            value: '시리즈 관리',
                            link: `${myLogBasePath}/series`,
                        },
                        {
                            value: '구독자 관리',
                            link: `${myLogBasePath}/follower`,
                        },
                        { value: '통계', link: `${myLogBasePath}/statistics` },
                    ];
                    setMY_LOG(myLog);
                }
            }
        })();
    }, [
        blogAddress,
        isOurLogPath,
        loginUser,
        setBlogId,
        setBlogInfo,
        setIsMember,
        setUserBlogAuth,
    ]);

    return (
        <aside className="fixed flex h-[100vh] w-1/5 flex-col gap-12 overflow-y-auto border-r border-solid border-customLightBlue-100 p-5 pt-8 lg:w-1/6">
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
