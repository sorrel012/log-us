import { useFetch } from '@/hooks/useFetch';
import SeriesCard from '@/components/blog/series/SeriesCard';

export default function SeriesGrid() {
    const {
        data: series,
        isLoading,
        isError,
        error,
    } = useFetch('/series.json');

    return (
        <section>
            {isLoading && <div>로딩 중~~</div>}
            {!isLoading &&
                !isError &&
                series &&
                series.map((item) => (
                    <SeriesCard
                        key={item.seriesId}
                        seriesName={item.seriesName}
                        imgUrl={item.imgUrl}
                    />
                ))}
            {!isLoading && !isError && !series && (
                <div>시리즈가 존재하지 않습니다.</div>
            )}
            {isError && <div>{error}</div>}
        </section>
    );
}