'use client';

import Link from 'next/link';
import Image from 'next/image';
import Search from '@/components/search/Search';
import { useModal } from '@/hooks/useModal';
import LoginModal from '../@Modal/LoginModal';
import JoinModal from '../@Modal/JoinModal';
import NotifyModal from '../@Modal/NotifyModal';
import FindModal from '../@Modal/FindModal';

import { useState } from 'react';
import { FaRegBell } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { loginAuthStore } from '@/constants/loginAuthStore';

export default function MainHeader() {
    const { modalType, openModal, closeModal } = useModal();
    const [findType, setFindType] = useState<string | null>(null);
    //TODO zustand 수정
    const { userId, accessToken, clearAuthInfo } = loginAuthStore();
    const [viewOurLog, setViewOurLog] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleOurLog = () => {
        setViewOurLog(!viewOurLog);
    };

    const ourLogItems = [
        { id: 1, title: '[Hana] 나무의 하루' },
        { id: 2, title: '[leemanda] 만다의 안식처' },
        { id: 3, title: '[베짱이] 개발자의 이야기' },
        { id: 4, title: '[진] 먹거리 사냥꾼' },
        { id: 5, title: '[소희] 소희소희 블로그' },
        { id: 6, title: '[--] 나무의 하루' },
        { id: 7, title: '[--] 만다의 안식처' },
        { id: 8, title: '[--] 개발자의 이야기' },
        { id: 9, title: '[--] 먹거리 사냥꾼' },
        { id: 10, title: '[--] 소희소희 블로그' },
        { id: 11, title: '[--] 블라블라' },
        { id: 12, title: '[--] 블라블라2' },
        { id: 13, title: '[--] 블라블라3' },
    ];

    const totalPages = Math.ceil(ourLogItems.length / itemsPerPage);

    const itemsToDisplay = ourLogItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleOpenFindModal = (type: string) => {
        setFindType(type);
        openModal('find');
    };

    const handleLogout = () => {
        clearAuthInfo();
        console.log('로그아웃 되었습니다.');
    };

    return (
        <header>
            <div className="mx-auto flex h-[70px] max-w-screen-xl items-center justify-between p-5">
                {/* 메인 헤더 공통 구역 */}
                <Link href="/" className="">
                    <Image
                        src="/logo.png"
                        width={200}
                        height={200}
                        alt="Logo"
                    />
                </Link>
                {/* 로그인여부에 따라 달라지는 구역 */}
                <div className="relative flex items-center justify-between">
                    {userId && (
                        <>
                            <div className="mr-8 flex items-center justify-between gap-6">
                                <div className="cursor-pointer text-md text-customLightBlue-200 duration-200 hover:text-customDarkBlue-200">
                                    My-log
                                </div>
                                <div className="border- h-3 w-0.5 bg-customLightBlue-200"></div>
                                <div
                                    onClick={handleOurLog}
                                    className="cursor-pointer text-md text-customLightBlue-200 duration-200 hover:text-customDarkBlue-200"
                                >
                                    Our-log
                                </div>
                            </div>
                            <div className="mr-5 flex items-center justify-between gap-4">
                                <Search />
                                <FaRegBell
                                    onClick={() => openModal('notify')}
                                    className="cursor-pointer text-xl text-customLightBlue-200 duration-200 hover:text-customDarkBlue-200"
                                />
                                <FiSettings className="cursor-pointer text-xl text-customLightBlue-200 duration-200 hover:text-customDarkBlue-200" />
                            </div>
                        </>
                    )}

                    {viewOurLog && (
                        <div
                            className="absolute right-10 top-10 z-50 w-72 rounded-lg bg-white p-4 shadow-md"
                            style={{
                                position: 'fixed',
                                right: '26%',
                                top: '7%',
                            }}
                        >
                            <div className="flex items-center justify-between border-b border-solid border-gray-200 pb-3">
                                <div>Our-log 목록</div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                    >
                                        <IoChevronBackOutline
                                            className={`${currentPage === 1 ? 'text-gray-400' : 'text-black'}`}
                                        />
                                    </button>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                    >
                                        <IoChevronForwardOutline
                                            className={`${currentPage === totalPages ? 'text-gray-400' : 'text-black'}`}
                                        />
                                    </button>
                                </div>
                            </div>
                            <ul className="space-y-1">
                                {itemsToDisplay.map((item) => (
                                    <li
                                        key={item.id}
                                        className="border-b-2 p-2 text-sm text-gray-700 hover:cursor-pointer"
                                    >
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {!userId && (
                        <div className="mr-5">
                            <Search />
                        </div>
                    )}
                    <div>
                        <button
                            onClick={
                                userId ? handleLogout : () => openModal('login')
                            }
                            className="mr-2 rounded-lg bg-customDarkBlue-200 px-8 py-2 text-md tracking-wide text-white transition-colors duration-300 hover:bg-customDarkBlue-100"
                        >
                            {userId ? '로그아웃' : '로그인'}
                        </button>
                        <LoginModal
                            isOpen={modalType === 'login'}
                            closeModal={closeModal}
                            openJoinModal={() => openModal('join')}
                            openFindModal={(type: string) =>
                                handleOpenFindModal(type)
                            }
                        />
                        <FindModal
                            isOpen={modalType == 'find'}
                            closeModal={closeModal}
                            findType={findType}
                        />
                        <JoinModal
                            isOpen={modalType === 'join'}
                            closeModal={closeModal}
                        />
                        <NotifyModal
                            isOpen={modalType === 'notify'}
                            closeModal={closeModal}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
