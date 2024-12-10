import Search from '@/components/search/Search';
import { useModal } from '../../hooks/useModal';
import LoginModal from '../@Modal/LoginModal';
import JoinModal from '../@Modal/JoinModal';

import { FaRegBell } from 'react-icons/fa';
import { useState } from 'react';
import { FaCircleUser } from 'react-icons/fa6';
import { loginAuthStore } from '@/constants/loginAuthStore';

export default function BlogHeader() {
    const { modalType, openModal, closeModal } = useModal();
    const { userId, accessToken, clearAuthInfo } = loginAuthStore();
    const isLogined = !!accessToken;

    const handleLogout = () => {
        clearAuthInfo();
        console.log("로그아웃 되었습니다.");
    };

    return (
        <header className='shadow-md p-2'>
            <div className='flex justify-between items-center'>
                {/* 블로그 헤더 공통 구역 */}
                <div className='flex items-center'>
                    <img src='/logo_icon.png' className='ml-3' width={30} alt='Logo'/>
                    <p className='text-xl'> 나무의 하루 </p>
                </div>

                {/* 로그인여부에 따라 달라지는 구역 */}
                <div className='flex items-center gap-6'>
                    {isLogined && (
                        <>
                            <Search />
                            <FaRegBell className='text-2xl text-customLightBlue-200 hover:text-customDarkBlue-200 cursor-pointer'/>
                            <FaCircleUser className='text-2xl text-customLightBlue-200 hover:text-customDarkBlue-200 cursor-pointer mr-4'/>
                        </>
                    )}

                    {!isLogined && (
                        <>
                            <Search />
                            <button onClick={isLogined? handleLogout : () => openModal('login')} className='text-md text-white tracking-wide bg-customDarkBlue-200 px-6 py-2 rounded-lg mr-4 hover:bg-customDarkBlue-100 transition-colors duration-300'>
                                로그인
                            </button>
                            <LoginModal isOpen={modalType === 'login'} closeModal={closeModal} openJoinModal={() => openModal('join')}/>
                            <JoinModal isOpen={modalType === 'join'} closeModal={closeModal} />
                        </>
                    )}
                   
                    
                </div>
            </div>
        </header>
    );
}
