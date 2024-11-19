import Image from 'next/image';
import ViewIcon from '@/components/icons/ViewIcon';
import CommentIcon from '@/components/icons/CommentIcon';
import LikeIcon from '@/components/icons/LikeIcon';
import { useParams, useRouter } from 'next/navigation';
import { HiPhoto } from 'react-icons/hi2';
import { unescapeSpecialChars } from '@/utils/commonUtil';

interface Comment {
    commentId: number;
    memberId: number;
    nickname: string;
    imgUrl?: string;
    postId: number;
    parentId?: number;
    depth: number;
    content: string;
    status: string;
    reportStatus?: string;
    createDate: Date;
}

export interface Comments {
    parents?: Comment[];
    childComments?: Comment[];
}

export interface Post {
    postId: number;
    memberId: number;
    nickname: string;
    content: string;
    commentCount: number;
    liked: boolean;
    likeCount: number;
    createDate: Date;
    imgUrl?: string;
    tags?: string[];
    preId?: 1;
    preTitle?: string;
    nextId?: 3;
    nextTitle?: string;
    status: '';
    reportStatus?: string;
    views: number;
    title: string;
    categoryName: string;
    seriesId?: number;
    seriesName?: string;
    comments?: Comments;
}

export default function PostCard({
    postId,
    content,
    commentCount,
    likeCount,
    createDate,
    imgUrl,
    tags,
    reportStatus,
    views,
    title,
}: Post) {
    const { blogAddress } = useParams();
    const router = useRouter();
    const formattedDate = new Date(createDate).toLocaleDateString();

    const handlePostClick = () => {
        router.push(`/${blogAddress}/posts/${postId}`);
    };

    const handleTagClick = (tag: string) => {
        router.push(`/${blogAddress}/posts/tag/${tag}`);
    };

    return (
        <article className="rounded-xl border border-solid border-customLightBlue-100 p-5">
            <header
                className="hover-area flex cursor-pointer flex-col gap-3 lg:flex-row"
                onClick={handlePostClick}
            >
                <div className="size-[150px]">
                    {imgUrl ? (
                        <Image
                            src={imgUrl}
                            alt={title}
                            width={150}
                            height={150}
                            priority
                            className="hover-image-scale aspect-square size-32 object-cover"
                        />
                    ) : (
                        <HiPhoto className="h-[150px] w-[150px] text-customLightBlue-100" />
                    )}
                </div>
                <div className="flex w-full flex-col justify-between">
                    <div>
                        <div className="mb-1 flex flex-col items-center justify-between sm:flex-row">
                            <h3 className="hover-text-color text-lg font-bold">
                                {unescapeSpecialChars(title)}
                            </h3>
                            <time className="text-customLightBlue-200">
                                {formattedDate}
                            </time>
                        </div>
                        <div className="hover-font-bold line-clamp-3 leading-5">
                            {unescapeSpecialChars(content).replace(
                                /<[^>]*>/g,
                                '',
                            )}
                        </div>
                    </div>
                    <div className="flex gap-1 text-customLightBlue-200 sm:mt-3">
                        <ViewIcon views={views} />
                        <CommentIcon comments={commentCount} />
                        <LikeIcon likes={likeCount} />
                    </div>
                </div>
            </header>
            <footer className="mt-4 flex flex-wrap gap-2">
                {tags &&
                    tags.map((tag, index) => (
                        <span
                            className="cursor-pointer rounded-2xl bg-customBeige-100/70 px-3 py-1 text-sm text-customBrown-100"
                            key={index}
                            onClick={() => handleTagClick(tag)}
                        >
                            {tag}
                        </span>
                    ))}
            </footer>
        </article>
    );
}
