'use client';

import { useParams } from 'next/navigation';

export default function PostListPage() {
    const { blogAddress, series } = useParams();
    const seriesId =
        series && typeof series === 'string'
            ? +decodeURIComponent(series).split('=')[1]
            : 0;

    return <div>seriesId: {seriesId}</div>;
}
