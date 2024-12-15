import React, { useState } from 'react';
import { motion } from 'framer-motion';

import Link from 'next/link';
import { GoComment } from 'react-icons/go';
import { FaTimes } from 'react-icons/fa';
import { IoReturnDownForward } from 'react-icons/io5';

interface NotifyModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

const NotifyModal: React.FC<NotifyModalProps> = ({ isOpen, closeModal }) => {
    const [activeTab, setActiveTab] = useState(1);

    if (!isOpen) {
        return null;
    }

    const handleTabClick = (tab: number) => {
        setActiveTab(tab);
    };

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength
            ? `${text.slice(0, maxLength)}...`
            : text;
    };

    const new_comment = [
        {
            id: 1,
            type: 'comment',
            date: '2024-07-12 14:45',
            blog: '나무의 하루',
            post: '카카오 소셜로그인',
            user: 'orange',
        },
        {
            id: 2,
            type: 'comment',
            date: '2024-07-08 09:21',
            blog: '만다의 안식처',
            post: 'KT 60만명 해킹의 심각성 : 사상 최악의 사이버 어쩌구',
            user: 'kiki',
        },
        {
            id: 3,
            type: 'comment',
            date: '2024-07-03 01:34',
            blog: '소히소히 블로그',
            post: '서울 신도림/신림/구디 맛집 ',
            user: 'okn11',
        },
        {
            id: 4,
            type: 'reply',
            date: '2024-07-03 01:34',
            blog: '나무의 하루',
            post: '카카오 소셜로그인',
            comment: '소셜 로그인 방법을 모르는데 어떻게 아나요?',
            user: 'smile2',
        },
        {
            id: 5,
            type: 'reply',
            date: '2024-07-03 01:34',
            blog: '만다의 안식처',
            post: 'KT 60만명 해킹의 심각성 : 사상 최악의 사이버 어쩌구',
            comment: '제목보고 이게 무슨 소리인가 잠깐 벙졌음. 고객...',
            user: 'jayJ',
        },
    ];

    return (
        <div className="modal-backdrop font-default" onClick={closeModal}>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                exit={{ y: -100, opacity: 0 }}
            >
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ul className="my-5 ml-3 flex w-full gap-14">
                        <li
                            className={`cursor-pointer ${activeTab === 1 ? 'underline decoration-2 underline-offset-4' : 'text-gray-500'}`}
                            onClick={() => handleTabClick(1)}
                        >
                            새 댓글
                        </li>
                        <li
                            className={`cursor-pointer ${activeTab === 2 ? 'underline decoration-2 underline-offset-4' : 'text-gray-500'}`}
                            onClick={() => handleTabClick(2)}
                        >
                            구독
                        </li>
                    </ul>
                    <div className="w-full border border-solid border-gray-200"></div>
                    <div className="py-3">
                        {activeTab === 1 &&
                            new_comment.map((item) =>
                                item.type === 'comment' ? (
                                    <div
                                        key={item.id}
                                        className="my-4 flex content-start justify-between"
                                    >
                                        <div className="flex">
                                            <div className="mt-1">
                                                <GoComment />
                                            </div>
                                            <div className="ml-2 text-left">
                                                <div className="text-sm">
                                                    {truncateText(
                                                        `${item.user} 님이 [${item.blog}]의 '${item.post}'에 댓글을 남겼습니다.`,
                                                        50,
                                                    )}
                                                </div>
                                                <div className="text-sm">
                                                    {item.date}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-1 cursor-pointer">
                                            <FaTimes />
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key={item.id}
                                        className="my-4 flex content-start justify-between"
                                    >
                                        <div className="flex">
                                            <div className="mt-1">
                                                <IoReturnDownForward />
                                            </div>
                                            <div className="ml-2 text-left">
                                                <div className="text-sm">
                                                    {truncateText(
                                                        `${item.user} 님이 [${item.blog}]의 '${item.comment}'에 대댓글을 남겼습니다.`,
                                                        50,
                                                    )}
                                                </div>
                                                <div className="text-sm">
                                                    {item.date}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-1 cursor-pointer">
                                            <FaTimes />
                                        </div>
                                    </div>
                                ),
                            )}

                        {activeTab === 2 && <div>구독 알림</div>}
                    </div>
                    <div className="w-full border border-solid border-gray-200"></div>
                    <div className="mt-5 flex w-full justify-end gap-5">
                        <button className="rounded-md bg-customBrown-100 px-4 py-1 text-sm text-white">
                            <Link href="/">전체보기</Link>
                        </button>
                        <button
                            onClick={closeModal}
                            className="rounded-md bg-customDarkBlue-100 px-4 py-1 text-sm text-white"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default NotifyModal;
