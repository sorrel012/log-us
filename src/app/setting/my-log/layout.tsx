'use client';

import { useBlogStore } from '@/store/useBlogStore';
import { useEffect } from 'react';
import { customFetch } from '@/utils/customFetch';

export default function MyLogSettingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { setBlogId } = useBlogStore();

    useEffect(() => {
        (async () => {
            const res = await customFetch('/blog/my-log', {
                queryKey: ['my-log'],
            });
            setBlogId(res.data.blogId);
        })();
    }, [setBlogId]);

    return <>{children}</>;
}
