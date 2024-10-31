'use client';

import React, { useEffect, useState } from 'react';
import { CiSettings } from 'react-icons/ci';
import { MdDelete, MdOutlineAddPhotoAlternate } from 'react-icons/md';
import Image from 'next/image';
import SelectBox from '@/components/SelectBox';
import { useFetch } from '@/hooks/useFetch';
import { customFetch } from '@/utils/customFetch';

const STATUS = [
    { text: '공개', value: 'PUBLIC' },
    { text: '비공개', value: 'SECRET' },
];
const SHARE_STATUS = [
    { text: '공개', value: 'PUBLIC' },
    { text: '멤버공개', value: 'SECRET' },
];

export default function SavePostPopup({
    show,
    onClose,
    onPublish,
    title,
}: {
    show: boolean;
    onClose: () => void;
    onPublish: () => void;
    title: string;
}) {
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const [category, setCategory] = useState([
        { text: '1차 카테고리' + '', value: 0 },
    ]);
    const [categoryDtl, setCategoryDtl] = useState([
        { text: '2차 카테고리', value: 0 },
    ]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [thumbImg, setThumbImg] = useState<File | null>(null);
    const [categoryId, setCategoryId] = useState<number>();
    const [categoryDtlId, setCategoryDtlId] = useState<number>();
    const [tags, setTags] = useState<string[]>([]);
    const [status, setStatus] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbImg(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };
    const handleImageDelete = () => {
        setThumbImg(null);
        setImagePreview(null);
    };

    const { data: categoryData } = useFetch('/category.json', {
        queryKey: ['category'],
    });

    useEffect(() => {
        const selectBoxCategory = categoryData?.map((category) => ({
            text: category.categoryName,
            value: category.categoryId,
        }));
        if (selectBoxCategory?.length > 0) {
            setCategory([
                { text: '1차 카테고리', value: 0 },
                ...selectBoxCategory,
            ]);
        }
    }, [categoryData]);

    useEffect(() => {
        if (categoryId) {
            customFetch('/category-dtl.json', {
                queryKey: ['categoryDtl', categoryId],
                params: { categoryId },
            }).then((res) => {
                const selectBoxCategoryDtl = res.data.map((categoryDtl) => ({
                    text: categoryDtl.categoryDtlName,
                    value: categoryDtl.categoryDtlId,
                }));
                setCategoryDtl([
                    { text: '2차 카테고리', value: 0 },
                    ...selectBoxCategoryDtl,
                ]);
            });
        }
    }, [categoryId]);
    const handleCategory = (id: number) => {
        setCategoryId(id);
    };
    const handleCategoryDtl = (id: number) => {
        setCategoryDtlId(id);
    };

    const handleStatusClick = (value: string) => {
        if (status === '') {
            setStatus(value);
        } else {
            setStatus('');
        }
    };

    useEffect(() => {
        console.log('status: ', status);
    }, [status]);

    if (!show) return null;

    return (
        <div
            className="popup-overlay *:focus-visible:outline-none"
            onClick={onClose}
        >
            <div className="popup-content">
                <div className="mb-5 flex items-center border-b border-solid border-customDarkBlue-100 pb-2 text-lg font-bold">
                    <CiSettings />️ <span className="ml-1">설정</span>
                </div>
                <div className="flex justify-between gap-4">
                    <div className="w-1/2">
                        <div className="flex">
                            <label className="text-md mr-1 font-semibold">
                                이미지
                            </label>
                            {imagePreview && (
                                <MdDelete
                                    className="popup-bounce cursor-pointer text-customDarkBlue-100"
                                    onClick={handleImageDelete}
                                />
                            )}
                        </div>
                        <div className="mt-2 cursor-pointer">
                            {imagePreview ? (
                                <div className="relative flex size-56">
                                    <Image
                                        src={imagePreview}
                                        alt="미리보기"
                                        className="size-56 rounded border object-cover"
                                        fill
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
                                        className="size-56 text-customLightBlue-200"
                                        onClick={handleImageClick}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="mb-4">
                            <label className="text-md font-semibold">
                                카테고리
                            </label>
                            <div className="text-md mt-3 flex w-full justify-between gap-2">
                                <SelectBox
                                    onItemsPerValueChange={handleCategory}
                                    items={category}
                                    width="w-full"
                                />
                                <SelectBox
                                    onItemsPerValueChange={handleCategoryDtl}
                                    items={categoryDtl}
                                    disabled={!categoryId}
                                    width="w-full"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="text-md font-semibold">
                                해시태그
                            </label>
                            <input
                                type="text"
                                placeholder="특수문자와 공백을 제외하고 5개까지 입력 가능합니다."
                                className="mt-3 w-full rounded border border-customLightBlue-100 p-2 text-sm text-customDarkBlue-100 focus-visible:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="text-md font-semibold">
                                공개여부
                            </label>
                            <div className="mt-3 flex space-x-4">
                                {STATUS.map((st) => (
                                    <button
                                        key={st.value}
                                        className={`rounded-md border border-solid px-2 py-2 text-customDarkBlue-100 ${st.value === status ? 'border-customLightBlue-200' : 'border-customLightBlue-100'}`}
                                        onClick={() =>
                                            handleStatusClick(st.value)
                                        }
                                    >
                                        {st.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-4 rounded border border-gray-300 px-4 py-2 text-customDarkBlue-100"
                    >
                        취소
                    </button>
                    <button
                        onClick={onPublish}
                        className="rounded bg-customLightBlue-200 px-6 py-2 text-white"
                    >
                        발행
                    </button>
                </div>
            </div>
        </div>
    );
}
