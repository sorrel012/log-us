'use client';

import React, { useState } from 'react';
import { FcCancel, FcOk } from 'react-icons/fc';
import { customFetch } from '@/utils/customFetch';
import { Member } from '@/components/sidebar/UserProfile';
import AlertPopup from '@/components/AlertPopup';
import { useRouter } from 'next/navigation';
import emailjs from 'emailjs-com';
import MemberInvitation from '@/components/blog/setting/MemberInvitation';
import { useAuthStore } from '@/store/useAuthStore';

export default function NewBlogPage() {
    const router = useRouter();
    const { loginUser, loginUserNickname } = useAuthStore();

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

    const [isLoading, setIsLoading] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    const validateBlogName = (name: string) => {
        const regex = /^[a-zA-Z가-힣0-9-_\s]+$/;
        return name.length >= 2 && name.length <= 20 && regex.test(name);
    };

    const handleBlogAddressChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
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

        const res = await customFetch<any>('/blog/address-dupl', {
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

    const handleAddMember = (newMember: Member) => {
        setMembers((prevState) => [...prevState, newMember]);
    };

    const handleDeleteMember = (selectedMember: Member) => {
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

        setIsLoading(true);

        const newMember: Member = {
            memberId: loginUser,
            nickname: loginUserNickname,
            email: '',
            myLogAddress: '',
            blogAuth: 'OWNER',
        };

        const body = {
            blogName,
            blogAddress,
            introduce,
            shareYn: 'Y',
            blogMembers: [
                ...members.map((member) => ({
                    memberId: member.memberId,
                })),
                { memberId: loginUser },
            ],
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
                if (member.memberId !== loginUser) {
                    await emailjs.send(
                        process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID!,
                        process.env.NEXT_PUBLIC_EMAIL_INVITATION_TEMPLATE_ID!,
                        {
                            to_email: member.email,
                            to_name: member.nickname,
                            from_name: loginUserNickname,
                            blog_name: blogName,
                            message:
                                invitation && invitation.trim().length > 0
                                    ? invitation
                                    : '이 공간에 특별한 추억을 남겨보세요.',
                            link: `https://logus-blog.vercel.app/${blogAddress}`,
                        },
                        process.env.NEXT_PUBLIC_EMAIL_USER_ID,
                    );
                }
            }

            router.push(`/${blogAddress}`);
        } catch (error) {
            setPopupTitle('초대장 발송에 실패했습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
            return;
        }

        setIsLoading(false);
    };

    const handleInvitation = (invitation: string) => {
        setInvitation(invitation);
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
                <MemberInvitation
                    members={members}
                    blogAddress={blogAddress}
                    blogName={blogName}
                    loginUserNickname={loginUserNickname}
                    onAdd={handleAddMember}
                    onDelete={handleDeleteMember}
                    onChangeInvitation={handleInvitation}
                    type="NEW"
                />
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

            {isLoading && (
                <div className="flex h-24 items-center justify-center">
                    <div className="spinner-brown absolute top-1/2" />
                </div>
            )}

            <AlertPopup
                show={showPopup}
                onConfirm={() => setShowPopup(false)}
                title={popupTitle}
                text={popupText}
            />
        </fieldset>
    );
}