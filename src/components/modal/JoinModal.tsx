import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { motion } from 'framer-motion';

import Link from 'next/link';

interface JoinModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

const JoinModal: React.FC<JoinModalProps> = ({ isOpen, closeModal }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop" onClick={closeModal}>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                exit={{ y: -100, opacity: 0 }}
            >
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="close-btn" onClick={closeModal}>
                        <FaTimes />
                    </button>
                    {/* 로고 */}
                    <div className="my-5 flex justify-center">
                        <img src="/logo.png" width={230} alt="Logo" />
                    </div>

                    {/* 이메일 회원가입 */}
                    <Link
                        href="/join"
                        className="flex w-4/6 items-start justify-center rounded-md border border-solid border-gray-400 py-4 text-gray-500"
                    >
                        <MdOutlineEmail className="mt-0.5 text-md" />
                        <div className="font-default ml-2 pt-0.5">
                            이메일로 가입하기
                        </div>
                    </Link>

                    <div className="my-8 flex w-4/6 items-center">
                        <div className="mr-4 h-0 w-1/3 border-t-2 border-solid border-gray-300"></div>
                        <div className="font-default w-1/2 text-xs text-gray-400">
                            다른 방법으로 회원가입
                        </div>
                        <div className="ml-4 h-0 w-1/3 border-t-2 border-solid border-gray-300"></div>
                    </div>

                    {/* 소셜 로그인 */}
                    <div className="mb-7 flex gap-20">
                        <img
                            src="/kakao_login_round.png"
                            width={60}
                            className="cursor-pointer"
                        />
                        <img
                            src="/naver_login_round.png"
                            width={60}
                            className="cursor-pointer"
                        />
                        <img
                            src="/google_login_round.png"
                            width={60}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default JoinModal;