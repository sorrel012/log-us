'use client';

import SettingSidebar from '@/components/blog/setting/SettingSidebar';
import { usePathname } from 'next/navigation';

export default function SettingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathName = usePathname();
    const isOurLogPath = pathName.includes('/our-log');

    return (
        <div className="font-default flex">
            <SettingSidebar isOurLogPath={isOurLogPath} />
            <div
                className="ml-[20%] h-screen w-[80%] overflow-y-auto p-10 lg:ml-[16.6667%] lg:w-[83.3333%]"
                id="scroll-container"
            >
                <div className="mx-auto max-w-screen-3xl">{children}</div>
            </div>
        </div>
    );
}
