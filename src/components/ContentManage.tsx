export interface ContentsProps {
    content: string;
    series?: string;
    category?: string;
    nickName?: string;
    title?: string;
    date: Date;
    views?: number;
    comments?: number;
    likes?: number;
}

export default function ContentManage({
    content,
    series,
    category,
    nickName,
    title,
    date,
    views,
    comments,
    likes,
}: ContentsProps) {
    return <></>;
}
