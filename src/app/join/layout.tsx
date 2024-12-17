'use client';

import MainHeader from '@/components/header/MainHeader';
import Join from '@/components/join/Join';

export default function BlogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <MainHeader />
            <Join />
        </div>
    );
}