'use client';

import { Post } from '@/components/blog/post/PostCard';
import { useEffect, useState } from 'react';
import PostSettingCard from '@/components/blog/setting/PostSettingCard';

export default function PostSettingList({
    contents,
    onSelect,
}: {
    contents: Post[];
    onSelect: (contents: Post[]) => void;
}) {
    const [selectedContents, setSelectedContents] = useState<Post[]>([]);

    useEffect(() => {
        onSelect(selectedContents);
    }, [selectedContents]);

    const handleCheckboxChange = (
        newSelectedContents: Post,
        isChecked: boolean,
    ) => {
        if (isChecked) {
            setSelectedContents((prev) => [...prev, newSelectedContents]);
        } else {
            const index = (selectedContents as Post[]).findIndex(
                (post) => post.postId === (newSelectedContents as Post).postId,
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
                    <PostSettingCard
                        key={
                            'commentId' in content
                                ? content.commentId + ''
                                : content.postId
                        }
                        content={content}
                        isLast={index === contents.length - 1}
                        onSelect={handleCheckboxChange}
                    />
                ))}
        </section>
    );
}