'use client';

import { usePathname } from 'next/navigation';
import Popup from '@/components/Popup';
import { useEffect, useState } from 'react';
import PostDetail from '@/components/blog/post/PostDetail';
import { customFetch } from '@/utils/customFetch';
import { Post } from '@/components/blog/post/PostCard';
import PostDetailComments from '@/components/blog/post/PostDetailComments';

export default function PostDetailPage() {
    const pathname = usePathname();
    const postId = pathname?.split('/')[3];

    const [post, setPost] = useState<Post>();

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        (async () => {
            if (postId) {
                try {
                    const response = await customFetch<any>(
                        `/posts/${postId}`,
                        {
                            queryKey: ['post', postId],
                        },
                    );
                    setPost(response.data);
                } catch (error) {
                    setShowPopup(true);
                    setPopupMessage(error || '게시글을 불러올 수 없습니다.');
                }
            }
        })();
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
                    <PostDetailComments {...post} />
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
