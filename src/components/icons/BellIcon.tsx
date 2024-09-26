'use client';

import { FaRegBell } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function BellIcon() {
    console.log('?');
    const router = useRouter();

    const handleNotificationClick = () => {
        router.push('/blog/notification', { scroll: false });
    };

    return (
        <button onClick={handleNotificationClick}>
            <FaRegBell className="cursor-pointer text-2xl text-customLightBlue-200 hover:text-customDarkBlue-200" />
        </button>
    );
}
