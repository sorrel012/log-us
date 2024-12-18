'use client';

import { useEffect, useState } from 'react';
import { customFetch } from '@/utils/customFetch';
import MainGrid, { ExtendedPost, MainData } from '@/components/main/MainGrid';
import SelectBox from '@/components/SelectBox';
import { MAIN_DATE_OPTIONS } from '@/constants/constant';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import FeedGrid from '@/components/main/FeedGrid';

type DateType = 'day' | 'week' | 'month' | 'year';

export default function Home() {
    const loginUser = useStore(useAuthStore, (state) => {
        return state.loginUser;
    });

    const [mainData, setMainData] = useState<MainData[]>([]);
    const [feedData, setFeedData] = useState<ExtendedPost[]>([]);
    const [grid, setGrid] = useState<'trend' | 'new' | 'feed'>('trend');
    const [date, setDate] = useState<DateType>('week');

    useEffect(() => {
        (async () => {
            let url;
            let params;

            if (grid === 'feed') {
                url = '/main/feed';
                params = {
                    size: 30,
                    grid,
                    date,
                };
            } else {
                url = '/main';
                params = {
                    size: 6,
                    grid,
                    date,
                };
            }

            const res = await customFetch<[]>(url, {
                queryKey: ['main', grid, date],
                params,
            });

            if (res.isError) return;

            if (grid === 'feed') {
                setFeedData(res.data.content || []);
            } else {
                setMainData(res.data || []);
            }
        })();
    }, [date, grid]);

    const handleItemsPerValueChange = (value: DateType) => {
        setDate(value);
    };

    return (
        <div className="font-default mt-10 h-screen">
            <div className="mx-auto flex max-w-screen-xl gap-8 px-6 text-lg *:cursor-pointer">
                <div
                    onClick={() => setGrid('trend')}
                    className={`${grid === 'trend' && 'border-b-2 border-solid border-black'}`}
                >
                    트렌드
                </div>
                <div
                    onClick={() => setGrid('new')}
                    className={`${grid === 'new' && 'border-b-2 border-solid border-black'}`}
                >
                    최신
                </div>
                {loginUser && (
                    <div
                        onClick={() => setGrid('feed')}
                        className={`${grid === 'feed' && 'border-b-2 border-solid border-black'}`}
                    >
                        피드
                    </div>
                )}
            </div>
            <div className="h-full overflow-y-scroll bg-customBeige-100 py-6">
                <div className="mx-auto max-w-screen-xl pb-32">
                    {grid !== 'feed' && (
                        <div className="flex justify-end px-6">
                            <SelectBox
                                onItemsPerValueChange={
                                    handleItemsPerValueChange
                                }
                                items={MAIN_DATE_OPTIONS}
                                defaultValue="week"
                                containerWidth="w-70"
                            />
                        </div>
                    )}

                    {grid === 'feed' ? (
                        <>
                            {feedData && feedData.length > 0 ? (
                                <FeedGrid content={feedData} />
                            ) : (
                                <div className="mt-10 px-6">
                                    구독 글이 없습니다.
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {mainData && mainData.length > 0 ? (
                                mainData.map((data) => (
                                    <MainGrid
                                        key={data.categoryId}
                                        content={data}
                                    />
                                ))
                            ) : (
                                <div className="mt-10 px-6">
                                    인기글이 없습니다.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
