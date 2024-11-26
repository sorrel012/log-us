import { useState } from 'react';
import emailjs from 'emailjs-com';
import AlertPopup from '@/components/AlertPopup';
import { FcCancel, FcOk } from 'react-icons/fc';

export default function MemberInfoForm() {
    // TODO zustand로 변경
    const loginUserNickname = 'hana';

    const [newEmail, setNewEmail] = useState('');
    const [emailCode, setEmailCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [userCode, setUserCode] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [emailMessage, setEmailMessage] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    const handleSetEmail = (e) => {
        setIsCodeSent(false);
        setIsEmailVerified(false);
        setEmailMessage('');
        setUserCode('');
        setNewEmail(e.target.value);
    };

    const generateCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const sendVerificationCode = async () => {
        const code = generateCode();
        setEmailCode(code);

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID,
                {
                    to_email: newEmail,
                    to_name: loginUserNickname,
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
        if (!newEmail || newEmail.trim().length <= 0) {
            setPopupTitle('이메일 주소를 입력해주세요.');
            setPopupText('');
            setShowPopup(true);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            setPopupTitle('유효하지 않은 이메일형식입니다.');
            setPopupText('이메일 주소를 다시 입력해주세요.');
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

    return (
        <section>
            <div className="flex items-center gap-8">
                <div className="flex flex-col gap-10">
                    <label htmlFor="id" className="font-semibold">
                        아이디
                    </label>
                    <label htmlFor="nickname" className="font-semibold">
                        닉네임
                    </label>
                    <label htmlFor="email" className="font-semibold">
                        이메일
                    </label>
                </div>
                <div className="flex flex-1 flex-col gap-6">
                    <input
                        type="text"
                        id="id"
                        className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                        placeholder="영소문자, 숫자, 특수문자(-,_)를 사용하여 입력해주세요.(최소 5자, 최대 20자)"
                    />
                    <input
                        type="text"
                        id="nickname"
                        className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                        placeholder="한글, 영문, 숫자, 특수문자(-,_)를 사용하여 입력해주세요.(최소 1자, 최대 20자)"
                    />
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
                </div>
            </div>
            {isCodeSent && (
                <div className="ml-[4.6rem] mt-2 flex">
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
                } ml-[4.6rem] mt-2 flex gap-1`}
            >
                {emailMessage && (
                    <>
                        {isEmailVerified ? <FcOk /> : <FcCancel />}
                        <span>{emailMessage}</span>
                    </>
                )}
            </div>
            <div className="mt-8 text-right">
                <button className="rounded bg-customBeige-100 px-4 py-2 text-md text-customBrown-100">
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
