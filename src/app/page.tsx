'use client';

import { useState } from 'react';
import Popup from '@/components/Popup';

export default function Home() {
    const [showAlert, setShowAlert] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const openAlert = () => {
        setShowAlert(true);
    };

    const openConfirm = () => {
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        // Confirm 동의 X (취소)
        setShowConfirm(false);
    };

    const handleClose = () => {
        // Confirm 동의 후 처리 (확인)
        setShowConfirm(false);
    };

    return (
        <>
            <div onClick={openAlert}>Alert 띄우기</div>
            <div onClick={openConfirm}>Confirm 띄우기</div>
            <Popup
                show={showAlert}
                title="[ 나무의 하루 ] 를 구독하였습니다."
                onClose={() => setShowAlert(false)}
            />
            <Popup
                show={showConfirm}
                title="글을 삭제하시겠습니까? "
                text="삭제한 글은 복구할 수 없습니다."
                type="confirm"
                onConfirm={handleConfirm}
                onClose={handleClose}
            />
        </>
    );
}
