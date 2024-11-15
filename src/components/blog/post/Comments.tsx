import { Comment } from '@/components/blog/post/PostCard';
import { useState } from 'react';
import CommentCard from '@/components/blog/post/CommentCard';

export default function Comments({
    postId,
    memberId,
    nickname,
    imgUrl,
    commentId,
    depth,
    parentId,
    content,
    createDate,
    status,
    reportStatus,
}: Comment) {
    // TODO zustand로 수정
    const loginUser = 1;

    const [isReplyClicked, setIsReplyClicked] = useState(false);

    return (
        <div className="mb-3">
            {!parentId && (
                <>
                    <CommentCard
                        nickname={nickname}
                        content={content}
                        imgUrl={imgUrl}
                        createDate={createDate}
                    />
                    <button
                        className={`mt-3 rounded-md border border-solid px-2 text-sm ${isReplyClicked ? 'border-customLightBlue-200 bg-customLightBlue-200 text-white' : 'border-customLightBlue-200 text-customLightBlue-200'}`}
                        onClick={() =>
                            setIsReplyClicked((prevState) => !prevState)
                        }
                    >
                        답글
                    </button>
                </>
            )}
        </div>
    );
}
