'use client';

import BlogHeader from '@/components/header/blogHeader';
import Sidebar from '@/components/sidebar/Sidebar';
import Popup from '@/components/Popup';
import React, { useEffect, useState } from 'react';
import { BlogInfo, useBlogStore } from '@/store/useBlogStore';
import { usePathname } from 'next/navigation';
import { useFetch } from '@/hooks/useFetch';

export default function BlogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { setBlogId, setBlogInfo } = useBlogStore();
    const pathname = usePathname();
    const blogAddress = pathname.split('/')[1];

    const isShow = !pathname.includes('newpost');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const { data, isLoading, isError, error } = useFetch('/blog-id.json', {
        params: { blogAddress: blogAddress },
        queryKey: ['blogId', blogAddress],
    });

    useEffect(() => {
        if (!isLoading && data) {
            setBlogId(data.blogId);
        } else if (!isLoading && !data) {
            setPopupMessage('블로그 정보를 받아올 수 없습니다.');
            setShowPopup(true);
        }
    }, [data, isLoading, setBlogId]);

    const { data: infoData, isLoading: isInfoLoading } = useFetch<BlogInfo>(
        '/blog-info.json',
        {
            queryKey: ['memberInfo'],
        },
    );

    useEffect(() => {
        if (!isInfoLoading && infoData) {
            setBlogInfo(infoData);
        } else if (!isInfoLoading && !infoData) {
            setPopupMessage('블로그 정보를 받아올 수 없습니다.');
            setShowPopup(true);
        }
    }, [infoData, isInfoLoading, setBlogInfo]);

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
            <Popup
                show={showPopup}
                title="에러"
                text={popupMessage}
                onConfirm={handleClosePopup}
            />
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
