import React, { useState } from 'react';
import { customFetch } from '@/utils/customFetch';
import AlertPopup from '@/components/AlertPopup';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function MemberWithdrawalForm() {
    const router = useRouter();
    const { loginUser } = useAuthStore();

    const [wantWithdrawal, setWantWithdrawal] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');
    const [popupId, setPopupId] = useState('CLOSE');

    const handleConfirm = () => {
        if (popupId === 'CLOSE') {
            setShowPopup(false);
        } else {
            router.push('/(main)');
        }
    };

    const handleWithdrawal = async () => {
        const res = await customFetch<any>(`/user/${loginUser}`, {
            queryKey: ['withdrawal'],
            method: 'DELETE',
        });

        if (res.isError) {
            setPopupTitle('탈퇴하지 못했습니다');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setPopupId('CLOSE');
            setShowPopup(true);
            return;
        }

        setPopupTitle('탈퇴되었습니다.');
        setPopupText('그동안 이용해 주셔서 감사합니다.');
        setPopupId('MOVE');
        setShowPopup(true);
    };

    return (
        <fieldset className="select-none">
            <legend className="mb-4 text-lg font-bold">회원 탈퇴</legend>
            <div className="text-sm leading-6">
                <p>탈퇴할 경우 My-log의 모든 데이터가 삭제됩니다..</p>
                <p>삭제된 내용은 다시 복구할 수 없습니다.</p>
                <p>
                    참여중인 Our-log에서도 탈퇴되며, Our-log의 데이터는 삭제되지
                    않습니다.
                </p>
                <p>동의할 경우 탈퇴 버튼을 눌러 탈퇴를 진행해 주세요.</p>
            </div>
            <div className="mt-2 flex items-center text-sm text-customLightBlue-200">
                <input
                    type="checkbox"
                    checked={wantWithdrawal || false}
                    onChange={(e) => setWantWithdrawal(e.target.checked)}
                    className="-ml-2 scale-50"
                    id="withdrawal"
                />
                <label htmlFor="withdrawal" className="ml-1 cursor-pointer">
                    유의사항을 모두 확인하였으며, 탈퇴를 희망합니다.
                </label>
            </div>
            <div className="-mt-2 text-right">
                <button
                    className={`rounded px-4 py-2 text-md ${wantWithdrawal ? 'border border-customBrown-100 text-customBrown-100' : 'border border-neutral-300 bg-neutral-300 text-neutral-700'}`}
                    disabled={!wantWithdrawal}
                    onClick={handleWithdrawal}
                >
                    탈퇴
                </button>
            </div>
            <AlertPopup
                show={showPopup}
                onConfirm={handleConfirm}
                title={popupTitle}
                text={popupText}
            />
        </fieldset>
    );
}