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
        (async () => {
            if (blogId) {
                try {
                    const response = await customFetch<any>('/series', {
                        queryKey: ['series', blogId],
                        params: { blogId },
                        invalidateCache: true,
                    });

                    setData(response.data);
                    setIsLoading(false);
                } catch (error) {
                    setIsError(true);
                    setError(error || '시리즈를 불러올 수 없습니다.');
                    setIsLoading(false);
                }
            }
        })();
    }, [blogId]);

    return {
        data,
        isLoading,
        isError,
        error,
    };
};
