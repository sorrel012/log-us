'use client';

import React, { useEffect, useState } from 'react';
import SeriesManage from '@/components/blog/setting/SeriesManage';
import SeriesList from '@/components/blog/setting/SeriesList';
import { SeriesGridProps } from '@/components/blog/series/SeriesCard';
import { useSeries } from '@/hooks/useSeries';
import AlertPopup from '@/components/AlertPopup';
import { customFetch } from '@/utils/customFetch';
import { useBlogStore } from '@/store/useBlogStore';
import { useRouter } from 'next/navigation';

export default function SeriesManagePage() {
    const router = useRouter();
    const { data, isLoading } = useSeries();
    const { userBlogAuth } = useBlogStore();

    const [seriesList, setSeriesList] = useState<SeriesGridProps[]>(data);
    const [seriesId, setSeriesId] = useState(0);
    const [mode, setMode] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    useEffect(() => {
        if (userBlogAuth === 'EDITOR') {
            router.push('/setting');
            setSeriesList([]);
        } else {
            if (data) {
                setSeriesList(data);
            }
        }
    }, [router, userBlogAuth, data]);

    const handleEdit = (id: number) => {
        setSeriesId(id);
        setMode('EDIT');
    };

    const handleAdd = (isAddMode: boolean) => {
        if (isAddMode) {
            setMode('ADD');
        } else {
            setMode('');
        }
    };

    const handleSave = async (
        newSeriesId: number,
        mode: string,
        fetchData: any,
    ) => {
        const { url, method, body } = fetchData;
        const { formData, requestDto } = body;

        const res = await customFetch<any>(url, {
            method,
            queryKey: ['series', mode],
            body: formData,
        });

        if (res.isError) {
            setPopupTitle(
                `시리즈를 ${mode === 'EDIT' ? '수정' : '저장'}하지 못했습니다.`,
            );
            setPopupText('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
            return;
        }

        let newSeriesList;

        if (mode === 'EDIT') {
            setPopupTitle('시리즈를 수정하였습니다.');
            const index = seriesList.findIndex(
                (series) => series.seriesId === seriesId,
            );
            newSeriesList = [
                ...seriesList.slice(0, index),
                {
                    seriesName: requestDto.seriesName,
                    seriesId: seriesId,
                    imgUrl: res.data.imgUrl,
                },
                ...seriesList.slice(index + 1, seriesList.length),
            ];
        } else {
            setPopupTitle('시리즈를 저장하였습니다.');

            newSeriesList = [
                ...seriesList,
                {
                    seriesName: requestDto.seriesName,
                    seriesId: res.data.seriesId,
                    imgUrl: res.data.imgUrl,
                },
            ];
        }

        setSeriesList(newSeriesList);
        setSeriesId(0);
        setMode('');

        setPopupText('');
        setShowPopup(true);
    };

    const handleDelete = async (newSeriesId: number) => {
        const res = await customFetch('/series/' + newSeriesId, {
            method: 'DELETE',
            queryKey: ['series', 'delete', newSeriesId],
        });

        if (res.isError) {
            setPopupTitle('시리즈를 삭제하는 중 오류가<br> 발생했습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
            return;
        }

        const newSeriesList = seriesList.filter(
            (series) => series.seriesId !== newSeriesId,
        );
        setSeriesList(newSeriesList);
        setSeriesId(0);
        setMode('');

        setPopupTitle('시리즈가 삭제되었습니다.');
        setPopupText('');
        setShowPopup(true);
    };

    const handleResetSeries = async (
        newSeriesId: number,
        mode: string,
        body: any,
    ) => {
        if (mode === 'DELETE') {
            await handleDelete(newSeriesId);
        } else {
            await handleSave(newSeriesId, mode, body);
        }
    };

    return (
        <fieldset>
            <legend className="mb-8 text-lg font-bold">시리즈 관리</legend>
            <div className="flex justify-between">
                <section aria-labelledby="series-list" className="w-1/3">
                    <h3 id="series-list" className="mb-8 text-md font-bold">
                        시리즈 목록 관리
                    </h3>
                    <article className="max-w-screen-sm rounded bg-customBeige-100 p-6">
                        {isLoading ? (
                            <div className="flex justify-center">
                                <div className="spinner-brown" />
                            </div>
                        ) : (
                            <SeriesList
                                data={seriesList}
                                onEdit={handleEdit}
                                onAdd={handleAdd}
                                onResetSeries={handleResetSeries}
                            />
                        )}
                    </article>
                </section>
                <section aria-labelledby="series-list" className="w-1/2">
                    {((seriesId > 0 && mode === 'EDIT') || mode === 'ADD') && (
                        <>
                            <h3
                                id="series-list"
                                className="mb-8 text-md font-bold"
                            >
                                {mode === 'EDIT'
                                    ? '시리즈 수정'
                                    : '시리즈 추가'}
                            </h3>
                            <article className="max-w-screen-md rounded border-4 border-solid border-customBeige-100 px-10 py-7">
                                <SeriesManage
                                    seriesId={seriesId}
                                    mode={mode}
                                    data={seriesList}
                                    onResetSeries={handleResetSeries}
                                />
                            </article>
                        </>
                    )}
                </section>
            </div>
            <AlertPopup
                show={showPopup}
                onConfirm={() => setShowPopup(false)}
                title={popupTitle}
                text={popupText}
            />
        </fieldset>
    );
}