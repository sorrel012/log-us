'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { customFetch } from '@/utils/customFetch';
import { Member } from '@/components/sidebar/UserProfile';
import { FcCancel, FcOk } from 'react-icons/fc';
import { generateCode, validatePassword } from '@/utils/commonUtil';
import emailjs from 'emailjs-com';
import { useRouter } from 'next/navigation';

interface FindModal {
    isOpen: boolean;
    closeModal: () => void;
    findType: string | null;
}

const FindModal: React.FC<FindModal> = ({ isOpen, closeModal, findType }) => {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loginId, setLoginId] = useState('');

    const [isIdExist, setIsIdExist] = useState(false);
    const [idResult, setIdResult] = useState('');

    const [pwdCode, setPwdCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [userCode, setUserCode] = useState('');
    const [pwdResult, setPwdResult] = useState('');

    const [newPwd, setNewPwd] = useState('');
    const [pwdCheck, setPwdCheck] = useState('');
    const [isSame, setIsSame] = useState(false);
    const [isUsablePwd, setIsUsablePwd] = useState(false);
    const [newPwdMessage, setNewPwdMessage] = useState('');
    const [checkPwdMessage, setCheckPwdMessage] = useState('');
    const [pwdChangeResult, setPwdChangeResult] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setName('');
            setEmail('');
            setLoginId('');
            setIsIdExist(false);
            setIdResult('');
            setPwdResult('');
            setUserCode('');
            setPwdCode('');
            setIsCodeSent(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (findType === 'id') {
            setActiveTab(1);
        } else if (findType === 'pw') {
            setActiveTab(2);
        } else {
            setActiveTab(1);
        }
    }, [findType]);

    if (!isOpen) {
        return null;
    }

    const handleTabClick = (tab: 1 | 2 | 3) => {
        setActiveTab(tab);
        setName('');
        setEmail('');
        setLoginId('');
        setIsIdExist(false);
        setIdResult('');
        setPwdResult('');
        setUserCode('');
        setPwdCode('');
        setIsCodeSent(false);
    };

    const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await customFetch<Member>('/user/email', {
            queryKey: ['email', email, name],
            params: { email },
        });

        if (activeTab === 1) {
            if (res.data?.email) {
                if (res.data?.nickname === name) {
                    setIdResult(res.data.loginId!);
                    setIsIdExist(true);
                } else {
                    setIdResult('아이디가 존재하지 않습니다.');
                    setIsIdExist(false);
                }
            } else {
                setIdResult('아이디가 존재하지 않습니다.');
                setIsIdExist(false);
            }
        } else if (activeTab === 2) {
            if (res.data?.email) {
                if (
                    res.data?.nickname === name &&
                    res.data?.loginId === loginId
                ) {
                    setPwdResult('');
                    const code = generateCode();
                    setPwdCode(code);

                    try {
                        await emailjs.send(
                            process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID!,
                            process.env.NEXT_PUBLIC_EMAIL_CODE_TEMPLATE_ID!,
                            {
                                to_email: email,
                                to_name: name,
                                message: code,
                            },
                            process.env.NEXT_PUBLIC_EMAIL_USER_ID,
                        );
                        setIsCodeSent(true);
                    } catch (error) {
                        setPwdResult('비밀번호 전송에 실패했습니다.');
                        return;
                    }
                } else {
                    setPwdResult('일치하는 회원이 존재하지 않습니다.');
                }
            } else {
                setPwdResult('일치하는 회원이 존재하지 않습니다.');
            }
        } else {
            const res = await customFetch('/user/pwd', {
                queryKey: ['pwd', newPwd],
                method: 'PUT',
                body: { loginId, email, newPassword: newPwd },
            });

            if (res.isError) {
                setPwdChangeResult('비밀번호를 변경하지 못했습니다.');
                return;
            }

            const query = new URLSearchParams({ login: 'true' });
            router.push(`/?${query.toString()}`);
        }
    };

    const confirmPwCode = () => {
        if (pwdCode === userCode) {
            setActiveTab(3);
        } else {
            setPwdResult('비밀번호가 일치하지 않습니다.');
        }
    };

    const handleNewPwdChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPwd(e.target.value);

        if (validatePassword(e.target.value)) {
            setIsUsablePwd(true);
            setNewPwdMessage('유효한 비밀번호입니다.');
        } else {
            setIsUsablePwd(false);
            setNewPwdMessage('유효하지 않은 비밀번호입니다.');
        }
    };

    const handleCheckPwdChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPwdCheck(e.target.value);

        if (newPwd === e.target.value) {
            setIsSame(true);
            setCheckPwdMessage('새 비밀번호와 일치합니다.');
        } else {
            setIsSame(false);
            setCheckPwdMessage('새 비밀번호와 일치하지 않습니다.');
        }
    };

    return (
        <div className="modal-backdrop" onClick={closeModal}>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                exit={{ y: -100, opacity: 0 }}
            >
                <div
                    className="modal-content font-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="close-btn" onClick={closeModal}>
                        <FaTimes />
                    </button>
                    <div className="my-3 flex justify-center">
                        <Image
                            src="/logo.png"
                            width={230}
                            height={200}
                            alt="Logo"
                        />
                    </div>

                    <div className="w-8/12">
                        <form onSubmit={sendEmail}>
                            <div>
                                <ul
                                    className="-mb-px flex flex-wrap justify-center text-center"
                                    role="tablist"
                                >
                                    <li className="w-2/4">
                                        <button
                                            className={`inline-block h-8 w-full rounded-t-lg py-2 text-sm leading-4 ${activeTab === 1 ? 'border-2 border-b-0' : 'border-b-2 bg-gray-200/70'}`}
                                            onClick={() => handleTabClick(1)}
                                            type="button"
                                            role="tab"
                                            aria-selected={activeTab === 1}
                                        >
                                            아이디 찾기
                                        </button>
                                    </li>
                                    {activeTab === 3 ? (
                                        <li className="w-2/4">
                                            <button
                                                className={`inline-block h-8 w-full rounded-t-lg py-2 text-sm leading-4 ${activeTab === 3 ? 'border-2 border-b-0' : 'border-b-2 bg-gray-200/70'}`}
                                                onClick={() =>
                                                    handleTabClick(3)
                                                }
                                                type="button"
                                                role="tab"
                                                aria-selected={activeTab === 3}
                                            >
                                                비밀번호 변경
                                            </button>
                                        </li>
                                    ) : (
                                        <li className="w-2/4">
                                            <button
                                                className={`inline-block h-8 w-full rounded-t-lg py-2 text-sm leading-4 ${activeTab === 2 ? 'border-2 border-b-0' : 'border-b-2 bg-gray-200/70'}`}
                                                onClick={() =>
                                                    handleTabClick(2)
                                                }
                                                type="button"
                                                role="tab"
                                                aria-selected={activeTab === 2}
                                            >
                                                비밀번호 찾기
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div
                                className="mb-16 rounded-b-lg border-2 border-t-0 border-solid border-gray-200"
                                role="tabpanel"
                            >
                                {(activeTab === 1 || activeTab === 2) && (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="이름"
                                            name="name"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            className="my-2 mt-10 h-10 w-10/12 rounded-md border p-3 px-7 text-sm"
                                        />
                                        <input
                                            type="text"
                                            placeholder="이메일"
                                            name="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="my-2 h-10 w-10/12 rounded-md border p-3 px-7 text-sm"
                                        />
                                    </>
                                )}
                                {activeTab === 2 && (
                                    <input
                                        type="text"
                                        name="id"
                                        placeholder="아이디"
                                        value={loginId}
                                        onChange={(e) =>
                                            setLoginId(e.target.value)
                                        }
                                        className="my-2 h-10 w-10/12 rounded-md border p-3 px-7 text-sm"
                                    />
                                )}
                                {activeTab === 3 && (
                                    <div className="pb-3 pt-5">
                                        <div>
                                            <div className="mx-auto w-full">
                                                <div>
                                                    <label
                                                        htmlFor="password"
                                                        className="inline-block w-10/12 text-left"
                                                    >
                                                        새 비밀번호
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="w-full text-center">
                                                <input
                                                    type="password"
                                                    id="newPwd"
                                                    className="my-2 h-10 w-10/12 rounded-md border p-3 px-3 text-sm"
                                                    placeholder="새 영문, 숫자, 특수문자 중 2가지를 혼합하여 입력,8-16자"
                                                    value={newPwd}
                                                    onChange={
                                                        handleNewPwdChange
                                                    }
                                                />
                                                <div
                                                    className={`${
                                                        isUsablePwd
                                                            ? 'text-green-500'
                                                            : 'text-red-600'
                                                    } mx-auto flex w-10/12 gap-1`}
                                                >
                                                    {newPwd &&
                                                        newPwdMessage && (
                                                            <>
                                                                {isUsablePwd ? (
                                                                    <FcOk />
                                                                ) : (
                                                                    <FcCancel />
                                                                )}
                                                                <span>
                                                                    {
                                                                        newPwdMessage
                                                                    }
                                                                </span>
                                                            </>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-7">
                                            <div className="mx-auto w-full">
                                                <div>
                                                    <label
                                                        htmlFor="checkPwd"
                                                        className="inline-block w-10/12 text-left"
                                                    >
                                                        비밀번호 확인
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="w-full text-center">
                                                <input
                                                    type="password"
                                                    id="checkPwd"
                                                    className="my-2 h-10 w-10/12 rounded-md border p-3 px-3 text-sm"
                                                    placeholder="비밀번호를 다시 한번 입력해 주세요."
                                                    value={pwdCheck}
                                                    onChange={
                                                        handleCheckPwdChange
                                                    }
                                                />
                                                <div
                                                    className={`${
                                                        isSame
                                                            ? 'text-green-500'
                                                            : 'text-red-600'
                                                    } mx-auto flex w-10/12 gap-1`}
                                                >
                                                    {pwdCheck &&
                                                        checkPwdMessage && (
                                                            <>
                                                                {isSame ? (
                                                                    <FcOk />
                                                                ) : (
                                                                    <FcCancel />
                                                                )}
                                                                <span>
                                                                    {
                                                                        checkPwdMessage
                                                                    }
                                                                </span>
                                                            </>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="my-3 mb-6 inline-block w-10/12 rounded-md bg-customDarkBlue-200 px-5 py-3 text-md text-white"
                                    disabled={
                                        (activeTab === 1 &&
                                            (name === '' || email === '')) ||
                                        (activeTab === 2 &&
                                            (name === '' ||
                                                email === '' ||
                                                loginId === '')) ||
                                        (activeTab === 3 &&
                                            (newPwd === '' ||
                                                pwdCheck === '' ||
                                                !isSame ||
                                                !isUsablePwd))
                                    }
                                >
                                    {activeTab === 1
                                        ? '아이디 찾기'
                                        : activeTab === 2
                                          ? '이메일로 비밀번호 코드 전송'
                                          : '변경하기'}
                                </button>
                                {activeTab === 1 &&
                                    idResult !== '' &&
                                    (isIdExist ? (
                                        <div className="mb-6">
                                            아이디는{' '}
                                            <em className="font-bold text-customLightBlue-200">
                                                {idResult}
                                            </em>{' '}
                                            입니다.
                                        </div>
                                    ) : (
                                        <div className="mb-6">
                                            아이디가 존재하지 않습니다.
                                        </div>
                                    ))}
                                {activeTab === 2 && isCodeSent && (
                                    <div className="mb-6 flex w-full items-center justify-center">
                                        <input
                                            type="text"
                                            placeholder="비밀번호 변경 코드"
                                            value={userCode}
                                            onChange={(e) =>
                                                setUserCode(e.target.value)
                                            }
                                            className="my-2 w-8/12 rounded-l-md border border-customLightBlue-100 px-7 py-1.5 text-sm outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={confirmPwCode}
                                            className="rounded-r-md border-y border-r border-solid border-customLightBlue-100 px-4 py-1.5 text-sm text-customDarkBlue-200 outline-none"
                                        >
                                            인증
                                        </button>
                                    </div>
                                )}
                                {activeTab === 2 && pwdResult !== '' && (
                                    <div className="mb-6 text-red-600">
                                        {pwdResult}
                                    </div>
                                )}
                                {activeTab === 3 && pwdChangeResult !== '' && (
                                    <div className="mb-6 text-red-600">
                                        {pwdChangeResult}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FindModal;