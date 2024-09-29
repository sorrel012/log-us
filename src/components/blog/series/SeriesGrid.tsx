import { useEffect, useState } from 'react';
import SeriesCard from '@/components/blog/series/SeriesCard';
import { getSeries, Series } from '@/lib/series';

export default function SeriesGrid() {
    const [series, setSeries] = useState<Series[]>([]); // 상태로 Series 배열 관리
    const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 관리
    const [error, setError] = useState<string | null>(null); // 에러 상태 관리

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const data = await getSeries();
                setSeries(data);
            } catch (err) {
                setError('시리즈 조회에 실패하였습니다.');
            } finally {
                setLoading(false); // 로딩 종료
            }
        };
    }, []);

    if (loading) return <p>Loading...</p>; // 로딩 중일 때 표시할 UI
    if (error) return <p>{error}</p>; // 에러 발생 시 표시할 UI

    return (
        <article>
            {series.map((item) => (
                <SeriesCard key={item.seriesId} item={item} />
            ))}
        </article>
    );
}
