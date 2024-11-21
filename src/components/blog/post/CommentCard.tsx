import Image from 'next/image';
import PersonIcon from '@/components/icons/PersonIcon';
import { Comment } from '@/components/blog/post/PostCard';
import { dateFormatter } from '@/utils/commonUtil';

export default function CommentCard({
    nickname,
    imgUrl,
    content,
    createDate,
}: Partial<Comment>) {
    return (
        <>
            <div className="flex items-start gap-3 pt-3">
                {imgUrl ? (
                    <div className="relative size-12">
                        <Image
                            src={imgUrl}
                            alt={nickname!}
                            fill
                            className="rounded-full"
                        />
                    </div>
                ) : (
                    <PersonIcon size="size-12 " />
                )}
                <div className="flex flex-col gap-2 text-md">
                    {<div className="font-bold">{nickname}</div>}
                    <div className="text-customLightBlue-200">
                        {dateFormatter(createDate!)}
                    </div>
                </div>
            </div>
            <div className="mt-2 text-md leading-6">{content}</div>
        </>
    );
}
