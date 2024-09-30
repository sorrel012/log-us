'use client';

import { useEffect, useMemo, useState } from 'react';
import { customFetch, FetchConfig } from '@/utils/customFetch';

export function useFetch<T>(url: string, config: FetchConfig = {}) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const memoizedConfig = useMemo(() => config, [JSON.stringify(config)]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await customFetch<T>(url, config);
                setData(result.data || null);
                setIsError(result.isError);
                setError(result.error || null);
            } catch (e) {
                setIsError(true);
                setError((e as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url, memoizedConfig]);

    return { data, isLoading, isError, error };
}
