'use client';

import React, { useState } from 'react';
import { UseSeries } from '@/hooks/useSeries';

export default function SeriesList() {
    const { data } = UseSeries();

    const [clickedSeriesId, setClickedSeriesId] = useState(0);

    console.log('음?', data);

    return (
        <article className="rounded bg-customBeige-100 p-4">
            <ul className="space-y-2">
                {data &&
                    data.map(({ seriesId, seriesName, imgUrl }) => (
                        <li
                            key={seriesId}
                            className={`${clickedSeriesId === seriesId ? 'bg-customBrown-100 text-white' : 'bg-white text-customBrown-100'} flex cursor-pointer items-center justify-between rounded border border-solid border-customBrown-100 px-3 py-1.5`}
                            onClick={() =>
                                setClickedSeriesId((prevState) =>
                                    prevState === seriesId ? 0 : seriesId,
                                )
                            }
                        >
                            <span className="text-customBeige-800 py-1 text-md">
                                {seriesName}
                            </span>
                            <div
                                className={`${clickedSeriesId !== seriesId && 'hidden'} select-none`}
                            >
                                <button className="mr-2 rounded bg-white px-2 py-0.5 text-sm text-customBrown-100">
                                    수정
                                </button>
                                <button className="rounded bg-white px-2 py-0.5 text-sm text-customBrown-100">
                                    삭제
                                </button>
                            </div>
                        </li>
                    ))}
            </ul>
            <button className="mt-4 w-full rounded border border-customBrown-100 py-2 text-customBrown-100">
                + 시리즈 추가
            </button>
        </article>
    );
}
