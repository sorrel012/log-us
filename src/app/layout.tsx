import type { Metadata } from 'next';
import { Do_Hyeon } from 'next/font/google';
import '../styles/globals.scss';

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
            <body className={dohyeon.className}>
                <div id="modal"></div>
                {children}
            </body>
        </html>
    );
}
