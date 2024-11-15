import { Post } from '@/components/blog/post/PostCard';
import LikeIcon from '@/components/icons/LikeIcon';
import CommentIcon from '@/components/icons/CommentIcon';
import { AiOutlineUser } from 'react-icons/ai';
import Comments from '@/components/blog/post/Comments';

export default function PostDetailComments({
    postId,
    liked,
    likeCount,
    commentCount,
    comments,
}: Post) {
    //TODO zustand로 수정 필요
    const loginUser = 1;
    const loginUserNickname = 'user1';

    return (
        <section className="mt-6">
            <div className="mb-10 flex justify-between border-b border-solid border-customLightBlue-100 pb-2 text-customLightBlue-200">
                <LikeIcon likes={likeCount} />
                <CommentIcon comments={commentCount} />
            </div>
            <div className="mb-3">
                <div className="flex items-start gap-3">
                    {loginUser && (
                        <AiOutlineUser
                            className={
                                'size-16 rounded-full bg-fuchsia-100 p-1'
                            }
                        />
                    )}
                    <div className="flex w-full flex-col gap-1 text-sm">
                        {loginUser && (
                            <div className="font-bold">{loginUserNickname}</div>
                        )}
                        <textarea
                            className="min-h-[70px] w-full resize-none rounded-md border border-solid border-customLightBlue-100 p-2 outline-none"
                            placeholder="댓글을 입력해 주세요."
                        />
                    </div>
                </div>
                <div className="mt-3 text-right">
                    <button className="rounded-md border border-solid border-customLightBlue-200 px-2 py-1 text-customLightBlue-200">
                        등록
                    </button>
                </div>
            </div>
            {comments && (
                <div>
                    {comments.map((comment) => (
                        <Comments key={comment.commentId} {...comment} />
                    ))}
                </div>
            )}
        </section>
    );
}
