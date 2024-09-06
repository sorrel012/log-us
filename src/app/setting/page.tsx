'use client';

import ContentsSettingList from '@/components/ContentsSettingList';
import {
    ContentsButtonProps,
    ContentsProps,
} from '@/components/ContentSetting';
import { useEffect, useState } from 'react';

const postsContents: ContentsProps[] = [
    {
        postId: 1,
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        postId: 2,
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        postId: 3,
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
];

const commentContents: ContentsProps[] = [
    {
        commentId: 1,
        nickName: 'hana',
        contents: '안녕하세요 반갑습니다 와주셔서 감사드려요~',
        title: '[Next.js] Sanity 사용하기',
        date: new Date(),
    },
    {
        commentId: 2,
        nickName: 'hana',
        contents: '안녕하세요 반갑습니다 와주셔서 감사드려요~',
        title: '[Next.js] Sanity 사용하기',
        date: new Date(),
    },
    {
        commentId: 3,
        nickName: 'hana',
        contents: '안녕하세요 반갑습니다 와주셔서 감사드려요~',
        title: '[Next.js] Sanity 사용하기',
        date: new Date(),
    },
];

const noticeContents: ContentsProps[] = [
    {
        noticeId: 1,
        contents: '[업데이트] 통계 기능을 추가하였습니다.',
        date: new Date(),
        views: 50,
    },
    {
        noticeId: 2,
        contents: '[업데이트] 통계 기능을 추가하였습니다.',
        date: new Date(),
        views: 50,
    },
    {
        noticeId: 3,
        contents: '[업데이트] 통계 기능을 추가하였습니다.',
        date: new Date(),
        views: 50,
    },
];

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

    const handleCheckChange = (checkedContents: ContentsProps[]) => {
        setSelectedContents(checkedContents);
    };

    return (
        <div className="p-3">
            <ContentsSettingList
                contents={noticeContents}
                buttons={buttons}
                onChange={handleCheckChange}
            />
        </div>
    );
}
