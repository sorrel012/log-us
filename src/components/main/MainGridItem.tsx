import { Image } from 'next/dist/client/image-component';
import { HiPhoto } from 'react-icons/hi2';
import Link from 'next/link';
import ViewIcon from '@/components/icons/ViewIcon';
import CommentIcon from '@/components/icons/CommentIcon';
import LikeIcon from '@/components/icons/LikeIcon';
import { unescapeSpecialChars } from '@/utils/commonUtil';

const MainGridItem = ({
    blogAddress,
    postId,
    title,
    content,
    imgUrl,
    views,
    commentCount,
    likeCount,
}) => {
    return (
        <Link
            href={`/${blogAddress}/posts/${postId}`}
            className="font-default rounded-md border border-solid border-gray-200 bg-white shadow"
        >
            <div className="flex items-center gap-3 px-5">
                {imgUrl ? (
                    <Image src={imgUrl} width={150} height={150} alt={title} />
                ) : (
                    <HiPhoto className="h-[150px] w-[150px] text-customLightBlue-100" />
                )}
                <div className="flex w-7/12 flex-col justify-between">
                    <div>
                        <div className="mb-2 truncate text-lg font-semibold">
                            {unescapeSpecialChars(title)}
                        </div>
                        <div className="line-clamp-2 text-sm text-gray-600">
                            {unescapeSpecialChars(content)}
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm text-customLightBlue-200">
                        <ViewIcon views={views} />
                        <CommentIcon comments={commentCount} />
                        <LikeIcon likes={likeCount} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MainGridItem;
