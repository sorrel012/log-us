'use client';

import BlogHeader from '@/components/header/blogHeader';
import React, { useEffect, useState } from 'react';
import { BlogInfo, useBlogStore } from '@/store/useBlogStore';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/sidebar/Sidebar';
import { customFetch } from '@/utils/customFetch';

export default function BlogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { blogId, setBlogId, setBlogInfo } = useBlogStore();
    const pathname = usePathname();
    const blogAddress = pathname.split('/')[1];

    const isShow = !pathname.includes('newpost');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        customFetch('/blog-id', {
            params: { blogAddress },
            queryKey: ['blogId', blogAddress],
        }).then((response) => {
            setBlogId(response.data.blogId);
        });
    }, [blogAddress, setBlogId]);

    useEffect(() => {
        if (blogId) {
            customFetch<BlogInfo>('/blog-info', {
                queryKey: ['memberInfo'],
                params: { blogId },
            }).then((response) => {
                setBlogInfo(response.data!);
            });
        }
    }, [blogId, setBlogInfo]);

    const handleSidebarClick = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <>
            {isShow && <BlogHeader />}
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
