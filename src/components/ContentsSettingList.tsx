'use client';

import ContentSetting, {
    ContentsButtonProps,
    ContentsProps,
} from '@/components/ContentSetting';
import PostSettingSubText from '@/components/setting/PostSettingSubText';
import { useState } from 'react';

export default function ContentsSettingList({
    contents,
}: {
    contents: ContentsProps[];
}) {
    const [selectedContents, setSelectedContents] = useState<ContentsProps[]>(
        [],
    );

    const handleCheckboxChange = (
        newSelectedContents: ContentsProps,
        isChecked: boolean,
    ) => {
        setSelectedContents((prev) => {
            return [...prev, newSelectedContents];
        });
    };

    const handleUpdate = (val: number) => {};
    const handleDelete = (val: number) => {};
    const handleStatistics = (val: number) => {};

    const buttons: ContentsButtonProps[] = [
        {
            text: '수정',
            onClick: handleUpdate,
        },
        {
            text: '삭제',
            onClick: handleDelete,
        },
        {
            text: '통계',
            onClick: handleStatistics,
        },
    ];

    return (
        <section className="font-default rounded-md border border-solid border-customLightBlue-100">
            {contents.map((content, index) => (
                <ContentSetting
                    key={content.title}
                    content={content}
                    isLast={index === contents.length - 1}
                    onSelect={handleCheckboxChange}
                    buttons={buttons}
                >
                    <PostSettingSubText {...content} />
                </ContentSetting>
            ))}
        </section>
    );
}
