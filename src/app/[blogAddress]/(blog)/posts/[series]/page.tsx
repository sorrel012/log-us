'use client';

import { useParams } from 'next/navigation';
import { useFetch } from '@/hooks/useFetch';
import Popup from '@/components/Popup';
import { useEffect, useState } from 'react';

export default function PostListPage() {
    const { blogAddress, series } = useParams();
    const seriesId =
        series && typeof series === 'string'
            ? +decodeURIComponent(series).split('=')[1]
            : 0;

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const {
        data: blogId,
        isError: isBlogIdError,
        error: blogIdError,
    } = useFetch('/blog-id.json', {
        params: { blogAddress: blogAddress },
        queryKey: ['posts', seriesId],
    });

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    useEffect(() => {
        if (isBlogIdError && !showPopup) {
            setPopupMessage(
                blogIdError ? blogIdError : '알 수 없는 오류가 발생했습니다.',
            );
            setShowPopup(true);
        }
    }, [isBlogIdError, blogIdError]);

    return (
        <>
            <div>seriesId: {seriesId}</div>
            <Popup
                show={showPopup}
                title="에러"
                text={popupMessage}
                onClose={handleClosePopup}
            />
        </>
    );
}
