import { useFetch } from '@/hooks/useFetch';
import { useBlogStore } from '@/store/useBlogStore';

export const UseSeries = () => {
    const { blogId } = useBlogStore();

    const { data, isLoading, isError, error } = useFetch('/series', {
        queryKey: ['series', blogId],
        params: { blogId },
    });

    return {
        data,
        isLoading,
        isError,
    };
};
