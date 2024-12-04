'use client';

import React, { useState } from 'react';
import { FcCancel, FcOk } from 'react-icons/fc';
import { customFetch } from '@/utils/customFetch';
import { Member } from '@/components/sidebar/UserProfile';
import AddMemberPopup from '@/components/blog/setting/AddMemberPopup';
import AlertPopup from '@/components/AlertPopup';
import Image from 'next/image';
import PersonIcon from '@/components/icons/PersonIcon';
import { FaRegSquareMinus } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import emailjs from 'emailjs-com';

export default function NewBlogPage() {
    const router = useRouter();
    // TODO zustand로 수정
    const loginUserNickname = 'hana';

    const [blogName, setBlogName] = useState('');
    const [blogAddress, setBlogAddress] = useState('');
    const [introduce, setIntroduce] = useState('');
    const [members, setMembers] = useState<Member[]>([]);
    const [invitation, setInvitation] = useState('');
    const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
    const [isDuplicatedCheckedClicked, setIsDuplicatedCheckedClicked] =
        useState(false);
    const [blogAddressMessage, setBlogAddressMessage] = useState(
        '사용할 수 없는 블로그 주소입니다.',
    );

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    //TODO 블로그 도메인 수정
    const defaultInvitation = `${loginUserNickname}님이 새로운 Our-log에 초대하였습니다.\r\n - 블로그명: ${blogName}\r\n - 블로그 주소: https://logus.com/${blogAddress}`;
    const validateBlogName = (name: string) => {
        const regex = /^[a-zA-Z가-힣0-9-_]+$/;
        return name.length >= 2 && name.length <= 20 && regex.test(name);
    };

    const handleBlogAddressChange = (e) => {
        setIsDuplicateChecked(false);
        setBlogAddress(e.target.value);
    };

    const validateBlogAddress = (address: string) => {
        const regex = /^[a-zA-Z0-9-]+$/;
        return (
            address.length >= 4 &&
            address.length <= 32 &&
            regex.test(address) &&
            !address.startsWith('-') &&
            !address.endsWith('-') &&
            !address.includes('--')
        );
    };

    const handleDuplicateCheck = async () => {
        setIsDuplicatedCheckedClicked(true);
        if (!validateBlogAddress(blogAddress)) {
            setIsDuplicateChecked(false);
            setBlogAddressMessage('사용할 수 없는 주소입니다.');
            return;
        }

        const res = await customFetch('/blog/address-dupl', {
            queryKey: ['address-dupl', blogAddress],
            params: { blogAddress },
        });

        if (res.code === 3005) {
            setIsDuplicateChecked(false);
            setBlogAddressMessage('사용할 수 없는 주소입니다.');
        } else {
            setIsDuplicateChecked(true);
            setBlogAddressMessage('사용할 수 있는 주소입니다.');
        }
    };

    const handleAddMber = (newMember: Member) => {
        const dupCnt = members.findIndex(
            (member) => member.memberId === newMember.memberId,
        );

        if (dupCnt < 0) {
            setMembers((prevState) => [...prevState, newMember]);
            setIsModalOpen(false);
        } else {
            setPopupTitle('이미 추가한 멤버입니다.');
            setPopupText('');
            setShowPopup(true);
        }
    };

    const handleDeleteMber = (selectedMember: Member) => {
        const newMembers = members.filter(
            (member) => member.memberId !== selectedMember.memberId,
        );
        setMembers(newMembers);
    };

    const validate = () => {
        if (!blogName) {
            setPopupTitle('블로그명을 입력해 주세요.');
            setPopupText('');
            setShowPopup(true);
            return;
        }

        if (!validateBlogName(blogName)) {
            setPopupTitle('블로그명을 올바르게 입력해 주세요.');
            setPopupText(
                '한글, 영문, 숫자, 특수문자(-,_)를 사용하여<br> 2자 이상, 20자 이하로 입력해 주세요.',
            );
            setShowPopup(true);
            return false;
        }

        if (!blogAddress) {
            setPopupTitle('블로그 주소를 입력해 주세요.');
            setPopupText('');
            setShowPopup(true);
            return;
        }

        if (!validateBlogAddress(blogAddress)) {
            setPopupTitle('블로그 주소를 올바르게 입력해 주세요.');
            setPopupText(
                '영문, 숫자, 하이픈(-)을 사용하여 4자 이상, 32자 이하로 입력해 주세요. 하이픈은 처음과 끝에 사용할 수 없으며 연속된 하이픈도 사용할 수 없습니다.',
            );
            setShowPopup(true);
            return false;
        }

        if (!isDuplicateChecked) {
            setPopupTitle('블로그 중복 확인을 해주세요.');
            setPopupText('');
            setShowPopup(true);
            return;
        }

        return true;
    };

    const handleSave = async () => {
        if (!validate) {
            return;
        }

        const body = {
            blogName,
            blogAddress,
            introduce,
            shareYn: 'Y',
            blogMembers: members.map((member) => ({
                memberId: member.memberId,
            })),
        };

        const res = await customFetch('/blog/setting', {
            queryKey: ['new-blog', blogAddress, blogName, introduce],
            method: 'POST',
            body,
        });

        if (res.isError) {
            setPopupTitle('블로그를 개설하지 못했습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
            return;
        }

        try {
            for (const member of members) {
                await emailjs.send(
                    process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID,
                    process.env.NEXT_PUBLIC_EMAIL_INVITATION_TEMPLATE_ID,
                    {
                        to_email: member.email,
                        to_name: member.nickname,
                        from_name: loginUserNickname,
                        blog_name: blogName,
                        message:
                            invitation && invitation.trim().length > 0
                                ? invitation
                                : '이 공간에 특별한 추억을 남겨보세요.',
                        link: `https://logus.com/${blogAddress}`, //TODO 블로그 도메인 수정
                    },
                    process.env.NEXT_PUBLIC_EMAIL_USER_ID,
                );
            }

            router.push(`/${blogAddress}`);
        } catch (error) {
            setPopupTitle('초대장 발송에 실패했습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
            return;
        }
    };

    return (
        <fieldset>
            <legend className="mb-8 text-lg font-bold">블로그 개설</legend>
            <div className="*:mb-10">
                <div>
                    <label htmlFor="blogName" className="font-semibold">
                        블로그명
                    </label>
                    <input
                        type="text"
                        id="blogName"
                        className="mt-4 w-full rounded border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                        value={blogName}
                        onChange={(e) => setBlogName(e.target.value)}
                        placeholder="한글, 영문, 숫자, 특수문자(-,_)를 사용하여 입력해 주세요.(최소 2자, 최대 20자)"
                    />
                </div>
                <div>
                    <label htmlFor="blogAddress" className="font-semibold">
                        블로그 주소
                    </label>
                    <div className="mt-4 flex">
                        <input
                            type="text"
                            id="blogAddress"
                            className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                            placeholder="한글, 영문, 숫자, 하이픈(-)을 사용하여 입력해 주세요.(최소 4자, 최대 32자)"
                            value={blogAddress}
                            onChange={handleBlogAddressChange}
                        />
                        <button
                            className={`rounded-r border-b border-r border-t px-2 py-1.5 ${isDuplicateChecked ? 'border-customLightBlue-200 bg-customLightBlue-200 text-white' : 'border-customLightBlue-100 text-customDarkBlue-200'}`}
                            onClick={handleDuplicateCheck}
                            disabled={isDuplicateChecked}
                        >
                            중복 확인
                        </button>
                    </div>
                    <div
                        className={`${
                            isDuplicateChecked
                                ? 'text-green-500'
                                : 'text-red-600'
                        } mt-1 flex gap-1`}
                    >
                        {isDuplicatedCheckedClicked && (
                            <>
                                {isDuplicateChecked ? <FcOk /> : <FcCancel />}
                                <span>{blogAddressMessage}</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    <label htmlFor="introduce" className="block font-semibold">
                        블로그 소개
                    </label>
                    <textarea
                        id="introduce"
                        className="mt-4 w-full resize-none rounded border border-solid border-customLightBlue-100 p-2 text-sm leading-6 outline-none"
                        rows={8}
                        value={introduce}
                        onChange={(e) => setIntroduce(e.target.value)}
                        placeholder="100자 이내로 입력해 주세요."
                    />
                </div>
                <div className="mt-4">
                    <div className="mb-4 flex items-baseline gap-2.5">
                        <label
                            htmlFor="introduce"
                            className="block font-semibold"
                        >
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
                                    onClick={() => handleDeleteMber(member)}
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
                <div className="-mt-2 text-right">
                    <button
                        className={`rounded px-4 py-2 text-md ${
                            !isDuplicateChecked
                                ? 'bg-neutral-300 text-neutral-700'
                                : 'bg-customBeige-100 text-customBrown-100'
                        }`}
                        disabled={!isDuplicateChecked}
                        onClick={handleSave}
                    >
                        개설
                    </button>
                </div>
            </div>

            <AddMemberPopup
                show={isModalOpen}
                onConfirm={handleAddMber}
                onCancel={() => setIsModalOpen(false)}
            />

            <AlertPopup
                show={showPopup}
                onConfirm={() => setShowPopup(false)}
                title={popupTitle}
                text={popupText}
            />
        </fieldset>
    );
}