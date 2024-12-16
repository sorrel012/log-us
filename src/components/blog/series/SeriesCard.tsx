'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { HiPhoto } from 'react-icons/hi2';

export interface SeriesGridProps {
    seriesId: number;
    seriesName: string;
    imgUrl?: string;
    seriesOrder?: number;
}

export default function SeriesCard({
    seriesId,
    seriesName,
    imgUrl,
}: SeriesGridProps) {
    const router = useRouter();
    const { blogAddress } = useParams();

    const handleClick = () => {
        router.push(`/${blogAddress}/posts/series/${seriesId}&${seriesName}`);
    };

    return (
        <article
            className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-solid border-customLightBlue-100 p-5 text-center"
            onClick={handleClick}
        >
            {imgUrl ? (
                <div className="flex h-[150px] w-[150px] justify-center">
                    <Image
                        src={imgUrl}
                        alt={seriesName}
                        className="aspect-square rounded-md object-cover"
                        priority
                        width={150}
                        height={150}
                    />
                </div>
            ) : (
                <div className="flex h-[150px] w-[150px] justify-center">
                    <HiPhoto className="aspect-square size-full text-customLightBlue-100" />
                </div>
            )}
            <div className="mt-4 font-bold">{seriesName}</div>
        </article>
    );
}
