import { Post } from '@/components/blog/post/PostCard';
import LikeIcon from '@/components/icons/LikeIcon';
import CommentIcon from '@/components/icons/CommentIcon';
import { AiOutlineUser } from 'react-icons/ai';
import { useState } from 'react';
import { customFetch } from '@/utils/customFetch';
import { BiLock, BiLockOpen } from 'react-icons/bi';
import { escapeSpecialChars } from '@/utils/commonUtil';
import Popup from '@/components/Popup';
import CommentList from '@/components/blog/post/CommentList';

export default function PostDetailComments({
    postId,
    liked,
    likeCount,
    commentCount,
    comments,
}: Post) {
    //TODO zustand로 수정 필요
    const loginUser = 1;
    const loginUserNickname = '유저1';

    const [commentText, setCommentText] = useState('');
    const [isPrivateComment, setIsPrivateComment] = useState(false);
    const [likesCnt, setLikesCnt] = useState(likeCount);
    const [isLiked, setIsLiked] = useState(liked);

    const handleTextareaChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setCommentText(event.target.value);
    };

    const handleLikeClick = async () => {
        const res = await customFetch(`/like/${postId}`, {
            method: isLiked ? 'DELETE' : 'POST',
            queryKey: ['liked', isLiked],
            invalidateCache: true,
        });

        if (!res.isError) {
            setLikesCnt((prevState) =>
                isLiked ? prevState - 1 : prevState + 1,
            );
            setIsLiked((prevState) => !prevState);
        }
    };

    const handleSaveComment = async () => {
        if (commentText.trim() === '') {
            setShowPopup(true);
            setPopupText('댓글 내용을 입력해 주세요.');
            return;
        }

        if (commentText.length > 300) {
            setShowPopup(true);
            setPopupText('댓글 내용을 300자 이내로 입력해 주세요.');
            return;
        }

        const body = {
            postId,
            parentId: null,
            depth: 0,
            content: escapeSpecialChars(commentText),
            status: isPrivateComment ? 'PRIVATE' : 'PUBLIC',
        };

        try {
            const res = await customFetch('/comments', {
                method: 'POST',
                queryKey: ['comment', 'save', commentText],
                body,
            });

            if (res.isError) {
                throw new Error(res.error || '답글을 작성하지 못했습니다.');
            }

            comments?.parents.push({
                commentId: res.data.commentId,
                content: commentText,
                createDate: new Date(),
                memberId: loginUser,
                nickname: loginUserNickname,
            });

            comments?.childComments.push({
                parentId: res.data.commentId,
                childs: [],
            });
        } catch (e) {
            setShowPopup(true);
            setPopupText(e);
        }

        setCommentText('');
    };

    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState('');

    const handleConfirm = () => {
        setShowPopup(false);
    };

    return (
        <section className="mx-auto mt-10 max-w-screen-2xl">
            <div className="mb-10 flex justify-between border-b border-solid border-customLightBlue-100 pb-2 text-customLightBlue-200">
                <LikeIcon
                    likes={likesCnt}
                    isClick={true}
                    liked={isLiked}
                    onClick={handleLikeClick}
                />
                <CommentIcon comments={commentCount} />
            </div>
            <div className="mb-3">
                <div className="flex items-start gap-3">
                    {/* TODO 사용자 프로필 사진 추가 필요*/}
                    {loginUser && (
                        <AiOutlineUser
                            className={
                                'size-16 rounded-full bg-fuchsia-100 p-1'
                            }
                        />
                    )}
                    <div className="flex w-full flex-col gap-2 text-md">
                        {loginUser && (
                            <div className="font-bold">{loginUserNickname}</div>
                        )}
                        <textarea
                            className="min-h-[70px] w-full resize-none rounded-md border border-solid border-customLightBlue-100 p-2 leading-6 outline-none"
                            placeholder={`${loginUser ? '댓글을 입력해 주세요.' : '로그인 후 댓글을 작성할 수 있습니다.'}`}
                            disabled={!loginUser}
                            value={commentText}
                            onChange={handleTextareaChange}
                        />
                    </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-3">
                    {loginUser && (
                        <button
                            onClick={() =>
                                setIsPrivateComment((prevState) => !prevState)
                            }
                        >
                            {isPrivateComment ? (
                                <BiLock className="size-6 text-customLightBlue-200" />
                            ) : (
                                <BiLockOpen className="popup-bounce size-6 text-customLightBlue-200" />
                            )}
                        </button>
                    )}
                    <button
                        className="rounded-md border border-solid border-customLightBlue-200 px-2 py-1 text-customLightBlue-200"
                        disabled={!loginUser}
                        onClick={handleSaveComment}
                    >
                        등록
                    </button>
                </div>
            </div>
            {comments && (
                <div>
                    {comments.parents &&
                        comments.parents.map((comment) => (
                            <div key={comment.commentId}>
                                <CommentList
                                    parentComment={comment}
                                    childComments={
                                        comments.childComments?.filter(
                                            (childComment) =>
                                                childComment.parentId ===
                                                comment.commentId,
                                        )[0].childs
                                    }
                                    postId={postId}
                                />
                            </div>
                        ))}
                </div>
            )}
            <Popup
                show={showPopup}
                onConfirm={handleConfirm}
                text={popupText}
            />
        </section>
    );
}
