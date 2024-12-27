import { useEffect, useState } from 'react';
import { customFetch } from '@/utils/customFetch';
import { useBlogStore } from '@/store/useBlogStore';

export const useSeries = () => {
    const { blogId } = useBlogStore();
    const [data, setData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            if (blogId) {
                const response = await customFetch<any>('/series', {
                    queryKey: ['series', blogId],
                    params: { blogId },
                    invalidateCache: true,
                });

                if (!isMounted) return;

                if (response.isError) {
                    setIsError(true);
                    setError(response.error || '시리즈를 불러올 수 없습니다.');
                    setIsLoading(false);
                }

                setData(response.data);
                setIsLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [blogId]);

    return {
        data,
        isLoading,
        isError,
        error,
    };
};