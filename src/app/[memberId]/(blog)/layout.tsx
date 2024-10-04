'use client';

import BlogHeader from '@/components/header/blogHeader';
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
                <div className={getStyle(isSidebarShow)}>{children}</div>
            </div>
        </>
    );
}

function getStyle(isSidebarShow: boolean) {
    let childrenStyle = 'font-default overflow-y-auto pb-24';

    if (isSidebarShow) {
        childrenStyle +=
            ' ml-[20%] h-screen w-[80%] p-10 lg:ml-[16.6667%] lg:w-[83.3333%]';
    } else {
        childrenStyle += ' h-full w-full';
    }

    return childrenStyle;
}
