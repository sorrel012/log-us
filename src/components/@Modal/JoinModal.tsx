import React from 'react';
import { FaTimes } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

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
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={closeModal}>
                    <FaTimes />
                </button>
                {/* 로고 */}
                <div className="flex justify-center my-3">
                    <img src="/logo.png" width={350} alt="Logo" />
                </div>

                {/* 이메일 회원가입 */}
                <Link href="/join" className="flex justify-center items-start rounded-md w-4/6 py-4 border-solid border-2 border-gray-400 text-gray-500"> 
                    <MdOutlineEmail className="text-lg"/>
                    <div className="pt-0.5 font-default font-semibold ml-2">이메일로 가입하기</div>
                </Link>

                <div className="flex items-center w-4/6 my-8">
                    <div className="h-0 w-3/12 border-t-2 mr-4 border-gray-300 border-solid"></div>
                    <div className="text-gray-400 font-default ">다른 방법으로 회원가입</div>
                    <div className="h-0 w-3/12 border-t-2 ml-4 border-gray-300 border-solid"></div>
                </div>

                {/* 소셜 로그인 */}
                <div className="flex gap-20 mb-7">
                    <img src='/google_login_round.png' width={60}/>
                    <img src='/naver_login_round.png' width={60} />
                    <img src='/google_login_round.png' width={60}/>
                </div>


            </div>
        </div>
    )
}

export default JoinModal