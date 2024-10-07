'use client';

import { useParams } from 'next/navigation';
import { useBlogStore } from '@/store/useBlogStore';
import SelectBox from '@/components/SelectBox';
import { PAGE_SIZE_OPTIONS } from '@/utils/constant';
import { useState } from 'react';
import PostList from '@/components/blog/post/PostList';

export default function PostListPage() {
    const { blogId } = useBlogStore();
    const { series } = useParams();

    const [itemsPerPage, setItemsPerPage] = useState(20);

    const extractFromSeries = (
        series: string | string[],
        key: 'id' | 'name',
    ) => {
        const seriesStr = Array.isArray(series) ? series[0] : series;
        const [idPart, namePart] = decodeURIComponent(seriesStr).split('&');

        return key === 'id' ? +idPart.split('=')[1] : namePart;
    };

    const seriesId = +extractFromSeries(series, 'id');
    const seriesName = extractFromSeries(series, 'name');

    const handleItemsPerValueChange = (value: number) => {
        setItemsPerPage(value);
    };

    return (
        <section>
            <div className="flex h-full items-center justify-between border-b border-solid border-customLightBlue-100 pb-3">
                <h2 className="font-bold">{seriesName}</h2>
                <SelectBox
                    onItemsPerValueChange={handleItemsPerValueChange}
                    items={PAGE_SIZE_OPTIONS}
                    defaultValue={itemsPerPage}
                />
            </div>
            <PostList
                seriesId={seriesId}
                blogId={+blogId}
                size={itemsPerPage}
            />
        </section>
    );
}
