import type { Metadata } from 'next';
import { Do_Hyeon } from 'next/font/google';
import '../styles/globals.scss';
import MainHeader from '@/components/header/mainHeader';

const dohyeon = Do_Hyeon({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
    title: {
        template: '$s | Logus',
        default: 'Logus',
    },
    description: 'Shared Blog',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <MainHeader />
            <body className={dohyeon.className}>
                <div id="modal"></div>
                <MainHeader />
                {children}
            </body>
        </html>
    );
}
