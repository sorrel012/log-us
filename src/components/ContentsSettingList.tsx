import ContentSetting from '@/components/ContentSetting';
import PostSettingSubText from '@/components/setting/PostSettingSubText';
import { useState } from 'react';

export interface ContentsProps {
    contents: string;
    series?: string;
    category?: string;
    nickName?: string;
    title?: string;
    date: Date;
    views?: number;
    comments?: number;
    likes?: number;
}

export default function ContentsSettingList({
    contents,
}: {
    contents: ContentsProps[];
}) {
    const [selectedContents, setSelectedContents] = useState<ContentsProps[]>(
        [],
    );

    const handleCheckboxChange = (
        newSelectedContents: ContentsProps[],
        isChecked: boolean,
    ) => {
        setSelectedContents(newSelectedContents);
    };

    return (
        <section className="font-default rounded-md border border-solid border-customLightBlue-100">
            {contents.map((content, index) => (
                <ContentSetting
                    key={content.title}
                    content={content}
                    isLast={index === contents.length - 1}
                    onSelect={handleCheckboxChange}
                >
                    <PostSettingSubText {...content} />
                </ContentSetting>
            ))}
        </section>
    );
}
