'use client';

import { useQuery } from '@tanstack/react-query';
import { customFetch } from '@/utils/customFetch';

export default function Test() {
    const { data, error, isLoading } = useQuery({
        queryKey: ['myData'],
        queryFn: () => customFetch('/data.json', 'GET'),
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <div>{JSON.stringify(data)}</div>;
}
