import React, { ChangeEvent, useEffect, useState } from 'react';
import emailjs from 'emailjs-com';
import AlertPopup from '@/components/AlertPopup';
import { customFetch } from '@/utils/customFetch';
import { FcCancel, FcOk } from 'react-icons/fc';
import Image from 'next/image';
import { MdDelete, MdOutlineAddPhotoAlternate } from 'react-icons/md';
import imageCompression from 'browser-image-compression';
import { generateCode } from '@/utils/commonUtil';

export default function MemberInfoForm() {
    // TODO zustand로 변경
    const [orgData, setOrgData] = useState({
        email: '',
        nickname: '',
        imgUrl: '',
    });
    const [loginId, setLoginId] = useState('');

    const [newNickname, setNewNickname] = useState('');

    const [newEmail, setNewEmail] = useState('');
    const [emailCode, setEmailCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [userCode, setUserCode] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [emailMessage, setEmailMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [memberImg, setMemberImg] = useState<File>();
    const [imagePreview, setImagePreview] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    useEffect(() => {
        (async () => {
            const res = await customFetch('/user', { queryKey: ['user-info'] });

            if (res.isError) {
                setPopupTitle('회원정보를 불러오지 못했습니다.');
                setPopupText('잠시 후 다시 시도해 주세요.');
                setShowPopup(true);
                return;
            }

            setLoginId(res.data.loginId);
            setOrgData({
                email: res.data.email,
                nickname: res.data.nickname,
                imgUrl: res.data.imgUrl,
            });
            setNewNickname(res.data.nickname);
            setNewEmail(res.data.email);
            setImagePreview(res.data.imgUrl);
        })();
    }, []);

    const handleSetEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setIsCodeSent(false);
        setIsEmailVerified(false);
        setEmailMessage('');
        setUserCode('');
        setNewEmail(e.target.value);
    };
    const sendVerificationCode = async () => {
        const code = generateCode();
        setEmailCode(code);

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAIL_CODE_TEMPLATE_ID!,
                {
                    to_email: newEmail,
                    to_name: newNickname,
                    message: code,
                },
                process.env.NEXT_PUBLIC_EMAIL_USER_ID,
            );
            setIsCodeSent(true);
        } catch (error) {
            setPopupTitle('인증번호 전송에 실패했습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
            return;
        }
    };

    const handleEmailChange = async () => {
        if (newEmail === orgData.email) {
            setPopupTitle('변경사항이 없습니다.');
            setPopupText('');
            setShowPopup(true);
            return;
        }

        if (!newEmail || newEmail.trim().length <= 0) {
            setPopupTitle('이메일 주소를 입력해 주세요.');
            setPopupText('');
            setShowPopup(true);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            setPopupTitle('유효하지 않은 이메일형식입니다.');
            setPopupText('이메일 주소를 다시 입력해 주세요.');
            setShowPopup(true);
            return;
        }

        await sendVerificationCode();
    };

    const handleVerifyCode = () => {
        if (emailCode === userCode) {
            setIsEmailVerified(true);
            setEmailMessage('인증되었습니다.');
        } else {
            setIsEmailVerified(false);
            setEmailMessage('인증번호가 일치하지 않습니다.');
        }
    };

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setIsUploading(true);
        const file = e.target.files?.[0];
        if (file) {
            const options = {
                maxSizeMB: 1,
                useWebWorker: true,
            };

            try {
                const compressedFile = await imageCompression(file, options);
                setMemberImg(compressedFile);
                setImagePreview(URL.createObjectURL(compressedFile));
            } catch (e) {
                setMemberImg(file);
                setImagePreview(URL.createObjectURL(file));
            }
        }
        setIsUploading(false);
        setIsDeleted(false);
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageDelete = () => {
        setMemberImg(null);
        setImagePreview(null);
        setIsDeleted(true);
    };

    const handleSaveInfo = async () => {
        if (
            orgData.email === newEmail &&
            orgData.nickname === newNickname &&
            orgData.imgUrl === imagePreview
        ) {
            setPopupTitle('변경사항이 없습니다.');
            setPopupText('');
            setShowPopup(true);
            return;
        }

        if (orgData.email !== newEmail && !isEmailVerified) {
            setPopupTitle('이메일 인증이 필요합니다.');
            setPopupText('인증 후 다시 시도해 주세요.');
            setShowPopup(true);
            return;
        }

        const formData = new FormData();
        if (memberImg) {
            formData.append('memberImg', memberImg);
        }

        if (
            (orgData.imgUrl && memberImg) ||
            (orgData.imgUrl && !memberImg && isDeleted)
        ) {
            formData.append('deleteImg', 'true');
        }

        const requestDto = { nickname: newNickname, email: newEmail };
        formData.append(
            'requestDto',
            new Blob([JSON.stringify(requestDto)], {
                type: 'application/json',
            }),
        );

        const res = await customFetch('/user', {
            queryKey: ['edit-user-info', newEmail, newNickname, loginId],
            method: 'PUT',
            body: formData,
        });

        if (res.isError) {
            setPopupTitle('회원정보 변경에 실패하였습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
            return;
        }

        setIsDeleted(false);
        setPopupTitle('회원정보를 변경하였습니다.');
        setPopupText('');
        setShowPopup(true);
    };

    return (
        <section className="mb-12">
            <div className="mb-10 flex gap-5">
                <label htmlFor="id" className="mt-1.5 w-24 font-semibold">
                    아이디
                </label>
                <input
                    type="text"
                    id="id"
                    className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                    disabled
                    value={loginId}
                />
            </div>
            <div className="mb-10 flex gap-5">
                <label htmlFor="nickname" className="mt-1.5 w-24 font-semibold">
                    닉네임
                </label>
                <input
                    type="text"
                    id="nickname"
                    className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                    placeholder="한글, 영문, 숫자, 특수문자(-,_)를 사용하여 입력해 주세요.(최소 1자, 최대 20자)"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                />
            </div>
            <div className="flex gap-5">
                <label htmlFor="email" className="mt-1.5 w-24 font-semibold">
                    이메일
                </label>
                <div className="flex flex-1 flex-col">
                    <div className="flex">
                        <input
                            type="email"
                            id="email"
                            className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                            placeholder="변경할 이메일 주소를 입력해 주세요."
                            value={newEmail}
                            onChange={handleSetEmail}
                        />
                        <button
                            className={`${isEmailVerified ? 'border-customLightBlue-200 bg-customLightBlue-200 text-white' : 'border-customLightBlue-100 text-customLightBlue-200'} rounded-r border-b border-r border-t px-2 py-1.5`}
                            onClick={handleEmailChange}
                            disabled={isEmailVerified}
                        >
                            인증 요청
                        </button>
                    </div>
                    {isCodeSent && (
                        <div className="mt-2 flex">
                            <input
                                type="text"
                                className="rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                                placeholder="인증번호를 입력해 주세요."
                                value={userCode}
                                onChange={(e) => setUserCode(e.target.value)}
                            />
                            <button
                                className={`${isEmailVerified ? 'border-customLightBlue-200 bg-customLightBlue-200 text-white' : 'border-customLightBlue-100 text-customLightBlue-200'} rounded-r border-b border-r border-t px-2 py-1.5`}
                                onClick={handleVerifyCode}
                                disabled={isEmailVerified}
                            >
                                인증
                            </button>
                        </div>
                    )}
                    <div
                        className={`${
                            isEmailVerified ? 'text-green-500' : 'text-red-600'
                        } mt-2 flex gap-1`}
                    >
                        {emailMessage && (
                            <>
                                {isEmailVerified ? <FcOk /> : <FcCancel />}
                                <span>{emailMessage}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-10 flex gap-5">
                <div className={`flex gap-1 ${imagePreview ? 'w-24' : 'w-20'}`}>
                    <div className="flex">
                        <label htmlFor="profileImg" className="font-semibold">
                            프로필 사진
                        </label>
                        {imagePreview && (
                            <MdDelete
                                className="popup-bounce cursor-pointer text-customBrown-100"
                                onClick={handleImageDelete}
                            />
                        )}
                    </div>
                </div>
                {isUploading ? (
                    <div className="ml-5 flex">
                        <div className="spinner-brown" />
                    </div>
                ) : imagePreview ? (
                    <div className="relative flex size-[12.4rem]">
                        <Image
                            src={imagePreview}
                            alt="미리보기"
                            className="rounded border object-cover"
                            fill
                            priority={true}
                        />
                    </div>
                ) : (
                    <>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                        <MdOutlineAddPhotoAlternate
                            className="size-[12.4rem] cursor-pointer text-customGray-100"
                            onClick={handleImageClick}
                        />
                    </>
                )}
            </div>
            <div className="mt-4 text-right">
                <button
                    className="rounded border border-solid border-customBeige-100 bg-customBeige-100 px-4 py-2 text-md text-customBrown-100"
                    onClick={handleSaveInfo}
                >
                    저장
                </button>
            </div>
            <AlertPopup
                show={showPopup}
                onConfirm={() => setShowPopup(false)}
                title={popupTitle}
                text={popupText}
            />
        </section>
    );
}