'use client';

import { IoMdNotificationsOutline } from 'react-icons/io';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();

    const handleNotificationClick = () => {
        router.push('/blog/notification/notification');
    };

    return (
        <button className="hover:cursor-pointer">
            <IoMdNotificationsOutline onClick={handleNotificationClick} />
        </button>
    );
}
