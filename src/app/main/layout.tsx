'use client';

import MainHeader from '@/components/header/MainHeader';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <MainHeader />
            {children}
        </div>
    );
}