'use client';

import React, { useEffect, useState } from 'react';
import { BsList } from 'react-icons/bs';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { SeriesGridProps } from '@/components/blog/series/SeriesCard';
import AlertPopup from '@/components/AlertPopup';
import { customFetch } from '@/utils/customFetch';
import ConfirmPopup from '@/components/ConfirmPopup';

export default function SeriesList({
    data,
    onEdit,
    onAdd,
    onResetSeries,
}: {
    data: SeriesGridProps[];
    onEdit: (seriesId: number) => void;
    onAdd: (isAddMode: boolean) => void;
    onResetSeries: (newSeriesId: number, mode: string, body?: {}) => void;
}) {
    const [seriesList, setSeriesList] = useState<SeriesGridProps[]>(data);
    const [clickedSeriesId, setClickedSeriesId] = useState(0);
    const [isAddMode, setIsAddMode] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    useEffect(() => {
        if (data) {
            setSeriesList(data);
        }
    }, [data]);

    const handleDragEnd = async (result: any) => {
        if (!result.destination) return;

        const newSeriesList = Array.from(seriesList);
        const [removed] = newSeriesList.splice(result.source.index, 1);
        newSeriesList.splice(result.destination.index, 0, removed);
        const reorderedSeriesList = newSeriesList.map((series, index) => ({
            ...series,
            seriesOrder: index + 1,
        }));

        setSeriesList(reorderedSeriesList);
        const body = reorderedSeriesList.map((series) => ({
            seriesId: series.seriesId,
            seriesOrder: series.seriesOrder,
        }));

        const res = await customFetch('/series/order', {
            method: 'POST',
            queryKey: ['series', 'order'],
            body: { seriesList: body },
        });

        if (res.isError) {
            setPopupTitle('시리즈 순서를 저장하는 중 오류가<br> 발생했습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
            return;
        }
    };

    const handleClick = (seriesId: number) => {
        onEdit(0);
        setIsAddMode(false);

        setClickedSeriesId((prevState) =>
            prevState === seriesId ? 0 : seriesId,
        );
        onEdit(seriesId);
    };

    const handleAdd = () => {
        setClickedSeriesId(0);
        onAdd(!isAddMode);
        setIsAddMode((prevState) => !prevState);
    };

    const handleDeleteConfirm = () => {
        setShowConfirmPopup(false);
        onResetSeries(clickedSeriesId, 'DELETE');
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        setPopupTitle('시리즈를 삭제하시겠습니까?');
        setPopupText('삭제 후 복구할 수 없습니다.');
        setShowConfirmPopup(true);
    };

    return (
        <>
            <button
                className={`${isAddMode ? 'bg-customBrown-100 text-white' : 'bg-white text-customBrown-100'} w-full rounded border border-customBrown-100 py-2`}
                onClick={handleAdd}
            >
                + 시리즈 추가
            </button>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="seriesList">
                    {(provided) => (
                        <ul
                            className="mt-10 space-y-2"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {seriesList &&
                                seriesList.map(
                                    (
                                        { seriesId, seriesName, imgUrl },
                                        index,
                                    ) => (
                                        <Draggable
                                            key={seriesId}
                                            draggableId={seriesId + ''}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`${clickedSeriesId === seriesId ? 'bg-customBrown-100 text-white' : 'bg-white text-customBrown-100'} flex cursor-pointer items-center justify-between rounded border border-solid border-customBrown-100 px-3 py-1.5`}
                                                    style={{
                                                        ...provided
                                                            .draggableProps
                                                            .style,
                                                        userSelect: 'none',
                                                    }}
                                                    onClick={() => {
                                                        handleClick(seriesId);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <BsList />
                                                        <span className="text-customBeige-800 py-1 text-md">
                                                            {seriesName}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className={`${clickedSeriesId !== seriesId && 'hidden'} select-none`}
                                                    >
                                                        <button
                                                            className="rounded bg-white px-2 py-0.5 text-sm text-customBrown-100"
                                                            onClick={(e) =>
                                                                handleDelete(
                                                                    e,
                                                                    seriesId,
                                                                )
                                                            }
                                                        >
                                                            삭제
                                                        </button>
                                                    </div>
                                                </li>
                                            )}
                                        </Draggable>
                                    ),
                                )}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>

            <AlertPopup
                show={showPopup}
                onConfirm={() => setShowPopup(false)}
                title={popupTitle}
                text={popupText}
            />
            <ConfirmPopup
                show={showConfirmPopup}
                onConfirm={handleDeleteConfirm}
                title={popupTitle}
                text={popupText}
                onCancel={() => setShowConfirmPopup(false)}
            />
        </>
    );
}
