'use client';

import { Comment } from '@/components/blog/post/PostCard';
import { useEffect, useState } from 'react';
import CommentSettingCard from '@/components/blog/setting/CommentSettingCard';

export default function CommentSettingList({
    contents,
    onSelect,
}: {
    contents: Comment[];
    onSelect: (contents: Comment[]) => void;
}) {
    const [selectedContents, setSelectedContents] = useState<Comment[]>([]);

    useEffect(() => {
        onSelect(selectedContents);
    }, [selectedContents]);

    const handleCheckboxChange = (
        newSelectedContents: Comment,
        isChecked: boolean,
    ) => {
        if (isChecked) {
            setSelectedContents((prev) => [...prev, newSelectedContents]);
        } else {
            const index = (selectedContents as Comment[]).findIndex(
                (comment) =>
                    comment.commentId ===
                    (newSelectedContents as Comment).commentId,
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
                    <CommentSettingCard
                        key={content.commentId + ''}
                        content={content}
                        isLast={index === contents.length - 1}
                        onSelect={handleCheckboxChange}
                    />
                ))}
        </section>
    );
}