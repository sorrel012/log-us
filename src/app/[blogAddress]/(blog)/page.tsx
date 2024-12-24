'use client';

import SeriesGrid from '@/components/blog/series/SeriesGrid';
import { useEffect, useState } from 'react';
import { customFetch } from '@/utils/customFetch';
import { useSearchStore } from '@/store/useSearchStore';
import { Post } from '@/components/blog/post/PostCard';
import { IoSearch } from 'react-icons/io5';
import SelectBox from '@/components/SelectBox';
import { PAGE_SIZE_OPTIONS } from '@/constants/constant';
import Pagination from '@/components/Pagination';
import PostList from '@/components/blog/post/PostList';
import SearchNothing from '@/components/blog/setting/SearchNothing';
import { useBlogStore } from '@/store/useBlogStore';

export default function BlogMain() {
    const { blogKeyword, isBlogOpen } = useSearchStore();
    const { blogId } = useBlogStore();

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [posts, setPosts] = useState<Post[] | null>(null); // posts 초기값을 null로 설정

    useEffect(() => {
        if (isBlogOpen && blogKeyword) {
            const params = {
                blogId,
                keyword: blogKeyword,
                condition: 'ALL',
                size,
                page: page - 1,
            };

            (async () => {
                const res = await customFetch('/posts/search', {
                    queryKey: ['search', blogKeyword],
                    params: params,
                });

                if (res.isError) {
                    setPosts([]);
                    return;
                }

                setTotalPosts(res.data.totalElements);
                setTotalPages(res.data.totalPages);
                setPosts(res.data.content);
            })();
        } else {
            setPosts(null);
        }
    }, [isBlogOpen, blogKeyword, page, size]);

    const handleItemsPerValueChange = (value: number) => {
        setSize(value);
        setPage(1);
    };

    return (
        <fieldset className="mx-auto max-w-screen-3xl">
            {posts ? (
                <section>
                    <div className="flex justify-between border-b border-solid border-customLightBlue-100 pb-4">
                        <div className="flex items-center gap-1 text-lg">
                            <IoSearch className="text-2xl text-customDarkBlue-200" />
                            <span className="font-bold">검색 결과</span>
                        </div>
                        {posts.length > 0 && (
                            <div>
                                <SelectBox
                                    onItemsPerValueChange={
                                        handleItemsPerValueChange
                                    }
                                    items={PAGE_SIZE_OPTIONS}
                                />
                            </div>
                        )}
                    </div>
                    {posts.length > 0 ? (
                        <>
                            <div className="mt-4 text-center text-customDarkBlue-200">
                                [총 {totalPosts} 건]
                            </div>
                            <PostList posts={posts} />
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={(pageChange) =>
                                    setPage(pageChange)
                                }
                            />
                        </>
                    ) : (
                        <SearchNothing keyword={blogKeyword} />
                    )}
                </section>
            ) : (
                <>
                    <legend className="mb-8 font-bold">시리즈</legend>
                    <SeriesGrid />
                </>
            )}
        </fieldset>
    );
}
