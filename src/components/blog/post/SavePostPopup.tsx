'use client';

import React, { useEffect, useState } from 'react';
import { CiSettings } from 'react-icons/ci';
import { MdDelete, MdOutlineAddPhotoAlternate } from 'react-icons/md';
import Image from 'next/image';
import SelectBox from '@/components/SelectBox';
import { customFetch } from '@/utils/customFetch';
import AlertPopup from '@/components/AlertPopup';
import { useBlogStore } from '@/store/useBlogStore';
import { PostPayload } from '@/app/[blogAddress]/(blog)/newpost/[postId]/page';
import { Post } from '@/components/blog/post/PostCard';

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
    onPostSave,
    content,
}: {
    show: boolean;
    onClose: () => void;
    onPostSave: (post: Post[], isDeleted: boolean) => void;
    content: Partial<PostPayload>;
}) {
    const { blogInfo } = useBlogStore();
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [thumbImg, setThumbImg] = useState<File | null>(null);
    const [parentCategory, setParentCategory] = useState([
        { text: '1차 카테고리', value: 0 },
    ]);
    const [category, setCategory] = useState([
        { text: '2차 카테고리', value: 0 },
    ]);
    const [parentId, setParentId] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<number>(0);
    const [tags, setTags] = useState<string[]>([]);
    const [status, setStatus] = useState<string>('PUBLIC');

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        if (content) {
            setImagePreview(content.imgUrl || null);
            setStatus(content.status || 'PUBLIC');
            setTags(content.tags || []);
            setParentId(content.parentCategoryId || 0);
        }
    }, [content]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbImg(file);
            setImagePreview(URL.createObjectURL(file));
        }
        setIsDeleted(false);
    };
    const handleImageClick = () => fileInputRef.current?.click();
    const handleImageDelete = () => {
        setThumbImg(null);
        setImagePreview(null);
        setIsDeleted(true);
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await customFetch('/category', {
                    queryKey: ['parent', 'category'],
                });

                const selectBoxCategory = res.data.map((parent) => ({
                    text: parent.categoryName,
                    value: parent.categoryId,
                }));

                if (selectBoxCategory?.length > 0) {
                    setParentCategory([
                        { text: '1차 카테고리', value: 0 },
                        ...selectBoxCategory,
                    ]);
                }
            } catch (e) {
                setShowPopup(true);
                setPopupMessage('카테고리를 불러오는 중 오류가 발생했습니다.');
            }
        })();
    }, []);

    useEffect(() => {
        if (parentId) {
            setCategoryId(0);

            customFetch('/category', {
                queryKey: ['category', parentId],
                params: { parentId },
            }).then((res) => {
                const selectBoxCategoryDtl = res.data.map((category) => ({
                    text: category.categoryName,
                    value: category.categoryId,
                }));
                setCategory([
                    { text: '2차 카테고리', value: 0 },
                    ...selectBoxCategoryDtl,
                ]);

                if (content?.categoryId) {
                    setCategoryId(content.categoryId);
                }
            });
        }
    }, [content, parentId]);

    const handleParentCategory = (id: number) => setParentId(id);
    const handleCategory = (id: number) => setCategoryId(id);

    const handleStatusClick = (value: string) =>
        setStatus(status === value ? '' : value);

    const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const input = (e.target as HTMLInputElement).value.trim();
            const hasSpecialChar = /[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]/.test(input);

            if (!input) return;

            if (hasSpecialChar) {
                setShowPopup(true);
                setPopupMessage(
                    '해시태그에는 특수문자나 공백을 포함할 수 없습니다.',
                );
                return;
            }

            if (tags.length === 5) {
                setShowPopup(true);
                setPopupMessage('태그는 최대 5개까지 입력할 수 있습니다.');
                return;
            }

            if (!tags.includes(input)) {
                setTags((prevTags) => [...prevTags, input]);
                (e.target as HTMLInputElement).value = '';
            }
        }
    };

    const removeTag = (tag: string) => {
        setTags((prevTags) => prevTags.filter((t) => t !== tag));
    };

    const handleConfirm = () => {
        setShowPopup(false);
        setPopupMessage('');
    };

    const handleSavePost = () => {
        onPostSave(
            {
                thumbImg,
                parentId,
                categoryId,
                status,
                tags,
            },
            isDeleted,
        );
        setIsDeleted(false);
        onClose();
    };

    const statusButtons = blogInfo?.shareYn === 'Y' ? SHARE_STATUS : STATUS;

    if (!show) return null;

    return (
        <section
            className="popup-overlay *:focus-visible:outline-none"
            onClick={onClose}
        >
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="mb-5 flex items-center border-b border-solid border-customDarkBlue-100 pb-2 text-lg font-bold">
                    <CiSettings />️ <span className="ml-1">설정</span>
                </div>
                <div className="flex justify-between gap-6">
                    <div className="w-1/2">
                        <div className="flex">
                            <label className="mr-1 text-md font-semibold">
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
                                <div className="relative flex size-[12.4rem]">
                                    <Image
                                        src={imagePreview}
                                        alt="미리보기"
                                        className="rounded border object-cover"
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
                                        className="size-[12.4rem] text-customLightBlue-200"
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
                            <div className="mt-3 flex w-full justify-between gap-2 text-md">
                                <SelectBox
                                    onItemsPerValueChange={handleParentCategory}
                                    items={parentCategory}
                                    width="w-full"
                                    defaultValue={parentId}
                                />
                                <SelectBox
                                    onItemsPerValueChange={handleCategory}
                                    items={category}
                                    disabled={!parentId}
                                    width="w-full"
                                    defaultValue={categoryId}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="text-md font-semibold">
                                공개여부
                            </label>
                            <div className="mt-3 flex space-x-4">
                                {statusButtons.map((st) => (
                                    <button
                                        key={st.value}
                                        className={`w-[80px] rounded-md border border-solid py-1.5 text-sm text-customDarkBlue-100 ${st.value === status ? 'border-customLightBlue-200' : 'border-customLightBlue-100'}`}
                                        onClick={() =>
                                            handleStatusClick(st.value)
                                        }
                                    >
                                        {st.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="text-md font-semibold">
                                해시태그
                            </label>
                            <input
                                type="text"
                                onKeyDown={handleTagInput}
                                placeholder="특수문자, 공백 제외 최대 5개까지 입력 가능합니다."
                                className="mt-3 w-full rounded border border-customLightBlue-100 px-2 pb-1.5 pt-2 text-sm text-customDarkBlue-100 focus-visible:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <div
                            key={tag}
                            className="inline-flex items-center rounded-full bg-customBeige-100 px-3 py-1 text-sm text-customBrown-100"
                        >
                            {tag}
                            <button
                                onClick={() => removeTag(tag)}
                                className="popup-bounce ml-2 text-customBrown-100"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-3 flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-4 rounded border border-gray-300 px-4 py-2 text-customDarkBlue-100"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSavePost}
                        className="rounded bg-customLightBlue-200 px-6 py-2 text-white"
                    >
                        발행
                    </button>
                </div>
            </div>
            <AlertPopup
                show={showPopup}
                title={popupMessage}
                onConfirm={handleConfirm}
            />
        </section>
    );
}