'use client';

import { useFetch } from '@/hooks/useFetch';

export default function BlogMain() {
    const { data, isLoading, isError, error } = useFetch('/series.json');

    return (
        <div>
            {isLoading && <div>로딩 중~~</div>}
            {!isLoading && !isError && data && JSON.stringify(data)}
            {!isLoading && !isError && !data && <div>데이터가 없습니다.</div>}
            {isError && <div>{error}</div>}
        </div>
    );
}
