'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Test from '@/components/Test';

const queryClient = new QueryClient();

export default function Home() {
    return (
        <QueryClientProvider client={queryClient}>
            <Test />
        </QueryClientProvider>
    );
}
