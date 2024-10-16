'use client';

import BlogHeader from '@/components/header/BlogHeader';
import Sidebar from '@/components/sidebar/Sidebar';

export default function BlogLayout({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    return (
        <>
            {modal}
            <BlogHeader />
            <div className="flex">
                <Sidebar />
                <div className="font-default ml-[20%] w-[80%] lg:ml-[16.6667%] lg:w-[83.3333%]">
                    {children}
                </div>
            </div>
        </>
    );
}
