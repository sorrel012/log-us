'use client';

import imageCompression from 'browser-image-compression';
import Image from 'next/image';
import { MdDelete, MdOutlineAddPhotoAlternate } from 'react-icons/md';
import React, { useEffect, useState } from 'react';
import { useBlogStore } from '@/store/useBlogStore';
import AlertPopup from '@/components/AlertPopup';
import { SeriesGridProps } from '@/components/blog/series/SeriesCard';

export default function SeriesManage({
    data,
    seriesId,
    mode,
    onResetSeries,
}: {
    data: SeriesGridProps[];
    seriesId: number;
    mode: string;
    onResetSeries: (newSeriesId: number, mode: string, body: {}) => void;
}) {
    const { blogId } = useBlogStore();

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const [seriesName, setSeriesName] = useState('');
    const [orgImg, setOrgImg] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [seriesImg, setSeriesImg] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    useEffect(() => {
        if (mode === 'EDIT' && data) {
            const clickedSeries = data.filter(
                (series) => series.seriesId === seriesId,
            )[0];
            setImgUrl(clickedSeries.imgUrl!);
            setOrgImg(clickedSeries.imgUrl!);
            setSeriesName(clickedSeries.seriesName);
        } else {
            setImgUrl('');
            setSeriesImg(null);
            setOrgImg(null);
            setSeriesName('');
        }
    }, [data, mode, seriesId]);

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setIsUploading(true);
        const file = e.target.files?.[0];
        if (file) {
            const options = {
                maxSizeMB: 1,
                useWebWorker: true,
            };

            try {
                const compressedFile = await imageCompression(file, options);
                setSeriesImg(compressedFile);
                setImgUrl(URL.createObjectURL(compressedFile));
            } catch (e) {
                setSeriesImg(file);
                setImgUrl(URL.createObjectURL(file));
            }
        }
        setIsUploading(false);
        setIsDeleted(false);
    };
    const handleImageClick = () => fileInputRef.current?.click();

    const handleImageDelete = () => {
        setSeriesImg(null);
        setImgUrl(null);
        setIsDeleted(true);
    };

    const handleSave = async () => {
        if (seriesName.trim().length < 1) {
            setPopupTitle('시리즈명을 입력해 주세요.');
            setPopupText('');
            setShowPopup(true);
            return;
        }

        if (seriesName.length > 30) {
            setPopupTitle('시리즈명을 다시 입력해 주세요.');
            setPopupText('시리즈명은 최대 30자 입력 가능합니다.');
            setShowPopup(true);
            return;
        }

        let url;
        let method;
        let requestDto;

        if (mode === 'EDIT') {
            url = `/series/${mode === 'EDIT' && seriesId}`;
            method = 'PUT';
            requestDto = { seriesName };
        } else {
            url = '/series';
            method = 'POST';
            requestDto = { blogId, seriesName };
        }

        const formData = new FormData();
        if (seriesImg) {
            formData.append('img', seriesImg);
        }

        if ((orgImg && seriesImg) || (orgImg && !seriesImg && isDeleted)) {
            formData.append('deleteImg', 'true');
        }

        formData.append(
            'requestDto',
            new Blob([JSON.stringify(requestDto)], {
                type: 'application/json',
            }),
        );

        onResetSeries(seriesId, mode, {
            url,
            method,
            body: { requestDto, formData },
        });
    };

    return (
        <div className="">
            <div>
                <label htmlFor="seriesName" className="font-semibold">
                    시리즈명
                </label>
                <input
                    type="text"
                    className="mt-4 w-full rounded bg-customBeige-100 px-2 py-1.5 text-customBrown-100 outline-none placeholder:text-customBrown-100"
                    placeholder="30자 이내로 작성해 주세요."
                    value={seriesName}
                    onChange={(e) => setSeriesName(e.target.value)}
                />
            </div>
            <div className="mt-10">
                <div className="flex">
                    <label htmlFor="imgUrl" className="font-semibold">
                        시리즈 이미지
                    </label>
                    {imgUrl && (
                        <MdDelete
                            className="popup-bounce cursor-pointer text-customBrown-100"
                            onClick={handleImageDelete}
                        />
                    )}
                </div>
                <div className="mt-4">
                    <div className="cursor-pointer">
                        {isUploading ? (
                            <div className="flex h-24 items-center justify-center">
                                <div className="spinner-brown" />
                            </div>
                        ) : imgUrl ? (
                            <div className="relative flex aspect-square w-full">
                                <Image
                                    src={imgUrl}
                                    alt="미리보기"
                                    className="rounded border object-cover"
                                    fill
                                    priority={true}
                                />
                            </div>
                        ) : (
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                />
                                <MdOutlineAddPhotoAlternate
                                    className="-ml-5 aspect-square size-full text-customBeige-100"
                                    onClick={handleImageClick}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <button
                className="mt-10 w-full rounded bg-customBeige-100 px-4 py-3 text-md text-customBrown-100"
                onClick={handleSave}
                disabled={isUploading}
            >
                {mode === 'EDIT' ? '수정' : '저장'}
            </button>

            <AlertPopup
                show={showPopup}
                onConfirm={() => setShowPopup(false)}
                title={popupTitle}
                text={popupText}
            />
        </div>
    );
}
