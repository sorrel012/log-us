'use client';

import { useParams } from 'next/navigation';
import { useFetch } from '@/hooks/useFetch';

export default function PostListPage() {
    const { blogAddress, series } = useParams();
    const seriesId =
        series && typeof series === 'string'
            ? +decodeURIComponent(series).split('=')[1]
            : 0;

    const blogId = useFetch('/blog-id.json', {
        params: { blogAddress: blogAddress },
        queryKey: ['posts', seriesId],
    });

    return <div>seriesId: {seriesId}</div>;
}
