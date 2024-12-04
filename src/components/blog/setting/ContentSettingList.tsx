'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/components/blog/post/PostCard';
import ContentSettingCard from '@/components/blog/setting/ContentSettingCard';

export default function ContentSettingList({
    contents,
    onSelect,
}: {
    contents: Post[];
    onSelect: (posts: Post[]) => void;
}) {
    const [selectedContents, setSelectedContents] = useState<Post[]>([]);

    useEffect(() => {
        onSelect(selectedContents);
    }, [selectedContents]);

    const handleCheckboxChange = (
        newSelectedPosts: Post,
        isChecked: boolean,
    ) => {
        if (isChecked) {
            setSelectedContents((prev) => [...prev, newSelectedPosts]);
        } else {
            const index = selectedContents.findIndex(
                (post) => post.postId === newSelectedPosts.postId,
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
                        key={content.postId}
                        post={content}
                        isLast={index === contents.length - 1}
                        onSelect={handleCheckboxChange}
                    />
                ))}
        </section>
    );
}
