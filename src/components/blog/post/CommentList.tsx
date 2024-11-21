import { useState } from 'react';
import CommentCard from '@/components/blog/post/CommentCard';
import { Comment } from '@/components/blog/post/PostCard';
import { BsArrowReturnRight } from 'react-icons/bs';
import { AiOutlineUser } from 'react-icons/ai';

export default function CommentList({ parentComment, childComments }) {
    //TODO zustand로 수정 필요
    const loginUser = 1;
    const loginUserNickname = '유저1';

    const { nickname, content, imgUrl, createDate }: Comment = parentComment;

    const [isReplyClicked, setIsReplyClicked] = useState(false);

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
                                    />
                                </div>
                            </div>
                            <div className="mt-3 text-right">
                                <button
                                    className="rounded-md border border-solid border-customLightBlue-200 px-2 py-1 text-customLightBlue-200"
                                    disabled={!loginUser}
                                >
                                    등록
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
