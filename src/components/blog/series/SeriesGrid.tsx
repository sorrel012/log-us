import SeriesCard from '@/components/blog/series/SeriesCard';
import SeriesSkeleton from '@/components/blog/series/SeriesSkeleton';
import AlertPopup from '@/components/AlertPopup';
import { useState } from 'react';
import { useSeries } from '@/hooks/useSeries';

export default function SeriesGrid() {
    const { data: series, isLoading, isError, error } = useSeries();

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const handleClosePopup = () => {
        setShowPopup(false);
        setPopupMessage('');
    };

    return (
        <section>
            {isLoading ? (
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <SeriesSkeleton key={index} />
                    ))}
                </div>
            ) : isError ? (
                <div className="leading-6">
                    <div>시리즈를 불러올 수 없습니다.</div>
                    <div>잠시 후 다시 시도해주세요.</div>
                </div>
            ) : series?.length === 0 ? (
                <div>시리즈가 존재하지 않습니다.</div>
            ) : (
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8">
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

            <AlertPopup
                show={showPopup}
                title={popupMessage}
                onConfirm={handleClosePopup}
            />
        </section>
    );
}
