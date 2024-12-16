'use client';

import { useEffect, useState } from 'react';
import ContentSettingCard, {
    Notice,
} from '@/components/admin/ContentSettingCard';

export default function ContentsSettingList({
    contents,
    onSelect,
}: {
    contents: Notice[];
    onSelect: (noticeList: Notice[]) => void;
}) {
    const [selectedContents, setSelectedContents] = useState<Notice[]>([]);

    useEffect(() => {
        onSelect(selectedContents);
    }, [selectedContents]);

    const handleCheckboxChange = (
        newSelectedNotice: Notice,
        isChecked: boolean,
    ) => {
        if (isChecked) {
            setSelectedContents((prev) => [...prev, newSelectedNotice]);
        } else {
            const index = selectedContents.findIndex(
                (notice) =>
                    notice.noticeIndex === newSelectedNotice.noticeIndex,
            );
            setSelectedContents((prev) => [
                ...prev.slice(0, index),
                ...prev.slice(index + 1),
            ]);
        }
    };

    return (
        <section className="font-default mb-14 rounded-md border border-solid border-customLightBlue-100">
            {contents &&
                contents.map((content, index) => (
                    <ContentSettingCard
                        key={content.noticeIndex}
                        notice={content}
                        isLast={index === contents.length - 1}
                        onSelect={handleCheckboxChange}
                    />
                ))}
        </section>
    );
}
