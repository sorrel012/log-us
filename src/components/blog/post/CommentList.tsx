import { Post } from '@/components/blog/post/PostCard';
import { AiOutlineUser } from 'react-icons/ai';
import { useState } from 'react';
import { customFetch } from '@/utils/customFetch';
import { BiLock, BiLockOpen } from 'react-icons/bi';
import { escapeSpecialChars } from '@/utils/commonUtil';
import AlertPopup from '@/components/AlertPopup';
import CommentCard from '@/components/blog/post/CommentCard';
import ReplyList from '@/components/blog/post/ReplyList';
import { useBlogStore } from '@/store/useBlogStore';
import { useRouter } from 'next/navigation';

export default function CommentList({ postId, comments }: Post) {
    const router = useRouter();
    const { blogInfo } = useBlogStore();
    //TODO zustand로 수정 필요
    const loginUser = 1;
    const loginUserNickname = '유저1';
    const isMember =
        blogInfo?.shareYn === 'Y' &&
        blogInfo?.members.filter((member) => member.memberId === loginUser)
            .length === 1;

    // 댓글 관련 상태
    const [commentText, setCommentText] = useState('');
    const [isPrivateComment, setIsPrivateComment] = useState(false);

    const [parentCommentsState, setParentCommentsState] = useState(
        comments?.parents,
    );
    const [isReplyClicked, setIsReplyClicked] = useState(false);

    const handleTextareaChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setCommentText(event.target.value);
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
            status: isPrivateComment ? 'SECRET' : 'PUBLIC',
        };

        try {
            const res = await customFetch('/comments', {
                method: 'POST',
                queryKey: ['comment', 'save', commentText],
                body,
            });

            if (res.isError) {
                throw new Error(res.error || '댓글을 작성하지 못했습니다.');
            }

            comments?.parents.push({
                commentId: res.data.commentId,
                content: commentText,
                createDate: new Date(),
                memberId: loginUser,
                nickname: loginUserNickname,
                status: isPrivateComment ? 'SECRET' : 'PUBLIC',
            });

            comments?.childComments.push({
                parentId: res.data.commentId,
                childs: [],
            });
        } catch (e) {
            setShowPopup(true);
            setPopupText(e.message);
        }

        setCommentText('');
    };

    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState('');

    const handleConfirm = () => {
        setShowPopup(false);
    };

    const handleEditComment = (
        editCommentText: string,
        updatedStatus: string,
        index: number,
    ) => {
        setParentCommentsState((prevState) => {
            const updatedComments = [...prevState];
            updatedComments[index] = {
                ...updatedComments[index],
                content: editCommentText,
                status: updatedStatus,
            };
            return updatedComments;
        });
    };

    const handleDeleteComment = () => {
        router.refresh();
    };

    return (
        <section className="mx-auto mt-5 max-w-screen-2xl">
            <div className="mb-5">
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
                <div className="mt-4 flex items-center justify-end gap-3">
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
                    {parentCommentsState &&
                        parentCommentsState.map(
                            (
                                {
                                    commentId,
                                    nickname,
                                    content,
                                    imgUrl,
                                    createDate,
                                    memberId,
                                    parentId,
                                    status,
                                },
                                index,
                            ) => (
                                <div
                                    className="border-b border-solid border-customLightBlue-100 pb-2 pt-4"
                                    key={commentId}
                                >
                                    {status === 'SECRET' && !isMember ? (
                                        // <div className="mt-2 flex items-center gap-2 text-customLightBlue-200">
                                        //     <IoLockClosedOutline />
                                        //     <span>비밀 댓글입니다.</span>
                                        // </div>

                                        <CommentCard
                                            nickname={nickname}
                                            parentId={parentId}
                                            content={content}
                                            imgUrl={imgUrl}
                                            createDate={createDate}
                                            memberId={memberId}
                                            commentId={commentId}
                                            status={status}
                                            onEditSuccess={(
                                                updatedContent,
                                                updatedStatus,
                                            ) => {
                                                handleEditComment(
                                                    updatedContent,
                                                    updatedStatus,
                                                    index,
                                                );
                                            }}
                                            onDeleteSuccess={
                                                handleDeleteComment
                                            }
                                        />
                                    ) : (
                                        <CommentCard
                                            nickname={nickname}
                                            parentId={parentId}
                                            content={content}
                                            imgUrl={imgUrl}
                                            createDate={createDate}
                                            memberId={memberId}
                                            commentId={commentId}
                                            status={status}
                                            onEditSuccess={(
                                                updatedContent,
                                                updatedStatus,
                                            ) => {
                                                handleEditComment(
                                                    updatedContent,
                                                    updatedStatus,
                                                    index,
                                                );
                                            }}
                                            onDeleteSuccess={
                                                handleDeleteComment
                                            }
                                        />
                                    )}
                                    <button
                                        className={`mb-2 mt-4 rounded-md border border-solid px-2 py-0.5 text-sm ${isReplyClicked ? 'border-customLightBlue-200 bg-customLightBlue-200 text-white' : 'border-customLightBlue-200 text-customLightBlue-200'}`}
                                        onClick={() =>
                                            setIsReplyClicked(
                                                (prevState) => !prevState,
                                            )
                                        }
                                    >
                                        답글
                                    </button>
                                    {isReplyClicked && (
                                        <ReplyList
                                            childComments={
                                                comments.childComments?.filter(
                                                    (childComment) =>
                                                        childComment.parentId ===
                                                        commentId,
                                                )[0].childs
                                            }
                                            loginUser={loginUser}
                                            loginUserNickname={
                                                loginUserNickname
                                            }
                                            parentId={commentId}
                                            postId={postId}
                                        />
                                    )}
                                </div>
                            ),
                        )}
                </div>
            )}
            <AlertPopup
                show={showPopup}
                onConfirm={handleConfirm}
                title={popupText}
            />
        </section>
    );
}
