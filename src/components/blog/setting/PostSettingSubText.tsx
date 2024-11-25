import SubText from '@/components/SubText';
import { dateFormatter } from '@/utils/commonUtil';
import ViewIcon from '@/components/icons/ViewIcon';
import CommentIcon from '@/components/icons/CommentIcon';
import LikeIcon from '@/components/icons/LikeIcon';

interface ContentSubProps {
    series?: string;
    category?: string;
    nickName?: string;
    title?: string;
    date: Date;
    views?: number;
    comments?: number;
    likes?: number;
}

export default function PostSettingSubText({
    series,
    comments,
    likes,
    date,
    views,
    category,
    title,
    nickName,
}: ContentSubProps) {
    return (
        <>
            {nickName && <SubText text={nickName} />}
            {series && <SubText text={series} />}
            {category && <SubText text={category} />}
            {title && <SubText text={title} />}
            {date && <SubText text={dateFormatter(date)} />}
            <div className="flex gap-1">
                {views && <ViewIcon views={views!} />}
                {comments && <CommentIcon comments={comments!} />}
                {likes && <LikeIcon likes={likes!} />}
            </div>
        </>
    );
}
