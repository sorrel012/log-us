'use client';

import LightButton from '@/components/ui/LightButton';
import { ContentsProps } from '@/components/ContentsSettingList';

export default function ContentSetting({
    content,
    children,
    isLast,
    onSelect,
}: {
    content: ContentsProps;
    children: React.ReactNode;
    isLast: boolean;
    onSelect: (content: ContentsProps, isChecked: boolean) => void;
}) {
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelect(content, e.target.checked);
    };

    const handleClick = () => {};

    return (
        <div
            className={`flex items-center justify-between border-solid border-customLightBlue-100 px-4 py-2 ${!isLast && 'border-b'}`}
        >
            <div className="flex items-center">
                <input
                    type="checkbox"
                    className="mr-3.5"
                    onChange={handleCheckboxChange}
                />
                <div className="flex flex-col">
                    <div className="mb-0.5 text-lg font-bold">
                        {content.contents}
                    </div>
                    <div className="flex text-customLightBlue-200">
                        {children}
                    </div>
                </div>
            </div>
            <div className="text-customLightBlue-200">
                <LightButton
                    text="수정"
                    onClick={handleClick}
                    className="mr-1"
                />
                <LightButton
                    text="삭제"
                    onClick={handleClick}
                    className="mr-1"
                />
                <LightButton text="통계" onClick={handleClick} />
            </div>
        </div>
    );
}
