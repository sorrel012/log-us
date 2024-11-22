import { Comment } from '@/components/blog/post/PostCard';
import { BsArrowReturnRight } from 'react-icons/bs';
import CommentCard from '@/components/blog/post/CommentCard';
import { AiOutlineUser } from 'react-icons/ai';
import { BiLock, BiLockOpen } from 'react-icons/bi';
import { useState } from 'react';
import { escapeSpecialChars } from '@/utils/commonUtil';
import { customFetch } from '@/utils/customFetch';
import AlertPopup from '@/components/AlertPopup';
import { IoLockClosedOutline } from 'react-icons/io5';

export default function ReplyList({
    loginUser,
    loginUserNickname,
    postId,
    postWriterId,
    isMember,
    commentWriterId,
    parentId,
    childComments,
}) {
    const [childCommentsState, setChildCommentsState] = useState(childComments);
    const [replyText, setReplyText] = useState('');
    const [isPrivateReply, setIsPrivateReply] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');

    const handleTextareaChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setReplyText(event.target.value);
    };

    const handleSaveReply = async () => {
        if (replyText.trim() === '') {
            setShowPopup(true);
            setPopupTitle('딥글 내용을 입력해 주세요.');
            return;
        }

        if (replyText.length > 300) {
            setShowPopup(true);
            setPopupTitle('답글 내용을 300자 이내로 입력해 주세요.');
            return;
        }

        const body = {
            postId,
            parentId,
            depth: 1,
            content: escapeSpecialChars(replyText),
            status: isPrivateReply ? 'SECRET' : 'PUBLIC',
        };

        try {
            const res = await customFetch('/comments', {
                method: 'POST',
                queryKey: ['reply', 'save', replyText],
                body,
            });

            if (res.isError) {
                throw new Error(res.error || '답글을 작성하지 못했습니다.');
            }

            childComments.push({
                commentId: res.data.commentId,
                content: replyText,
                createDate: new Date(),
                memberId: loginUser,
                nickname: loginUserNickname,
                status: isPrivateReply ? 'SECRET' : 'PUBLIC',
            });

            setIsPrivateReply(false);
        } catch (e) {
            setShowPopup(true);
            setPopupTitle(e.message);
        }
        setReplyText('');
    };

    const handleEditReply = (
        editReplyText: string,
        updatedReplyStatus: string,
        index: number,
    ) => {
        setChildCommentsState((prevState) => {
            const updatedReplies = [...prevState];
            updatedReplies[index] = {
                ...updatedReplies[index],
                content: editReplyText,
                status: updatedReplyStatus,
            };
            return updatedReplies;
        });
    };

    const handleDeleteReply = (deletedReplyId: number) => {
        setChildCommentsState((prevState) => {
            return prevState.filter(
                (reply) => reply.commentId !== deletedReplyId,
            );
        });
    };

    return (
        <>
            <div className="w-full">
                {childCommentsState.map(
                    (childComment: Comment, index: number) => (
                        <div
                            key={childComment.commentId}
                            className="mb-3 flex items-center gap-3"
                        >
                            <BsArrowReturnRight className="size-6 text-customLightBlue-200" />
                            {
                                <div className="w-full">
                                    {childComment.status !== 'SECRET' ||
                                    postWriterId === loginUser ||
                                    isMember ||
                                    commentWriterId === loginUser ||
                                    childComment.memberId === loginUser ? (
                                        <CommentCard
                                            nickname={childComment.nickname}
                                            parentId={childComment.parentId}
                                            content={childComment.content}
                                            imgUrl={childComment.imgUrl}
                                            createDate={childComment.createDate}
                                            memberId={childComment.memberId}
                                            status={childComment.status}
                                            commentId={childComment.commentId}
                                            onEditSuccess={(
                                                updatedContent,
                                                updatedStatus,
                                            ) => {
                                                handleEditReply(
                                                    updatedContent,
                                                    updatedStatus,
                                                    index,
                                                );
                                            }}
                                            onDeleteSuccess={(
                                                deletedCommentId,
                                            ) => {
                                                handleDeleteReply(
                                                    deletedCommentId,
                                                );
                                            }}
                                        />
                                    ) : (
                                        <div className="mb-2 mt-2 flex items-center gap-2 text-customLightBlue-200">
                                            <IoLockClosedOutline />
                                            <span>비밀 답글입니다.</span>
                                        </div>
                                    )}
                                </div>
                            }
                        </div>
                    ),
                )}
                <div className="mb-2 mt-5 flex gap-3">
                    <BsArrowReturnRight className="size-6 text-customLightBlue-200" />
                    <div className="w-full">
                        <div className="flex items-start gap-3">
                            {/* TODO 사용자 프로필 사진 추가 필요*/}
                            {loginUser && (
                                <AiOutlineUser
                                    className={
                                        'size-12 rounded-full bg-fuchsia-100 p-1'
                                    }
                                />
                            )}
                            <div className="flex w-full flex-col gap-2 text-md">
                                {loginUser && (
                                    <div className="font-bold">
                                        {loginUserNickname}
                                    </div>
                                )}
                                <textarea
                                    className="min-h-[70px] w-full resize-none rounded-md border border-solid border-customLightBlue-100 p-2 leading-6 outline-none"
                                    placeholder={`${loginUser ? '답글을 입력해 주세요.' : '로그인 후 답글을 작성할 수 있습니다.'}`}
                                    disabled={!loginUser}
                                    value={replyText}
                                    onChange={handleTextareaChange}
                                />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-end gap-2">
                            {loginUser && (
                                <button
                                    onClick={() =>
                                        setIsPrivateReply(
                                            (prevState) => !prevState,
                                        )
                                    }
                                >
                                    {isPrivateReply ? (
                                        <BiLock className="size-5 text-customLightBlue-200" />
                                    ) : (
                                        <BiLockOpen className="popup-bounce size-5 text-customLightBlue-200" />
                                    )}
                                </button>
                            )}
                            <button
                                className="rounded-md border border-solid border-customLightBlue-200 px-2 py-1 text-customLightBlue-200"
                                disabled={!loginUser}
                                onClick={handleSaveReply}
                            >
                                등록
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <AlertPopup
                show={showPopup}
                onConfirm={() => setShowPopup(false)}
                title={popupTitle}
            />
        </>
    );
}
