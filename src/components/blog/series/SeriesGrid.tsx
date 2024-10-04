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
        <section className="">
            {isLoading && <div>로딩 중~~</div>}
            {!isLoading && !isError && series && (
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
                    {series.map((item) => (
                        <SeriesCard
                            key={item.seriesId}
                            seriesName={item.seriesName}
                            imgUrl={item.imgUrl}
                            seriesId={item.seriesId}
                        />
                    ))}
                </div>
            )}
            {!isLoading && !isError && !series && (
                <div>시리즈가 존재하지 않습니다.</div>
            )}
            {isError && <div>{error}</div>}
        </section>
    );
}
