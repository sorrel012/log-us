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
    const { memberId } = useParams();

    const handleClick = () => {
        router.push(`/${memberId}/posts/series=${seriesId}`);
    };

    return (
        <article
            className="cursor-pointer rounded-xl border border-solid border-customLightBlue-100 p-5 text-center"
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
