import ContentManage, { ContentsProps } from '@/components/ContentManage';

export default function ContentsManageList({
    contents,
}: {
    contents: ContentsProps[];
}) {
    return (
        <section>
            {contents.map((content) => (
                <ContentManage key={content.title} {...content} />
            ))}
        </section>
    );
}
