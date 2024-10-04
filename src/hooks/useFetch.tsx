'use client';

import { useEffect, useMemo, useState } from 'react';
import { customFetch, FetchConfig } from '@/utils/customFetch';

const cacheStore = new Map();

export function useFetch<T>(url: string, config: FetchConfig) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const memoizedConfig = useMemo(() => config, [JSON.stringify(config)]);

    useEffect(() => {
        const fetchData = async () => {
            const cacheKey = JSON.stringify(config.queryKey);
            const cachedData = cacheStore.get(cacheKey);

            if (
                cachedData &&
                Date.now() - cachedData.timestamp <
                    (config.staleTime || 20000 * 1000) &&
                !config.invalidateCache
            ) {
                setData(cachedData.data);
                setIsLoading(false);
                setIsError(false);
                setError(null);
                return;
            }

            try {
                const result = await customFetch<T>(url, config);
                setData(result.data || null);
                setIsError(result.isError);
                setError(result.error || null);

                if (!result.isError) {
                    cacheStore.set(cacheKey, {
                        data: result.data,
                        timestamp: Date.now(),
                    });
                }
            } catch (e) {
                setIsError(true);
                setError((e as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url, memoizedConfig, config.queryKey]);

    return { data, isLoading, isError, error };
}
