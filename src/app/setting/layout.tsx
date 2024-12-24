'use client';

import SettingSidebar from '@/components/blog/setting/SettingSidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { useBlogStore } from '@/store/useBlogStore';

export default function SettingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const pathName = usePathname();
    const isOurLogPath = pathName.includes('/our-log');
    const { loginUser } = useAuthStore();
    const { blogInfo } = useBlogStore();
    const [isMember, setIsMember] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!loginUser) {
            router.push('/');
        } else if (isOurLogPath) {
            if (
                blogInfo?.members.filter(
                    (member) => member.memberId === loginUser,
                ).length < 1
            ) {
                setIsMember(false);
                router.push('/setting');
            } else {
                setIsMember(true);
            }
        }
        setIsReady(true);
    }, [blogInfo?.members, isOurLogPath, loginUser, router]);

    if (!isReady) {
        return null;
    }

    return (
        <div className="font-default flex">
            {(loginUser || isMember) && (
                <>
                    <SettingSidebar isOurLogPath={isOurLogPath} />
                    <div
                        className="ml-[20%] h-screen w-[80%] overflow-y-auto p-10 lg:ml-[16.6667%] lg:w-[83.3333%]"
                        id="scroll-container"
                    >
                        <div className="mx-auto max-w-screen-3xl">
                            {children}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
