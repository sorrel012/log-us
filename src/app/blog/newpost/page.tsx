'use client';

import SelectBox from '@/components/SelectBox';
import { useState } from 'react';

const series = [
    { text: '시리즈', value: 0 },
    { text: 'HTML', value: 1 },
    { text: 'CSS', value: 2 },
    { text: 'JavaScrill', value: 3 },
    { text: 'React', value: 4 },
    { text: 'Next', value: 5 },
    { text: 'TypeSdddddddddddddddddddcript', value: 6 },
];

export default function NewPostPage() {
    const [title, setTitle] = useState('');

    const onItemsPerValueChange = (value: number) => {
        console.log('value: ', value);
    };

    return (
        <section className="px-24 py-10">
            <SelectBox
                onItemsPerValueChange={onItemsPerValueChange}
                items={series}
            />
            <input
                type="text"
                className="w-full border-b border-solid border-customLightBlue-100 pb-2 pt-3 text-2xl outline-none"
                placeholder="제목을 입력하세요"
            />
            <textarea />
        </section>
    );
}
