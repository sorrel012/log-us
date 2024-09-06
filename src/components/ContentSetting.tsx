'use client';

import LightButton from '@/components/ui/LightButton';

export interface ContentsProps {
    postId?: number;
    commentId?: number;
    noticeId?: number;
    contents: string;
    series?: string;
    category?: string;
    nickName?: string;
    title?: string;
    date: Date;
    views?: number;
    comments?: number;
    likes?: number;
}

export interface ContentsButtonProps {
    text: string;
    onClick: (val: number) => void;
}

export default function ContentSetting({
    content,
    children,
    isLast,
    onSelect,
    buttons,
}: {
    content: ContentsProps;
    children: React.ReactNode;
    isLast: boolean;
    onSelect: (content: ContentsProps, isChecked: boolean) => void;
    buttons: ContentsButtonProps[];
}) {
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelect(content, e.target.checked);
    };

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
                {buttons &&
                    buttons.map((button, index) => (
                        <LightButton
                            key={index}
                            className="mr-1"
                            text={button.text}
                            onClick={() =>
                                button.onClick(
                                    content.postId ||
                                        content.commentId ||
                                        content.noticeId ||
                                        0,
                                )
                            }
                        />
                    ))}
            </div>
        </div>
    );
}
