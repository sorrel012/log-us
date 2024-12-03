'use client';

import { BlogInfo, useBlogStore } from '@/store/useBlogStore';
import { useEffect } from 'react';
import { customFetch } from '@/utils/customFetch';

export default function MyLogSettingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { setBlogId, setBlogInfo } = useBlogStore();

    useEffect(() => {
        (async () => {
            const res = await customFetch('/blog/my-log', {
                queryKey: ['my-log'],
            });

            if (res.data.blogId) {
                setBlogId(res.data.blogId);

                const blogInfoRes = await customFetch<BlogInfo>('/blog-info', {
                    queryKey: ['memberInfo'],
                    params: { blogId: res.data.blogId },
                });

                setBlogInfo(blogInfoRes.data!);
            }
        })();
    }, [setBlogId, setBlogInfo]);

    return <>{children}</>;
}
