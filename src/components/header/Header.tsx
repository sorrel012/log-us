'use client';

import { useParams, usePathname } from 'next/dist/client/components/navigation';
import BlogHeader from '@/components/header/blogHeader';
import MainHeader from '@/components/header/mainHeader';

export default function Header() {
    const { blogAddress } = useParams();
    const pathname = usePathname();
    const isShow = !pathname.includes('newpost');

    return <>{blogAddress ? isShow && <BlogHeader /> : <MainHeader />}</>;
}
