import LightButton from '@/components/ui/LightButton';
import { Comment, Post } from '@/components/blog/post/PostCard';
import { dateFormatter, unescapeSpecialChars } from '@/utils/commonUtil';
import SubText from '@/components/SubText';
import ViewIcon from '@/components/icons/ViewIcon';
import CommentIcon from '@/components/icons/CommentIcon';
import LikeIcon from '@/components/icons/LikeIcon';
import { useParams, usePathname, useRouter } from 'next/navigation';
import AlertPopup from '@/components/AlertPopup';
import React, { useEffect, useState } from 'react';
import ConfirmPopup from '@/components/ConfirmPopup';
import { customFetch } from '@/utils/customFetch';
import { useBlogStore } from '@/store/useBlogStore';

export default function ContentSettingCard({
    content,
    isLast,
    onSelect,
    type,
}: {
    content: Post | Comment;
    isLast: boolean;
    onSelect: (content: Post | Comment, isChecked: boolean) => void;
    type: 'POST' | 'COMMENT';
}) {
    //TODO zustand 로 수정
    const loginUser = 6;
    const router = useRouter();
    const { blogAddress } = useParams();
    const pathname = usePathname();
    const isOurLog = pathname.includes('/our-log');
    const { userBlogAuth } = useBlogStore();

    const [postWriterId, setPostWriterId] = useState();
    const [commentWriterId, setCommentWriterId] = useState();

    const {
        postId,
        title,
        seriesName,
        categoryName,
        createDate,
        views,
        commentCount,
        likeCount,
        nickname,
        memberId,
        parentId,
        commentId,
        content: comment,
        depth,
    } = content;

    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');
    const [popupId, setPopupId] = useState('');

    useEffect(() => {
        if (isOurLog && type === 'COMMENT' && postId) {
            (async () => {
                const res = await customFetch(`/posts/${postId}`, {
                    queryKey: ['posts', 'comment'],
                });

                if (res.isError) {
                    throw new Error(
                        res.error || '게시글을 불러올 수 없습니다.',
                    );
                }

                setPostWriterId(res.data.memberId);
                if (depth === 1) {
                    const commentWriter = res.data.comments.parents.filter(
                        (comment) => comment.commentId === parentId,
                    );
                }
            })();
        }
    }, [isOurLog, postId, type]);

    const handleConfirm = () => {
        if (popupId === 'CLOSE') {
            setShowPopup(false);
        } else {
            router.refresh();
        }
    };

    const handlePostClick = () => {
        if (type === 'POST') {
            router.push(`/${blogAddress}/posts/${postId}`);
        } else {
            router.push(
                `/${blogAddress}/posts/${postId}?commentId=${commentId}`,
            );
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelect(content, e.target.checked);
    };

    const handleEdit = () => {
        router.push(`/${blogAddress}/newpost/${postId}`);
    };

    const handleDeleteConfirm = async () => {
        let url;
        if (type === 'POST') {
            url = `/posts/${postId}`;
        } else {
            url = `/comments/${commentId}`;
        }

        try {
            const res = await customFetch(url, {
                method: 'DELETE',
                queryKey: ['deletePost', postId],
            });

            if (res.isError) {
                throw new Error(
                    res.error ||
                        `${type === 'POST' ? '게시글' : '댓글'}을 삭제할 수 없습니다.`,
                );
            }

            setShowConfirmPopup(false);
            setPopupTitle('삭제되었습니다.');
            setPopupText('');
            setPopupId('REFRESH');
            setShowPopup(true);
        } catch (e) {
            setShowConfirmPopup(false);
            setPopupTitle(
                `${type === 'POST' ? '게시글' : '댓글'}을 삭제할 수 없습니다.`,
            );
            setPopupText('잠시 후 다시 시도해 주세요.');
            setPopupId('CLOSE');
            setShowPopup(true);
        }
    };

    const handleDelete = () => {
        setPopupTitle('삭제하시겠습니까?');
        setPopupText('삭제한 글은 복구할 수 없습니다.');
        setShowConfirmPopup(true);
    };

    return (
        <div
            className={`flex flex-col items-start justify-between border-solid border-customLightBlue-100 px-4 py-2.5 md:flex-row md:items-center ${
                !isLast && 'border-b'
            }`}
        >
            <div className="flex items-center">
                <input
                    type="checkbox"
                    className="mr-3.5 shrink-0"
                    onChange={handleCheckboxChange}
                />
                <div
                    className="flex flex-1 cursor-pointer flex-col"
                    onClick={handlePostClick}
                >
                    {type === 'POST' ? (
                        <>
                            <div className="mb-0.5 w-[40vw] truncate text-lg font-bold">
                                {unescapeSpecialChars(title!)}
                            </div>
                            <div className="flex flex-wrap text-customLightBlue-200">
                                <SubText
                                    text={
                                        seriesName ? seriesName : '시리즈 없음'
                                    }
                                />
                                <SubText
                                    text={
                                        categoryName
                                            ? categoryName
                                            : '카테고리 없음'
                                    }
                                />
                                {createDate && (
                                    <SubText text={dateFormatter(createDate)} />
                                )}
                                <div className="flex gap-2">
                                    <ViewIcon views={views!} />
                                    <CommentIcon comments={commentCount!} />
                                    <LikeIcon likes={likeCount!} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-0.5 w-[40vw] truncate text-lg font-bold">
                                {unescapeSpecialChars(comment!)}
                            </div>
                            <div className="flex flex-wrap text-customLightBlue-200">
                                <SubText text={nickname} />
                                <SubText text={unescapeSpecialChars(title!)} />
                                <SubText
                                    text={dateFormatter(createDate)}
                                    isLast={true}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="mt-2 shrink-0 text-customLightBlue-200 md:mt-0">
                {isOurLog && (
                    <>
                        {type === 'POST' && loginUser === memberId && (
                            <LightButton
                                className="mr-1"
                                text="수정"
                                onClick={handleEdit}
                            />
                        )}
                        {(loginUser === postWriterId ||
                            loginUser === memberId ||
                            userBlogAuth === 'OWNER' ||
                            (type === 'COMMENT' &&
                                userBlogAuth === 'ADMIN')) && (
                            <LightButton
                                className="mr-1"
                                text="삭제"
                                onClick={handleDelete}
                            />
                        )}
                    </>
                )}
            </div>

            <AlertPopup
                show={showPopup}
                onConfirm={handleConfirm}
                title={popupTitle}
                text={popupText}
            />
            <ConfirmPopup
                show={showConfirmPopup}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowConfirmPopup(false)}
                title={popupTitle}
                text={popupText}
            />
        </div>
    );
}
