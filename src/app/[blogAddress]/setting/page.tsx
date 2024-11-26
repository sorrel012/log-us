'use client';

import { useState } from 'react';
import MemberInfoForm from '@/components/blog/setting/MemberInfoForm';
import AlertPopup from '@/components/AlertPopup';

export default function SettingMain() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    const handleConfirm = () => {};

    return (
        <filedset>
            <legend className="mb-8 text-lg font-bold">회원정보 변경</legend>
            <MemberInfoForm />
            <AlertPopup
                show={showPopup}
                onConfirm={handleConfirm}
                title={popupTitle}
                text={popupText}
            />
        </filedset>
    );
}
