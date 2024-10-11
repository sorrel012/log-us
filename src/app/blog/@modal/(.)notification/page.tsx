'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type NotificationType = 'comments' | 'subscriptions';

interface ModalType {
    title: string;
    type: NotificationType;
}

const notificationModalType: ModalType[] = [
    { title: '새 댓글', type: 'comments' },
    { title: '구독', type: 'subscriptions' },
];

export default function NotificationModalPage() {
    const router = useRouter();

    const [selectedType, setSelectedType] = useState('comments');

    const handleTabClick = (type: NotificationType) => {
        setSelectedType(type);
    };

    const onCloseClick = () => {
        router.back();
    };

    return (
        <div className="font-default fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="h-[60vh] w-[40vw] max-w-screen-lg rounded-lg bg-white px-3 shadow-lg lg:h-[65vh] lg:w-[50vw]">
                <div className="flex gap-10 border-b border-solid border-customLightBlue-100 px-2 pb-3 pt-5">
                    {notificationModalType.map((tab) => (
                        <h2
                            key={tab.type}
                            className={`text-md pb-2 hover:cursor-pointer hover:font-bold ${
                                selectedType === tab.type ? 'font-bold' : ''
                            }${selectedType !== tab.type ? 'text-customLightBlue-200' : ''}`}
                            onClick={() => handleTabClick(tab.type)}
                        >
                            {tab.title}
                        </h2>
                    ))}
                </div>
            </div>
        </div>
    );
}
