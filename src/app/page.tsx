'use client';

import { useEffect, useState } from 'react';
import { customFetch } from '@/utils/customFetch';
import MainGrid, { MainData } from '@/components/main/MainGrid';
import SelectBox from '@/components/SelectBox';
import { MAIN_DATE_OPTIONS } from '@/utils/constant';

type DateType = 'day' | 'week' | 'month' | 'year';

export default function Home() {
    const [mainData, setMainData] = useState<MainData[]>([]);
    const [grid, setGrid] = useState<'trend' | 'new'>('trend');
    const [date, setDate] = useState<DateType>('week');

    useEffect(() => {
        (async () => {
            const params = {
                size: 6,
                grid,
                date,
            };

            const res = await customFetch('/main', {
                queryKey: ['main', grid, date],
                params,
            });

            if (res.isError) return;

            setMainData(res.data.content);
        })();
    }, [date, grid]);

    const handleItemsPerValueChange = (value: DateType) => {
        setDate(value);
    };

    return (
        <div className="font-default h-screen">
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
            </div>
            <div className="h-full overflow-y-scroll bg-customBeige-100 py-6">
                <div className="mx-auto max-w-screen-xl pb-32">
                    <div className="flex justify-end px-6">
                        <SelectBox
                            onItemsPerValueChange={handleItemsPerValueChange}
                            items={MAIN_DATE_OPTIONS}
                            defaultValue="week"
                            containerWidth="w-70"
                        />
                    </div>

                    {mainData &&
                        mainData.map((data) => (
                            <MainGrid key={data.categoryId} content={data} />
                        ))}
                </div>
            </div>
        </div>
    );
}
