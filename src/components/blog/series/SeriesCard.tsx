'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

interface SeriesGridProps {
    seriesId: number;
    seriesName: string;
    imgUrl: string;
}

export default function SeriesCard({
    seriesId,
    seriesName,
    imgUrl,
}: SeriesGridProps) {
    const router = useRouter();
    const { blogAddress } = useParams();

    const handleClick = () => {
        router.push(`/${blogAddress}/posts/series=${seriesId}&${seriesName}`);
    };

    return (
        <article
            className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-solid border-customLightBlue-100 p-5 text-center"
            onClick={handleClick}
        >
            <Image
                src={imgUrl}
                alt={seriesName}
                width={180}
                height={180}
                className="rounded-md"
                priority
            />
            <div className="mt-4 font-bold">{seriesName}</div>
        </article>
    );
}
