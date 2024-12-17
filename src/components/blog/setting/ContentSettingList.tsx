'use client';

import { Comment, Post } from '@/components/blog/post/PostCard';
import { useEffect, useState } from 'react';
import ContentSettingCard from '@/components/blog/setting/ContentSettingCard';

export default function ContentSettingList({
    contents,
    onSelect,
    type,
}: {
    contents: Post[] | Comment[];
    onSelect: (contents: Post[] | Comment[]) => void;
    type: 'POST' | 'COMMENT';
}) {
    const [selectedContents, setSelectedContents] = useState<
        Post[] | Comment[]
    >([]);
    console.log('콘', contents);
    useEffect(() => {
        onSelect(selectedContents);
    }, [selectedContents]);

    const handleCheckboxChange = (newSelectedContents, isChecked: boolean) => {
        if (isChecked) {
            setSelectedContents((prev) => [...prev, newSelectedContents]);
        } else {
            let index;
            if (type === 'POST') {
                index = selectedContents.findIndex(
                    (post: Post) => post.postId === newSelectedContents.postId,
                );
            } else {
                index = selectedContents.findIndex(
                    (comment: Comment) =>
                        comment.commentId === newSelectedContents.commentId,
                );
            }

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
                        key={
                            'commentId' in content
                                ? content.commentId + ''
                                : content.postId
                        }
                        content={content}
                        isLast={index === contents.length - 1}
                        onSelect={handleCheckboxChange}
                        type={type}
                    />
                ))}
        </section>
    );
}
