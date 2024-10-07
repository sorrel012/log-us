import Image from 'next/image';
import ViewIcon from '@/components/icons/ViewIcon';
import CommentIcon from '@/components/icons/CommentIcon';
import LikeIcon from '@/components/icons/LikeIcon';

export interface Post {
    postId: number;
    memberId: number;
    nickname: string;
    categoryId: number;
    categoryName: string;
    seriesId: number;
    seriesName: string;
    title: string;
    content: string;
    imgUrl: string;
    views: number;
    reportStatus?: string;
    createdDate: Date;
    likeCount: number;
    commentCount: number;
    tags?: string[];
}

export default function PostCard({
    postId,
    content,
    categoryId,
    categoryName,
    commentCount,
    likeCount,
    createdDate,
    imgUrl,
    tags,
    seriesName,
    seriesId,
    memberId,
    reportStatus,
    views,
    nickname,
    title,
}: Post) {
    const formattedDate = new Date(createdDate).toLocaleDateString();

    return (
        <article className="rounded-xl border border-solid border-customLightBlue-100 p-5">
            <header className="flex flex-col gap-3 lg:flex-row">
                <Image
                    src={imgUrl}
                    alt={title}
                    width={120}
                    height={120}
                    className="aspect-square size-32 border border-solid border-customLightBlue-100 object-cover"
                />
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="mb-1 flex flex-col justify-between sm:flex-row">
                            <h3 className="text-lg font-bold">{title}</h3>
                            <time className="text-customLightBlue-200">
                                {formattedDate}
                            </time>
                        </div>
                        <div className="line-clamp-3 leading-5">{content}</div>
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
                            className="rounded-2xl bg-customBeige-100/70 px-3 py-1 text-sm text-customBrown-100"
                            key={index}
                        >
                            {tag}
                        </span>
                    ))}
            </footer>
        </article>
    );
}
