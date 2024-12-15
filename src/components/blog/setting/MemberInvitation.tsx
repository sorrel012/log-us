import React, { useState } from 'react';
import AddMemberPopup from '@/components/blog/setting/AddMemberPopup';
import { Member } from '@/components/sidebar/UserProfile';
import Image from 'next/image';
import PersonIcon from '@/components/icons/PersonIcon';
import { FaRegSquareMinus } from 'react-icons/fa6';
import AlertPopup from '@/components/AlertPopup';

export default function MemberInvitation({
    loginUserNickname,
    blogName,
    blogAddress,
    members,
    onAdd,
    onDelete,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [invitation, setInvitation] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    //TODO 블로그 도메인 수정
    const defaultInvitation = `${loginUserNickname}님이 새로운 Our-log에 초대하였습니다.\r\n - 블로그명: ${blogName}\r\n - 블로그 주소: https://logus.com/${blogAddress}`;

    const handleAddMember = (newMember: Member) => {
        const dupCnt = members.findIndex(
            (member) => member.memberId === newMember.memberId,
        );

        if (dupCnt < 0) {
            onAdd(newMember);
            setIsModalOpen(false);
        } else {
            setPopupTitle('이미 추가한 멤버입니다.');
            setPopupText('');
            setShowPopup(true);
        }
    };

    const handleDeleteMember = (selectedMember: Member) => {
        onDelete(selectedMember);
    };

    return (
        <>
            <div className="mt-4">
                <div className="mb-4 flex items-baseline gap-2.5">
                    <label htmlFor="introduce" className="block font-semibold">
                        멤버 초대
                    </label>
                    <button
                        className="rounded border border-solid border-customLightBlue-100 px-2 text-sm text-customLightBlue-200"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + 추가
                    </button>
                </div>
                <ul className="flex min-h-[120px] flex-wrap rounded border border-solid border-customLightBlue-100 px-3 py-1">
                    {members.map((member: Member) => (
                        <li
                            key={member.memberId}
                            className="flex w-[280px] items-center gap-2 px-5"
                        >
                            <>
                                {member.imgUrl && (
                                    <div className="relative h-10 w-10">
                                        <Image
                                            src={member.imgUrl}
                                            alt={`${member.nickname}'s photo`}
                                            fill
                                        />
                                    </div>
                                )}
                                {!member.imgUrl && (
                                    <PersonIcon size="size-10" />
                                )}
                            </>
                            <div className="max-w-[180px] truncate text-lg font-bold">
                                {member.nickname}
                            </div>
                            <FaRegSquareMinus
                                className="cursor-pointer text-customLightBlue-200"
                                onClick={() => handleDeleteMember(member)}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4">
                <label htmlFor="introduce" className="block font-semibold">
                    초대장
                </label>
                <textarea
                    id="introduce"
                    className="mt-4 w-full resize-none rounded border border-solid border-customLightBlue-100 p-2 text-sm leading-6 outline-none"
                    rows={8}
                    value={invitation}
                    onChange={(e) => setInvitation(e.target.value)}
                    placeholder={defaultInvitation}
                />
            </div>

            <AddMemberPopup
                show={isModalOpen}
                onConfirm={handleAddMember}
                onCancel={() => setIsModalOpen(false)}
            />

            <AlertPopup
                show={showPopup}
                onConfirm={() => setShowPopup(false)}
                title={popupTitle}
                text={popupText}
            />
        </>
    );
}
