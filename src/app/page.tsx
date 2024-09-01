'use client';

import Pagination from '@/components/Pagination';
import { useState } from 'react';

export default function Home() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(40);

    const handlePagination = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePagination}
            />
        </div>
    );
}
