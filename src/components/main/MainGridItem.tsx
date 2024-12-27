import { Image } from 'next/dist/client/image-component';
import { HiPhoto } from 'react-icons/hi2';
import Link from 'next/link';
import ViewIcon from '@/components/icons/ViewIcon';
import CommentIcon from '@/components/icons/CommentIcon';
import LikeIcon from '@/components/icons/LikeIcon';
import { unescapeSpecialChars } from '@/utils/commonUtil';

interface MainGridItemProps {
    postId: number;
    blogId: number;
    imgUrl?: string;
    title: string;
    content: string;
    views: number;
    commentCount: number;
    likeCount: number;
    blogAddress: string;
}

const MainGridItem = ({
    imgUrl,
    title,
    content,
    views,
    commentCount,
    likeCount,
    blogAddress,
    postId,
}: MainGridItemProps) => {
    return (
        <Link
            href={`/${blogAddress}/posts/${postId}`}
            className="font-default flex w-full items-center rounded-md border border-solid border-gray-200 bg-white py-3 shadow"
        >
            <div className="flex w-full flex-col items-center gap-3 px-3 py-1 text-center md:flex-row">
                <div>
                    {imgUrl ? (
                        <div className="w-[100px]">
                            <Image
                                src={imgUrl}
                                width={100}
                                height={100}
                                alt={title}
                            />
                        </div>
                    ) : (
                        <HiPhoto className="h-[100px] w-[100px] text-customLightBlue-100" />
                    )}
                </div>
                <div className="flex w-full flex-col justify-between md:max-w-[210px] lg:w-[200px]">
                    <div>
                        <div className="mb-2 truncate text-left text-lg font-semibold">
                            {unescapeSpecialChars(title)}
                        </div>
                        <div className="line-clamp-2 text-left text-sm text-gray-600">
                            {unescapeSpecialChars(content).replace(
                                /<[^>]*>/g,
                                '',
                            )}
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