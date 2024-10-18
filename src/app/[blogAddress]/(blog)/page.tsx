'use client';

import SeriesGrid from '@/components/blog/series/SeriesGrid';

export default function BlogMain() {
    return (
        <section className="max-w-screen-3xl mx-auto">
            <h2 className="mb-8 font-bold">시리즈</h2>
            <SeriesGrid />
        </section>
    );
}
