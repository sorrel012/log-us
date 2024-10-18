import Image from 'next/image';
import ViewIcon from '@/components/icons/ViewIcon';
import CommentIcon from '@/components/icons/CommentIcon';
import LikeIcon from '@/components/icons/LikeIcon';
import { useParams, useRouter } from 'next/navigation';

export interface Post {
    postId: number;
    content: string;
    commentCount: number;
    likeCount: number;
    createdDate: Date;
    imgUrl: string;
    tags?: string[];
    status: '';
    reportStatus?: string;
    views: number;
    title: string;
}

export default function PostCard({
    postId,
    content,
    commentCount,
    likeCount,
    createdDate,
    imgUrl,
    tags,
    status,
    reportStatus,
    views,
    title,
}: Post) {
    const { blogAddress } = useParams();
    const router = useRouter();
    const formattedDate = new Date(createdDate).toLocaleDateString();

    const handlePostClick = () => {
        router.push(`/${blogAddress}/posts/post/${postId}`);
    };

    const handleTagClick = (tag: string) => {
        router.push(`/${blogAddress}/posts/tag/${tag}`);
    };

    return (
        // TODO reportStatus에 따라 화면 처리
        <article className="rounded-xl border border-solid border-customLightBlue-100 p-5">
            <header
                className="hover-area flex cursor-pointer flex-col gap-3 lg:flex-row"
                onClick={handlePostClick}
            >
                <Image
                    src={imgUrl}
                    alt={title}
                    width={120}
                    height={120}
                    className="hover-image-scale aspect-square size-32 object-cover"
                />
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="mb-1 flex flex-col justify-between sm:flex-row">
                            <h3 className="hover-text-color text-lg font-bold">
                                {title}
                            </h3>
                            <time className="text-customLightBlue-200">
                                {formattedDate}
                            </time>
                        </div>
                        <div className="hover-font-bold line-clamp-3 leading-5">
                            {content}
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