'use client';

import SelectBox from '@/components/SelectBox';
import { useCallback, useState } from 'react';
import TextEditor from '@/components/blog/TextEditor';

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

    const onItemsPerValueChange = (value: number) => {};
    const handleImage = useCallback(
        async (file: File, callback: typeof Function) => () => {
            const url = 'https';
            console.log('드루와');
            // const url = await getImage(file);
            callback(url);
        },
        [],
    );

    return (
        <section className="px-24 py-10">
            <SelectBox
                onItemsPerValueChange={onItemsPerValueChange}
                items={series}
            />
            <input
                type="text"
                className="mb-5 w-full border-b border-solid border-customLightBlue-100 pb-2 pt-3 text-2xl outline-none"
                placeholder="제목을 입력하세요"
            />
            <TextEditor handleImage={handleImage} />
        </section>
    );
}