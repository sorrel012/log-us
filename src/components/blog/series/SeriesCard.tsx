import Image from 'next/image';

export default function SeriesCard({ seriesName, imgUrl }) {
    return (
        <article className="w-full border border-solid border-customLightBlue-100">
            <Image src={imgUrl} alt={seriesName} width={200} height={200} />
            <div>{seriesName}</div>
        </article>
    );
}
