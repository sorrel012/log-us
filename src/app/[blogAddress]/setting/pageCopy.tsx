'use client';

import ContentsSettingList from '@/components/ContentsSettingList';
import { useEffect, useState } from 'react';
import {
    ContentsButtonProps,
    ContentsProps,
} from '@/components/ContentSetting';

export default function SettingMain() {
    const [selectedContents, setSelectedContents] = useState<ContentsProps[]>(
        [],
    );

    useEffect(() => {
        console.log(selectedContents);
    }, [selectedContents]);

    const handleUpdate = (val: number) => {};
    const handleDelete = (val: number) => {};
    const handleStatistics = (val: number) => {};

    const buttons: ContentsButtonProps[] = [
        {
            text: '수정',
            onClick: handleUpdate,
        },
        {
            text: '삭제',
            onClick: handleDelete,
        },
        {
            text: '통계',
            onClick: handleStatistics,
        },
    ];

    return (
        <div className="mx-auto max-w-screen-2xl p-3">
            <ContentsSettingList
                contents={noticeContents}
                buttons={buttons}
                onChange={handleCheckChange}
            />
        </div>
    );
}
