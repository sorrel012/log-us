'use client';

import BlogHeader from '@/components/header/BlogHeader';

export default function BlogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <BlogHeader />
            {children}
        </div>
    );
}