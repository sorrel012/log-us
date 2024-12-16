'use client';

import React from 'react';
import { Post } from '@/components/blog/post/PostCard';
import { dateFormatter, unescapeSpecialChars } from '@/utils/commonUtil';
import SubText from '@/components/SubText';
import ViewIcon from '@/components/icons/ViewIcon';
import LightButton from '@/components/ui/LightButton';

export interface Notice {
    noticeIndex: number;
    adminId: string;
    title: string;
    content: string;
    views?: number;
    status: string;
    createDate: Date;
}

export default function ContentSettingCard({
    notice,
    isLast,
    onSelect,
}: {
    notice: Notice;
    isLast: boolean;
    onSelect: (content: Post, isChecked: boolean) => void;
}) {
    const { noticeIndex, adminId, content, views, status, title, createDate } =
        notice;

    const handlePostClick = () => {};

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

    const handleEdit = () => {};

    const handleDelete = () => {};

    const buttons = [
        { text: '수정', onClick: handleEdit },
        { text: '삭제', onClick: handleDelete },
    ];

    return (
        <div
            className={`flex flex-col items-start justify-between border-solid border-customLightBlue-100 px-4 py-2 md:flex-row md:items-center ${
                !isLast && 'border-b'
            }`}
        >
            <div className="flex items-center">
                <input
                    type="checkbox"
                    className="mr-3.5 shrink-0"
                    onChange={handleCheckboxChange}
                />
                <div
                    className="flex flex-1 cursor-pointer flex-col"
                    onClick={handlePostClick}
                >
                    <div className="mb-0.5 w-[40vw] truncate text-lg font-bold">
                        {unescapeSpecialChars(title)}
                    </div>
                    <div className="flex flex-wrap text-customLightBlue-200">
                        <SubText text={adminId} />
                        {createDate && (
                            <SubText text={dateFormatter(createDate)} />
                        )}
                        <div className="flex">
                            <ViewIcon views={views!} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-2 shrink-0 text-customLightBlue-200 md:mt-0">
                {buttons.map((button, index) => (
                    <LightButton
                        key={index}
                        className="mr-1"
                        text={button.text}
                        onClick={button.onClick}
                    />
                ))}
            </div>
        </div>
    );
}
