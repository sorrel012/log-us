'use client';

import { useParams } from 'next/navigation';
import { useBlogStore } from '@/store/useBlogStore';
import SelectBox from '@/components/SelectBox';
import { PAGE_SIZE_OPTIONS } from '@/utils/constant';
import { useEffect, useMemo, useState } from 'react';
import Pagination from '@/components/Pagination';
import { Post } from '@/components/blog/post/PostCard';
import { useFetch } from '@/hooks/useFetch';
import PostList from '@/components/blog/post/PostList';

export default function PostListPage() {
    const { blogId } = useBlogStore();
    const { series } = useParams();

    const [size, setSize] = useState(10);
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [posts, setPosts] = useState<Post[]>(null);

    const seriesValue = Array.isArray(series) ? series[0] : series || '';
    const [seriesId, seriesName] = seriesValue
        ? decodeURIComponent(seriesValue).split('&')
        : [null, ''];

    const params = useMemo(
        () => ({
            blogId,
            ...(seriesId !== 0 && { seriesId }),
            size,
            currPage: currPage - 1,
        }),
        [blogId, seriesId, size, currPage],
    );

    const { data, isLoading, isError, error } = useFetch('/posts.json', {
        queryKey: ['posts', blogId, seriesId, currPage, size],
        params,
    });

    useEffect(() => {
        if (data?.content && posts !== data.content) {
            setPosts(data.content);
            setTotalPages(data.totalPages || 1);
        }
    }, [data, posts]);

    const handleItemsPerValueChange = (value: number) => {
        setSize(value);
    };

    const handlePageChange = (page: number) => {
        setCurrPage(page);
    };

    return (
        <section>
            <div className="flex h-full items-center justify-between border-b border-solid border-customLightBlue-100 pb-3">
                <h2 className="font-bold">{seriesName}</h2>
                <SelectBox
                    onItemsPerValueChange={handleItemsPerValueChange}
                    items={PAGE_SIZE_OPTIONS}
                    defaultValue={size}
                />
            </div>
            {/*TODO 로딩 skeleton 구현*/}
            <PostList posts={posts} />
            <Pagination
                currentPage={currPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </section>
    );
}
