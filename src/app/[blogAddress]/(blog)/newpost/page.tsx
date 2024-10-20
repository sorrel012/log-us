'use client';

import SelectBox from '@/components/SelectBox';
import { useCallback, useState } from 'react';
import TextEditor from '@/components/blog/TextEditor';
import { UseSeries } from '@/hooks/useSeries';

export default function NewPostPage() {
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

    const onItemsPerValueChange = (value: number) => {};
    const handleImage = useCallback(
        async (file: File, callback: typeof Function) => () => {
            const url = 'https';
            // const url = await getImage(file);
            callback(url);
        },
        [],
    );

    return (
        <section className="px-24 py-10">
            {selectedSeries.length > 0 && (
                <SelectBox
                    onItemsPerValueChange={onItemsPerValueChange}
                    items={selectedSeries}
                    defaultValue={selectedSeries[0]?.value} // Ensure selectedSeries[0] exists
                />
            )}
            <input
                type="text"
                className="mb-5 w-full border-b border-solid border-customLightBlue-100 pb-2 pt-3 text-2xl outline-none"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextEditor handleImage={handleImage} />
        </section>
    );
}
