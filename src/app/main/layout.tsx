'use client';

import MainHeader from '@/components/header/MainHeader';
import MainGrid from '@/components/main/MainGrid';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <MainHeader />
            <div className='bg-customBeige-100/80'>
                <MainGrid/>
            </div>
            
            {children}
        </div>
    );
}