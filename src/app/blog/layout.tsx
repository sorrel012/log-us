'use client';

import BlogHeader from '@/components/header/BlogHeader';
import Sidebar from '@/components/sidebar/Sidebar';
import { usePathname } from 'next/navigation';

export default function BlogLayout({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    const params = usePathname();
    const isSidebarShow = !params.includes('newpost');

    return (
        <>
            {modal}
            <BlogHeader />
            <div className="flex">
                {isSidebarShow && <Sidebar />}
                {isSidebarShow && (
                    <div className="font-default ml-[20%] w-[80%] p-6 lg:ml-[16.6667%] lg:w-[83.3333%]">
                        {children}
                    </div>
                )}
                {!isSidebarShow && (
                    <div className="h-full w-full">{children}</div>
                )}
            </div>
        </>
    );
}
