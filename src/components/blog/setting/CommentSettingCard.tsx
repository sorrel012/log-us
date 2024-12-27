import LightButton from '@/components/ui/LightButton';
import { Comment } from '@/components/blog/post/PostCard';
import { dateFormatter, unescapeSpecialChars } from '@/utils/commonUtil';
import SubText from '@/components/SubText';
import { useParams, usePathname, useRouter } from 'next/navigation';
import AlertPopup from '@/components/AlertPopup';
import React, { useEffect, useState } from 'react';
import ConfirmPopup from '@/components/ConfirmPopup';
import { customFetch } from '@/utils/customFetch';
import { useBlogStore } from '@/store/useBlogStore';

export default function CommentSettingCard({
    content,
    isLast,
    onSelect,
}: {
    content: Comment;
    isLast: boolean;
    onSelect: (content: Comment, isChecked: boolean) => void;
}) {
    //TODO zustand 로 수정
    const loginUser = 6;
    const router = useRouter();
    const { blogAddress } = useParams();
    const pathname = usePathname();
    const isOurLog = pathname.includes('/our-log');
    const { userBlogAuth } = useBlogStore();

    const [postWriterId, setPostWriterId] = useState();

    const {
        postId,
        title,
        createDate,
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
        if (isOurLog && postId) {
            (async () => {
                const res = await customFetch<any>(`/posts/${postId}`, {
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
    }, [isOurLog, postId]);

    const handleConfirm = () => {
        if (popupId === 'CLOSE') {
            setShowPopup(false);
        } else {
            router.refresh();
        }
    };

    const handlePostClick = () => {
        router.push(`/${blogAddress}/posts/${postId}?commentId=${commentId}`);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelect(content, e.target.checked);
    };

    const handleEdit = () => {
        router.push(`/${blogAddress}/newpost/${postId}`);
    };

    const handleDeleteConfirm = async () => {
        try {
            const res = await customFetch(`/comments/${commentId}`, {
                method: 'DELETE',
                queryKey: ['deletePost', postId],
            });

            if (res.isError) {
                throw new Error(res.error || '댓글을 삭제할 수 없습니다.');
            }

            setShowConfirmPopup(false);
            setPopupTitle('삭제되었습니다.');
            setPopupText('');
            setPopupId('REFRESH');
            setShowPopup(true);
        } catch (e) {
            setShowConfirmPopup(false);
            setPopupTitle('댓글을 삭제할 수 없습니다.');
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
                </div>
            </div>
            <div className="mt-2 shrink-0 text-customLightBlue-200 md:mt-0">
                {isOurLog && (
                    <>
                        {(loginUser === postWriterId ||
                            loginUser === memberId ||
                            userBlogAuth === 'OWNER' ||
                            userBlogAuth === 'ADMIN') && (
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