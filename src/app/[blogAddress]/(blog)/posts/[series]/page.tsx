'use client';

import { useParams } from 'next/navigation';
import { useBlogStore } from '@/store/useBlogStore';

export default function PostListPage() {
    const { blogId } = useBlogStore();
    const { series } = useParams();
    const seriesId =
        series && typeof series === 'string'
            ? +decodeURIComponent(series).split('=')[1]
            : 0;

    return (
        <>
            <div>seriesId: {seriesId}</div>
        </>
    );
}
