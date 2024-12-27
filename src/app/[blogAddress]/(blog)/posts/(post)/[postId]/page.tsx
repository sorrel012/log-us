'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import AlertPopup from '@/components/AlertPopup';
import { Suspense, useEffect, useState } from 'react';
import PostDetail from '@/components/blog/post/PostDetail';
import { customFetch } from '@/utils/customFetch';
import { Post } from '@/components/blog/post/PostCard';
import dynamic from 'next/dynamic';

const CommentList = dynamic(
    () => import('@/components/blog/post/CommentList'),
    { ssr: false },
);

export default function PostDetailPage() {
    const router = useRouter();
    const { postId, blogAddress } = useParams();

    const searchParams = useSearchParams();
    const commentIdParam = searchParams.get('commentId');

    const [post, setPost] = useState<Post>();

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupId, setPopupId] = useState('CLOSE');

    useEffect(() => {
        (async () => {
            if (postId) {
                const response = await customFetch<any>(`/posts/${postId}`, {
                    queryKey: ['post', postId],
                });

                if (response.isError) {
                    if (response.code === 3004) {
                        setPopupMessage(response.error!);
                        setShowPopup(true);
                        setPopupId('OUT');
                    } else {
                        setPopupMessage(
                            response.error || '게시글을 불러올 수 없습니다.',
                        );
                        setShowPopup(true);
                    }
                }
                setPost(response.data);
            }
        })();
    }, [postId]);

    const handleClosePopup = () => {
        setShowPopup(false);
        setPopupMessage('');
        if (popupId === 'OUT') {
            router.push(`/${blogAddress}/posts/series/0&전체보기`);
        }
    };

    return (
        <Suspense>
            <section className={`${commentIdParam && 'pt-8'}`}>
                {post && (
                    <>
                        <PostDetail {...post} />
                        <CommentList {...post} />
                    </>
                )}
                <AlertPopup
                    show={showPopup}
                    title={popupMessage}
                    onConfirm={handleClosePopup}
                />
            </section>
        </Suspense>
    );
}