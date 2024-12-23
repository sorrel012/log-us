import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { customFetch } from '@/utils/customFetch';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
    isOpen: boolean;
    closeModal: () => void;
    openFindModal: (type: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
    isOpen,
    closeModal,
    openFindModal,
}) => {
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);
    const [modalContainer, setModalContainer] = useState<HTMLElement | null>(
        null,
    );

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [saveId, setSaveId] = useState(false);
    const { setAuthInfo } = useAuthStore();

    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const saveId = localStorage.getItem('saveId');
        if (saveId) {
            setId(saveId);
            setSaveId(true);
        }
        setIsClient(true);
        setModalContainer(document.getElementById('modal'));
    }, []);

    if (!isClient || !modalContainer || !isOpen) {
        return null;
    }

    const handleCloseModal = () => {
        const saveId = localStorage.getItem('saveId');
        if (!saveId) {
            setId('');
            setSaveId(false);
        }
        setPassword('');
        setError('');
        setShowError(false);

        closeModal();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const res = await customFetch('/login', {
            queryKey: ['login', id, password],
            method: 'POST',
            body: { loginId: id, password },
        });

        if (res.isError) {
            setError(res.error || '로그인에 실패했습니다.');
            setShowError(true);
            return;
        }

        setError('');
        setShowError(false);

        const memberInfo = res.data;
        setAuthInfo(
            memberInfo.memberId,
            memberInfo.nickname,
            memberInfo.imgUrl,
            memberInfo.blogAddress,
        );

        if (saveId) {
            localStorage.setItem('saveId', id);
        } else {
            localStorage.removeItem('saveId');
        }

        handleCloseModal();
    };

    const handleJoin = () => {
        closeModal();
        router.push('/join');
    };

    return createPortal(
        <div className="modal-backdrop" onClick={handleCloseModal}>
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
                    <button className="close-btn" onClick={handleCloseModal}>
                        <FaTimes />
                    </button>

                    <div className="w-8/12">
                        {/* 로그인 박스 */}
                        <div className="mb-14 rounded-lg border-2 border-solid border-gray-200 px-8 py-8">
                            <div className="my-3 flex justify-center">
                                <Image
                                    src="/logo.png"
                                    width={230}
                                    height={90}
                                    alt="Logo"
                                />
                            </div>

                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="아이디"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    className="mb-2 h-10 w-full rounded-md border border-customLightBlue-100 px-7 py-3 outline-none"
                                />
                                <input
                                    type="password"
                                    placeholder="비밀번호"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="mb-2 h-10 w-full rounded-md border border-customLightBlue-100 px-7 py-3 outline-none"
                                />
                                <div className="mt-3 flex items-center text-gray-500">
                                    <input
                                        type="checkbox"
                                        id="saveId"
                                        checked={saveId}
                                        onChange={() => setSaveId(!saveId)}
                                        className="border-1 mr-1.5 cursor-pointer appearance-none rounded-sm border-customLightBlue-100 checked:appearance-auto checked:bg-customLightBlue-200"
                                        style={{
                                            height: '1rem',
                                            width: '1rem',
                                        }}
                                    />
                                    <label
                                        htmlFor="saveId"
                                        className="mr-6 text-sm font-thin"
                                    >
                                        아이디 저장
                                    </label>
                                </div>

                                <div className="my-5 flex items-center justify-between text-customLightBlue-200">
                                    <div
                                        className="cursor-pointer text-sm"
                                        onClick={() => openFindModal('id')}
                                    >
                                        아이디 찾기
                                    </div>
                                    <div className="h-5 w-0.5 border bg-gray-200"></div>
                                    <div
                                        className="cursor-pointer text-sm"
                                        onClick={() => openFindModal('pw')}
                                    >
                                        비밀번호 찾기
                                    </div>
                                    <div className="h-5 w-0.5 border bg-gray-200"></div>
                                    <div
                                        className="cursor-pointer text-sm"
                                        onClick={handleJoin}
                                    >
                                        회원가입
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="inline-block w-full rounded-md bg-customDarkBlue-100 p-2 text-lg text-white"
                                    >
                                        로그인
                                    </button>
                                    {showError && (
                                        <div className="mt-4 text-red-500">
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>,
        modalContainer,
    );
};

export default LoginModal;
