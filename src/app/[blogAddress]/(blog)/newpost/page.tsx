'use client';

import SelectBox from '@/components/SelectBox';
import React, { FormEventHandler, useState } from 'react';
import TextEditor from '@/components/blog/TextEditor';
import { UseSeries } from '@/hooks/useSeries';
import { GrFormPreviousLink } from 'react-icons/gr';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPostPage() {
    const router = useRouter();
    const pathname = usePathname();
    const blogAddress = pathname.split('/')[1];
    const { data } = UseSeries();
    const series = data
        ? [
              {
                  imgUrl: '',
                  seriesOrder: 0,
                  seriesName: '시리즈',
                  seriesId: 0,
              },
              ...data,
          ]
        : [];
    const selectedSeries = series.map((item) => ({
        text: item.seriesName,
        value: item.seriesId,
    }));

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const onItemsPerValueChange = (value: number) => {};

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        // 저장 후 처리
        //서버에 데이터 전송
    };

    return (
        <form className="px-24 py-10" onSubmit={handleSubmit}>
            {selectedSeries.length > 0 && (
                <SelectBox
                    onItemsPerValueChange={onItemsPerValueChange}
                    items={selectedSeries}
                    defaultValue={selectedSeries[0]?.value}
                />
            )}
            <input
                type="text"
                className="mb-5 w-full border-b border-solid border-customLightBlue-100 pb-2 pt-3 text-2xl outline-none"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextEditor onChange={setContent} />
            <div className="mt-5 flex justify-between">
                <Link
                    href={`/${blogAddress}`}
                    className="flex cursor-pointer items-center text-customLightBlue-200"
                >
                    <GrFormPreviousLink />
                    <button type="button">나가기</button>
                </Link>
                <div className="*:cursor-pointer *:rounded-md *:py-1">
                    <button
                        type="button"
                        className="mr-2 border border-customLightBlue-200 px-1 text-customLightBlue-200"
                    >
                        임시저장
                    </button>
                    <button
                        type="submit"
                        className="border border-customLightBlue-200 bg-customLightBlue-200 px-4 text-white"
                    >
                        발행
                    </button>
                </div>
            </div>
        </form>
    );
}
