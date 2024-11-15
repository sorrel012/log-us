import Image from 'next/image';
import PersonIcon from '@/components/icons/PersonIcon';
import { dateFormatter } from '@/utils/commonUtil';
import { Comment } from '@/components/blog/post/PostCard';

export default function CommentCard({
    nickname,
    imgUrl,
    content,
    createDate,
}: Partial<Comment>) {
    return (
        <>
            <div className="flex items-start gap-3">
                {imgUrl ? (
                    <div className="relative size-10">
                        <Image
                            src={imgUrl}
                            alt={nickname!}
                            fill
                            className="rounded-full"
                        />
                    </div>
                ) : (
                    <PersonIcon size="size-10 " />
                )}
                <div className="flex flex-col text-sm">
                    {<div className="font-bold">{nickname}</div>}
                    <div className="text-customLightBlue-200">
                        {dateFormatter(createDate!)}
                    </div>
                </div>
            </div>
            <div className="mt-2 text-sm">{content}</div>
        </>
    );
}
