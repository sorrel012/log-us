'use client';

import { useState } from 'react';
import SelectBox, { SelectType } from '@/components/SelectBox';

const items: SelectType[] = [
    {
        value: 10,
        text: '10개씩 보기',
    },
    { value: 20, text: '20개씩 보기' },
    { value: 30, text: '30개씩 보기' },
];

export default function ManageMain() {
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
    };

    return (
        <div className="p-3">
            <SelectBox
                onItemsPerPageChange={handleItemsPerPageChange}
                items={items}
            />
        </div>
    );
}
