import Search from '@/components/search/Search';
import { useModal } from '@/hooks/useModal';
import LoginModal from '../@Modal/LoginModal';
import JoinModal from '../@Modal/JoinModal';

import { FaRegBell } from 'react-icons/fa';
import { FaCircleUser } from 'react-icons/fa6';
import { loginAuthStore } from '@/constants/loginAuthStore';

export default function BlogHeader() {
    const { modalType, openModal, closeModal } = useModal();
    const { userId, accessToken, clearAuthInfo } = loginAuthStore();
    const isLogined = !!accessToken;

    const handleLogout = () => {
        clearAuthInfo();
        console.log('로그아웃 되었습니다.');
    };

    return (
        <header className="p-2 shadow-md">
            <div className="flex items-center justify-between">
                {/* 블로그 헤더 공통 구역 */}
                <div className="flex items-center">
                    <img
                        src="/logo_icon.png"
                        className="ml-3"
                        width={30}
                        alt="Logo"
                    />
                    <p className="text-xl"> 나무의 하루 </p>
                </div>

                {/* 로그인여부에 따라 달라지는 구역 */}
                <div className="flex items-center gap-6">
                    {isLogined && (
                        <>
                            <Search />
                            <FaRegBell className="cursor-pointer text-2xl text-customLightBlue-200 hover:text-customDarkBlue-200" />
                            <FaCircleUser className="mr-4 cursor-pointer text-2xl text-customLightBlue-200 hover:text-customDarkBlue-200" />
                        </>
                    )}

                    {!isLogined && (
                        <>
                            <Search />
                            <button
                                onClick={
                                    isLogined
                                        ? handleLogout
                                        : () => openModal('login')
                                }
                                className="mr-4 rounded-lg bg-customDarkBlue-200 px-6 py-2 text-md tracking-wide text-white transition-colors duration-300 hover:bg-customDarkBlue-100"
                            >
                                로그인
                            </button>
                            <LoginModal
                                isOpen={modalType === 'login'}
                                closeModal={closeModal}
                                openJoinModal={() => openModal('join')}
                            />
                            <JoinModal
                                isOpen={modalType === 'join'}
                                closeModal={closeModal}
                            />
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
