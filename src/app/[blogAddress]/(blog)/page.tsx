'use client';

import SeriesGrid from '@/components/blog/series/SeriesGrid';

export default function BlogMain() {
    return (
        <filedset className="mx-auto max-w-screen-3xl">
            <legend className="mb-8 font-bold">시리즈</legend>
            <SeriesGrid />
        </filedset>
    );
}
