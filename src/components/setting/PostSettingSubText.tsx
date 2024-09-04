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

export default function PostSettingSubText(content: ContentSubProps) {
    return (
        <>
            <SubText text={content.series!} />
            <SubText text={content.category!} />
            {content.date && <SubText text={dateFormatter(content.date)} />}
            <div className="flex gap-1">
                <ViewIcon views={content.views!} />
                <CommentIcon comments={content.comments!} />
                <LikeIcon likes={content.likes!} />
            </div>
        </>
    );
}
