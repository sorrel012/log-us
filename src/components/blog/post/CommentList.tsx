import { useState } from 'react';
import CommentCard from '@/components/blog/post/CommentCard';
import { Comment } from '@/components/blog/post/PostCard';
import { BsArrowReturnRight } from 'react-icons/bs';
import { AiOutlineUser } from 'react-icons/ai';
import { BiLock, BiLockOpen } from 'react-icons/bi';
import { escapeSpecialChars } from '@/utils/commonUtil';
import Popup from '@/components/Popup';
import { customFetch } from '@/utils/customFetch';

export default function CommentList({ parentComment, childComments, postId }) {
    //TODO zustand로 수정 필요
    const loginUser = 1;
    const loginUserNickname = '유저1';

    const { commentId, nickname, content, imgUrl, createDate }: Comment =
        parentComment;

    const [isReplyClicked, setIsReplyClicked] = useState(false);
    const [isPrivateReply, setIsPrivateReply] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleTextareaChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setReplyText(event.target.value);
    };

    const handleSaveReply = async () => {
        if (replyText.trim() === '') {
            alert('딥글 내용을 입력해 주세요.');
            return;
        }

        if (replyText.length > 300) {
            alert('답글 내용을 300자 이내로 입력해 주세요.');
            return;
        }

        const body = {
            postId,
            parentId: commentId,
            depth: 1,
            content: escapeSpecialChars(replyText),
            status: isPrivateReply ? 'PRIVATE' : 'PUBLIC',
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

            console.log('음?', res.data.commentId);
            childComments.push({
                commentId: res.data.commentId,
                content: replyText,
                createDate: new Date(),
                memberId: loginUser,
                nickname: loginUserNickname,
            });
        } catch (e) {
            setShowPopup(true);
            setPopupText(e);
        }
        setReplyText('');
    };

    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState('');

    const handleConfirm = () => {
        setShowPopup(false);
    };

    return (
        <div className="mb-3 border-b border-solid border-customLightBlue-100 pb-4">
            <CommentCard
                nickname={nickname}
                content={content}
                imgUrl={imgUrl}
                createDate={createDate}
            />
            <button
                className={`mt-4 rounded-md border border-solid px-2 py-0.5 text-sm ${isReplyClicked ? 'border-customLightBlue-200 bg-customLightBlue-200 text-white' : 'border-customLightBlue-200 text-customLightBlue-200'}`}
                onClick={() => setIsReplyClicked((prevState) => !prevState)}
            >
                답글
            </button>
            {isReplyClicked && (
                <div className="w-full">
                    {childComments.map((childComment: Comment) => (
                        <div
                            key={childComment.commentId}
                            className="mb-3 flex items-center gap-3"
                        >
                            <BsArrowReturnRight className="size-6 text-customLightBlue-200" />
                            <div>
                                <CommentCard
                                    nickname={childComment.nickname}
                                    content={childComment.content}
                                    imgUrl={childComment.imgUrl}
                                    createDate={childComment.createDate}
                                />
                            </div>
                        </div>
                    ))}
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
            )}
            <Popup
                show={showPopup}
                onConfirm={handleConfirm}
                text={popupText}
            />
        </div>
    );
}
