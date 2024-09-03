'use client';

import {
    TbPlayerTrackNextFilled,
    TbPlayerTrackPrevFilled,
} from 'react-icons/tb';

interface PageProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PageProps) {
    const maxVisiblePages = 10;

    const getPageNumbers = () => {
        const halfRange = Math.floor(maxVisiblePages / 2);
        let startPage = Math.max(1, currentPage - halfRange);
        let endPage = Math.min(totalPages, currentPage + halfRange);

        if (endPage - startPage + 1 < maxVisiblePages) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
        }

        return Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i,
        );
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage);
        }
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="pagination">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <TbPlayerTrackPrevFilled />
            </button>

            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? 'active' : ''}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <TbPlayerTrackNextFilled />
            </button>
        </div>
    );
}
