'use client';

import BlogHeader from '@/components/header/blogHeader';
import React, { useEffect, useState } from 'react';
import { BlogInfo, useBlogStore } from '@/store/useBlogStore';
import { useParams, usePathname } from 'next/navigation';
import Sidebar from '@/components/sidebar/Sidebar';
import { customFetch } from '@/utils/customFetch';

export default function BlogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // TODO zustand로 수정
    const loginUser = 6;
    const { setBlogId, setBlogInfo, setIsMember, setUserBlogAuth } =
        useBlogStore();
    const pathname = usePathname();
    const isShow = !pathname.includes('newpost');
    const { blogAddress } = useParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await customFetch('/blog-id', {
                    params: { blogAddress },
                    queryKey: ['blogId', blogAddress],
                });

                if (response.data.blogId) {
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
                        setUserBlogAuth(me[0].blogAuth);
                    }
                }
            } catch (error) {}
        })();
    }, [blogAddress, setBlogId, setBlogInfo, setIsMember, setUserBlogAuth]);

    const handleSidebarClick = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <>
            <div className="sticky top-0 z-50 bg-white">
                {isShow && <BlogHeader />}
            </div>
            <main className="mx-auto flex">
                {isShow && (
                    <Sidebar
                        isOpen={isSidebarOpen}
                        isShow={isShow}
                        handleSidebarClick={handleSidebarClick}
                    />
                )}
                <div className={getStyle(isShow, isSidebarOpen)}>
                    {children}
                </div>
            </main>
        </>
    );
}

function getStyle(isShow: boolean, isSidebarOpen: boolean) {
    let childrenStyle =
        'font-default overflow-y-auto pb-24 transition-all duration-500 ease-in-out';

    if (isShow) {
        if (isSidebarOpen) {
            childrenStyle +=
                ' ml-[20%] h-screen w-[80%] p-10 lg:ml-[16.6667%] lg:w-[83.3333%]';
        } else {
            childrenStyle += ' h-screen px-24 py-16 w-full';
        }
    } else {
        childrenStyle += ' h-full w-full';
    }

    return childrenStyle;
}
