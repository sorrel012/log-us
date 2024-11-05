'use client';

import { usePathname } from 'next/navigation';
import { useFetch } from '@/hooks/useFetch';
import PostComments from '@/components/blog/post/PostComments';
import Popup from '@/components/Popup';
import { useEffect, useState } from 'react';

export default function PostDetail() {
    const pathname = usePathname();
    const postId = pathname?.split('/')[3];

    const { data, isLoading, isError, error } = useFetch('/post.json', {
        queryKey: ['post', postId],
    });

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        if (isError) {
            setShowPopup(true);
            setPopupMessage(error || '게시글을 불러올 수 업습니다.');
        }
    }, [isError, error]);

    return (
        <section>
            <PostDetail />
            <PostComments />
            <Popup
                show={showPopup}
                title="에러"
                text={popupMessage}
                onConfirm={handleClosePopup}
            />
        </section>
    );
}
