'use client';

import { usePathname } from 'next/navigation';
import Popup from '@/components/Popup';
import { useEffect, useState } from 'react';
import PostDetail from '@/components/blog/post/PostDetail';
import { customFetch } from '@/utils/customFetch';
import { Post } from '@/components/blog/post/PostCard';

export default function PostDetailPage() {
    const pathname = usePathname();
    const postId = pathname?.split('/')[3];

    const [post, setPost] = useState<Post>();

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        if (postId) {
            customFetch<any>(`/posts/${postId}`, {
                queryKey: ['post', postId],
            })
                .then((response) => {
                    setPost(response.data);
                })
                .catch((error) => {
                    setShowPopup(true);
                    setPopupMessage(error || '게시글을 불러올 수 없습니다.');
                });
        }
    }, [postId]);

    const handleClosePopup = () => {
        setShowPopup(false);
        setPopupMessage('');
    };

    return (
        <section>
            {post && (
                <>
                    <PostDetail {...post} />
                    {/*<PostComments />*/}
                </>
            )}
            <Popup
                show={showPopup}
                title="에러"
                text={popupMessage}
                onConfirm={handleClosePopup}
            />
        </section>
    );
}
