'use client';

import SelectBox from '@/components/SelectBox';
import React, { FormEventHandler, useState } from 'react';
import TextEditor from '@/components/blog/TextEditor';
import { UseSeries } from '@/hooks/useSeries';
import { GrFormPreviousLink } from 'react-icons/gr';
import { usePathname, useRouter } from 'next/navigation';
import Popup from '@/components/Popup';
import { customFetch } from '@/utils/customFetch';
import { useBlogStore } from '@/store/useBlogStore';

export default function NewPostPage() {
    const router = useRouter();
    const pathname = usePathname();
    const blogAddress = pathname.split('/')[1];
    const { blogId } = useBlogStore();
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
    const [seriesId, setSeriesId] = useState<number>(null);

    const handleItemsPerValueChange = (value: number) => {
        setSeriesId(value);
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        // 저장 후 처리
        //서버에 데이터 전송
    };

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupTitle, setPopupTitle] = useState('');
    const handleBackClick = () => {
        console.log(content.trim().length, title.trim().length, !seriesId);
        if (content.trim().length > 0 || title.trim().length > 0 || seriesId) {
            setPopupTitle('작성 중인 글을 저장하시겠습니까?');
            setPopupMessage('저장하지 않은 글은 복구할 수 없습니다.');
            setShowPopup(true);
        } else {
            router.push(`/${blogAddress}`);
        }
    };
    const handleClosePopup = () => {
        setShowPopup(false);
    };
    const handleTmpPostSave = async () => {
        //TODO 임시 저장 수정
        const data = { blogId, seriesId, title, content };
        await customFetch('tmpsave.com', {
            queryKey: ['tmpPost'],
            method: 'POST',
            data,
        }).then(() => {
            setShowPopup(false);
            router.push(`/${blogAddress}/posts/series/0&전체보기`);
        });
    };

    return (
        <>
            <form
                className="mx-auto max-w-screen-xl px-24 py-10"
                onSubmit={handleSubmit}
            >
                {selectedSeries.length > 0 && (
                    <SelectBox
                        onItemsPerValueChange={handleItemsPerValueChange}
                        items={selectedSeries}
                        defaultValue={selectedSeries[0]?.value}
                    />
                )}
                <input
                    type="text"
                    className="mb-5 w-full border-b border-solid border-customLightBlue-100 pb-2 pt-4 text-2xl outline-none"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextEditor onChange={setContent} />
                <div className="mt-5 flex justify-between">
                    <div
                        className="flex cursor-pointer items-center text-customLightBlue-200"
                        onClick={handleBackClick}
                    >
                        <GrFormPreviousLink />
                        <button type="button">나가기</button>
                    </div>
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
            <Popup
                show={showPopup}
                title={popupTitle}
                text={popupMessage}
                type="confirm"
                onConfirm={handleTmpPostSave}
                onCancel={handleClosePopup}
            />
        </>
    );
}
