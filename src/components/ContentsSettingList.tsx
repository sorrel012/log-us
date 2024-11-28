'use client';

import ContentSetting, {
    ContentsButtonProps,
    ContentsProps,
} from '@/components/ContentSetting';
import { useEffect, useState } from 'react';

interface ContentsSettingListProps {
    contents: ContentsProps[];
    buttons: ContentsButtonProps[];
    onChange: (val: ContentsProps[]) => void;
}

export default function ContentsSettingList({
    contents,
    buttons,
    onChange,
}: ContentsSettingListProps) {
    const [selectedContents, setSelectedContents] = useState<ContentsProps[]>(
        [],
    );

    useEffect(() => {
        onChange(selectedContents);
    }, [selectedContents]);

    const handleCheckboxChange = (
        newSelectedContents: ContentsProps,
        isChecked: boolean,
    ) => {
        if (isChecked) {
            setSelectedContents((prev) => [...prev, newSelectedContents]);
        } else {
            const index = selectedContents.findIndex(
                (content) => content.sn === newSelectedContents.sn,
            );
            setSelectedContents((prev) => [
                ...prev.slice(0, index),
                ...prev.slice(index + 1),
            ]);
        }
    };

    return (
        <section className="font-default rounded-md border border-solid border-customLightBlue-100">
            {contents.map((content, index) => (
                <ContentSetting
                    key={
                        content.postId || content.commentId || content.noticeId
                    }
                    content={content}
                    isLast={index === contents.length - 1}
                    onSelect={handleCheckboxChange}
                    buttons={buttons}
                ></ContentSetting>
            ))}
        </section>
    );
}
