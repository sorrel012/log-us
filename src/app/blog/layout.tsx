'use client';

import BlogHeader from '@/components/header/blogHeader';

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