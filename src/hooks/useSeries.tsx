import { useFetch } from '@/hooks/useFetch';
import { useEffect, useState } from 'react';

export const UseSeries = () => {
    const { data, isLoading, isError, error } = useFetch('/series.json', {
        queryKey: ['series'],
    });

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    useEffect(() => {
        if (isError && !showPopup) {
            setPopupMessage(error ? error : '알 수 없는 오류가 발생했습니다.');
            setShowPopup(true);
        }
    }, [isError, error]);

    return {
        data,
        isLoading,
        isError,
        showPopup,
        popupMessage,
        handleClosePopup,
    };
};
