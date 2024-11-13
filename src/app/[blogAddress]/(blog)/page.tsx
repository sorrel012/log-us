'use client';

import SeriesGrid from '@/components/blog/series/SeriesGrid';

export default function BlogMain() {
    return (
        <section className="mx-auto max-w-screen-3xl">
            <h2 className="mb-8 font-bold">시리즈</h2>
            <SeriesGrid />
        </section>
    );
}
