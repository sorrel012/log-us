'use client';

import React, { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { MdDelete, MdOutlineAddPhotoAlternate } from 'react-icons/md';
import emailjs from 'emailjs-com';
import { customFetch } from '@/utils/customFetch';
import { FcCancel, FcOk } from 'react-icons/fc';
import AlertPopup from '@/components/AlertPopup';
import {
    generateCode,
    validateBlogAddress,
    validatePassword,
} from '@/utils/commonUtil';
import imageCompression from 'browser-image-compression';
import { useRouter } from 'next/navigation';

export default function Join() {
    const router = useRouter();

    const [loginId, setLoginId] = useState('');
    const [nickname, setNickname] = useState('');
    const [memberImg, setMemberImg] = useState<File>();
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [checkPwd, setCheckPwd] = useState('');
    const [isUsablePwd, setIsUsablePwd] = useState(false);
    const [isSame, setIsSame] = useState(false);
    const [pwdMessage, setPwdMessage] = useState('');
    const [checkPwdMessage, setCheckPwdMessage] = useState('');

    const [emailCode, setEmailCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [userCode, setUserCode] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [emailMessage, setEmailMessage] = useState('');

    const [isUploading, setIsUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const [blogName, setBlogName] = useState('');
    const [blogAddress, setBlogAddress] = useState('');
    const [introduce, setIntroduce] = useState('');
    const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
    const [isDuplicatedCheckedClicked, setIsDuplicatedCheckedClicked] =
        useState(false);
    const [blogAddressMessage, setBlogAddressMessage] = useState(
        '사용할 수 없는 블로그 주소입니다.',
    );

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    const handleSetEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setIsCodeSent(false);
        setIsEmailVerified(false);
        setEmailMessage('');
        setUserCode('');
        setEmail(e.target.value);
    };

    const sendVerificationCode = async () => {
        const code = generateCode();
        setEmailCode(code);

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAIL_CODE_TEMPLATE_ID!,
                {
                    to_email: email,
                    to_name: nickname,
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
        if (!email || email.trim().length <= 0) {
            setPopupTitle('이메일 주소를 입력해 주세요.');
            setPopupText('');
            setShowPopup(true);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
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
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageDelete = () => {
        setMemberImg(null);
        setImagePreview(null);
    };

    const handlePwdChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);

        if (validatePassword(e.target.value)) {
            setIsUsablePwd(true);
            setPwdMessage('유효한 비밀번호입니다.');
        } else {
            setIsUsablePwd(false);
            setPwdMessage('유효하지 않은 비밀번호입니다.');
        }
    };

    const handleCheckPwdChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckPwd(e.target.value);

        if (password === e.target.value) {
            setIsSame(true);
            setCheckPwdMessage('새 비밀번호와 일치합니다.');
        } else {
            setIsSame(false);
            setCheckPwdMessage('새 비밀번호와 일치하지 않습니다.');
        }
    };

    const handleBlogAddressChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setIsDuplicateChecked(false);
        setBlogAddress(e.target.value);
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

    const validateInfo = () => {
        if (!isEmailVerified) {
            setPopupTitle('이메일 인증이 필요합니다.');
            setPopupText('인증 후 다시 시도해 주세요.');
            setShowPopup(true);
            return;
        }

        const idRegex = /^[a-z0-9-_]{5,20}$/;
        if (!idRegex.test(loginId)) {
            setPopupTitle('유효하지 않은 아이디입니다.');
            setPopupText('아이디를 다시 입력해 주세요.');
            setShowPopup(true);
            return;
        }

        if (!isSame || !isUsablePwd) {
            setPopupTitle('유효하지 않은 비밀번호입니다.');
            setPopupText('비밀번호를 다시 입력해 주세요.');
            setShowPopup(true);
            return;
        }

        const blogNameRegex = /^[가-힣a-zA-Z0-9-_\s]{2,20}$/;
        if (!blogNameRegex.test(blogName)) {
            setPopupTitle('유효하지 않은 블로그명입니다.');
            setPopupText('블로그명을 다시 입력해 주세요.');
            setShowPopup(true);
            return;
        }

        if (!isDuplicateChecked) {
            setPopupTitle('사용할 수 없는 블로그 주소입니다.');
            setPopupText('블로그 주소를 다시 입력해 주세요.');
            setShowPopup(true);
            return;
        }

        return true;
    };

    const handleSaveInfo = async () => {
        if (!validateInfo()) {
            return;
        }

        const formData = new FormData();
        if (memberImg) {
            formData.append('memberImg', memberImg);
        }

        const blogRequestDto = {
            blogName,
            blogAddress,
            introduce,
            shareYn: 'N',
        };

        const requestDto = {
            loginId,
            nickname,
            password,
            email,
            socialType: 'EMAIL',
            blogRequestDto,
        };

        formData.append(
            'requestDto',
            new Blob([JSON.stringify(requestDto)], {
                type: 'application/json',
            }),
        );

        const res = await customFetch('/register', {
            queryKey: [
                'join',
                loginId,
                nickname,
                password,
                email,
                blogName,
                blogAddress,
                introduce,
            ],
            method: 'POST',
            body: formData,
        });

        if (res.isError) {
            setPopupTitle('회원가입에 실패하였습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
            return;
        }

        const query = new URLSearchParams({ login: 'true' });
        router.push(`/?${query.toString()}`);
    };

    return (
        <section>
            <>
                <div className="mb-6 border-b-2 border-solid border-customLightBlue-100/20 pb-3 text-lg font-semibold">
                    내 정보 입력
                </div>
                <div className="mb-10 flex gap-5">
                    <label htmlFor="id" className="mt-1.5 w-24 font-semibold">
                        아이디
                    </label>
                    <input
                        type="text"
                        id="id"
                        className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                        placeholder="영소문자, 숫자, 특수기호(-, _)를 사용하여 입력해 주세요.(5-20자)"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                    />
                </div>
                <div className="mb-10 flex gap-5">
                    <label
                        htmlFor="nickname"
                        className="mt-1.5 w-24 font-semibold"
                    >
                        닉네임
                    </label>
                    <input
                        type="text"
                        id="nickname"
                        className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                        placeholder="한글, 영문, 숫자, 특수문자(-,_)를 사용하여 입력해 주세요.(1-20자)"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>
                <div className="flex gap-5">
                    <label
                        htmlFor="email"
                        className="mt-1.5 w-24 font-semibold"
                    >
                        이메일
                    </label>
                    <div className="flex flex-1 flex-col">
                        <div className="flex">
                            <input
                                type="email"
                                id="email"
                                className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                                placeholder="이메일 주소를 입력해 주세요."
                                value={email}
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
                                    onChange={(e) =>
                                        setUserCode(e.target.value)
                                    }
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
                                isEmailVerified
                                    ? 'text-green-500'
                                    : 'text-red-600'
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
                    <div
                        className={`flex gap-1 ${imagePreview ? 'w-24' : 'w-20'}`}
                    >
                        <div className="flex">
                            <label
                                htmlFor="profileImg"
                                className="font-semibold"
                            >
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
                                className="size-[12.4rem] cursor-pointer text-customLightBlue-100"
                                onClick={handleImageClick}
                            />
                        </>
                    )}
                </div>
                <div className="mb-10 mt-10 flex gap-5">
                    <label htmlFor="pwd" className="mt-1.5 w-24 font-semibold">
                        비밀번호
                    </label>
                    <div className="flex flex-1 flex-col">
                        <input
                            type="password"
                            id="pwd"
                            className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                            placeholder="영문, 숫자, 특수문자 중 2가지를 혼합하여 입력해 주세요.(8-16자)"
                            value={password}
                            onChange={handlePwdChange}
                        />
                        <div
                            className={`${
                                isUsablePwd ? 'text-green-500' : 'text-red-600'
                            } mt-2 flex gap-1`}
                        >
                            {password && pwdMessage && (
                                <>
                                    {isUsablePwd ? <FcOk /> : <FcCancel />}
                                    <span>{pwdMessage}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mb-10 flex gap-5">
                    <label htmlFor="pwd" className="mt-1.5 w-24 font-semibold">
                        비밀번호 확인
                    </label>
                    <div className="flex flex-1 flex-col">
                        <input
                            type="password"
                            id="checkPwd"
                            className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                            placeholder="비밀번호를 다시 한번 입력해 주세요."
                            value={checkPwd}
                            onChange={handleCheckPwdChange}
                        />
                        <div
                            className={`${
                                isSame ? 'text-green-500' : 'text-red-600'
                            } mt-2 flex gap-1`}
                        >
                            {checkPwd && checkPwdMessage && (
                                <>
                                    {isSame ? <FcOk /> : <FcCancel />}
                                    <span>{checkPwdMessage}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </>
            <>
                <div className="mb-6 border-b-2 border-solid border-customLightBlue-100/20 pb-3 text-lg font-semibold">
                    블로그 정보 입력
                </div>
                <div className="mb-8 flex gap-5">
                    <label
                        htmlFor="blogName"
                        className="mt-1.5 w-24 font-semibold"
                    >
                        블로그명
                    </label>
                    <input
                        type="text"
                        id="blogName"
                        className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                        value={blogName}
                        onChange={(e) => setBlogName(e.target.value)}
                        placeholder="한글, 영문, 숫자, 특수문자(-,_)를 사용하여 입력해 주세요.(2-20자)"
                    />
                </div>
                <div className="mb-10 flex items-baseline gap-5">
                    <label
                        htmlFor="blogAddress"
                        className="mt-1.5 w-24 font-semibold"
                    >
                        블로그 주소
                    </label>
                    <div className="flex flex-1 flex-col">
                        <div className="flex">
                            <input
                                type="text"
                                id="blogAddress"
                                className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                                placeholder="한글, 영문, 숫자, 하이픈(-)을 사용하여 입력해 주세요.(4-32자)"
                                value={blogAddress}
                                onChange={handleBlogAddressChange}
                            />
                            <button
                                className={`rounded-r border-b border-r border-t px-1.5 py-1.5 text-md ${isDuplicateChecked ? 'border-customLightBlue-200 bg-customLightBlue-200 text-white' : 'border-customLightBlue-100 text-customDarkBlue-200'}`}
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
                                    {isDuplicateChecked ? (
                                        <FcOk />
                                    ) : (
                                        <FcCancel />
                                    )}
                                    <span>{blogAddressMessage}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mb-10 flex flex-col gap-5">
                    <label
                        htmlFor="introduce"
                        className="mt-1.5 w-24 font-semibold"
                    >
                        블로그 소개
                    </label>
                    <textarea
                        id="introduce"
                        className="w-full resize-none rounded border border-solid border-customLightBlue-100 p-2 text-sm leading-6 outline-none"
                        rows={8}
                        value={introduce}
                        onChange={(e) => setIntroduce(e.target.value)}
                        placeholder="100자 이내로 입력해 주세요."
                    />
                </div>
            </>
            <button
                className="mt-5 h-12 w-full rounded-md bg-customDarkBlue-200 text-lg text-white transition-colors duration-300"
                disabled={
                    !isEmailVerified ||
                    !isSame ||
                    !isUsablePwd ||
                    !isDuplicateChecked
                }
                onClick={handleSaveInfo}
            >
                회원가입
            </button>
            <AlertPopup
                show={showPopup}
                onConfirm={() => setShowPopup(false)}
                title={popupTitle}
                text={popupText}
            />
        </section>
    );
}