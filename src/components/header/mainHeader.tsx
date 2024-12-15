import Link from 'next/link';
import Search from '@/components/search/Search';
import { useModal } from '../../hooks/useModal';
import LoginModal from '../@Modal/LoginModal';
import JoinModal from '../@Modal/JoinModal';
import NotifyModal from '../@Modal/NotifyModal';
import FindModal from '../@Modal/FindModal';

import { useState } from 'react';
import { FaRegBell } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { IoChevronBackOutline } from "react-icons/io5";
import { IoChevronForwardOutline } from "react-icons/io5";
import { loginAuthStore } from '@/constants/loginAuthStore';

export default function MainHeader() {
    const { modalType, openModal, closeModal } = useModal();
    const [findType, setFindType] = useState<string | null>(null);
    const { userId, accessToken, clearAuthInfo } = loginAuthStore();
    const isLogined = false; //임시
    // const isLogined = !!accessToken;
    const [viewOurLog, setViewOurLog] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleOurLog = () => {
        setViewOurLog(!viewOurLog);
    };

    const ourLogItems = [
        { id : 1, title : '[Hana] 나무의 하루'},
        { id : 2, title : '[leemanda] 만다의 안식처'},
        { id : 3, title : '[베짱이] 개발자의 이야기'},
        { id : 4, title : '[진] 먹거리 사냥꾼'},
        { id : 5, title : '[소희] 소희소희 블로그'},
        { id : 6, title : '[--] 나무의 하루'},
        { id : 7, title : '[--] 만다의 안식처'},
        { id : 8, title : '[--] 개발자의 이야기'},
        { id : 9, title : '[--] 먹거리 사냥꾼'},
        { id : 10, title : '[--] 소희소희 블로그'},
        { id : 11, title : '[--] 블라블라'},
        { id : 12, title : '[--] 블라블라2'},
        { id : 13, title : '[--] 블라블라3'},
    ];

    const totalPages = Math.ceil(ourLogItems.length / itemsPerPage);

    const itemsToDisplay = ourLogItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
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

    const handleOpenFindModal = (type : string) => {
        setFindType(type);
        openModal('find');
    };

    const handleLogout = () => {
        clearAuthInfo();
        console.log("로그아웃 되었습니다.");
    };

    return (
        <header>
            <div className='max-w-screen-2xl mx-auto flex justify-between items-center p-5 h-min'>
                {/* 메인 헤더 공통 구역 */}
                <div className='flex items-center'>
                    <Link href='/main'>
                        <img src='/logo.png' width={200} alt='Logo' />
                    </Link>
                    <div className='ml-3 flex space-x-8'>
                        <Link href='/notice' className='text-md pt-2'>공지사항</Link>
                        <Link href='/qna' className='text-md pt-2'>QnA</Link>
                    </div>
                </div>
                {/* 로그인여부에 따라 달라지는 구역 */}
                <div className='flex justify-between items-center relative'>
                    {isLogined && (
                        <>
                            <div className='flex justify-between items-center gap-6 mr-8 '>
                                <div className='text-customLightBlue-200 text-md hover:text-customDarkBlue-200 cursor-pointer duration-200'>My-log</div>
                                <div className='w-0.5 h-3 bg-customLightBlue-200 border-'></div>
                                <div onClick={handleOurLog} className='text-customLightBlue-200 text-md hover:text-customDarkBlue-200 cursor-pointer duration-200'>Our-log</div>
                            </div>
                            <div className='flex justify-between items-center gap-4 mr-5'>
                                <Search/>
                                <FaRegBell onClick={() => openModal('notify')} className='text-xl text-customLightBlue-200 hover:text-customDarkBlue-200 cursor-pointer duration-200'/>
                                <FiSettings className='text-xl text-customLightBlue-200 hover:text-customDarkBlue-200 cursor-pointer duration-200'/>
                            </div>
                        </>
                    )}

                    {viewOurLog && (
                        <div
                            className='absolute top-10 right-10 bg-white shadow-md rounded-lg p-4 w-72 z-50'
                            style={{ position: 'fixed', right: '26%', top: '7%' }}
                        >
                            <div className='flex justify-between items-center pb-3 border-b border-solid border-gray-200'>
                                <div>Our-log 목록</div>
                                <div className='flex items-center gap-3'>
                                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                                        <IoChevronBackOutline className={`${currentPage === 1 ? 'text-gray-400' : 'text-black'}`} />
                                    </button>
                                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                        <IoChevronForwardOutline className={`${currentPage === totalPages ? 'text-gray-400' : 'text-black'}`} />
                                    </button>
                                </div>
                            </div>
                            <ul className='space-y-1'>
                                {itemsToDisplay.map((item) => (
                                    <li key={item.id} className='text-sm text-gray-700 hover:cursor-pointer border-b-2 p-2'>
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}  

                    
                    {!isLogined && (
                        <div className='mr-5'>
                            <Search />
                        </div>
                    )}
                    <div>
                        <button onClick={isLogined ? handleLogout : () => openModal('login')} className='text-md text-white tracking-wide bg-customDarkBlue-200 px-8 py-2 rounded-lg mr-2 hover:bg-customDarkBlue-100 transition-colors duration-300'>
                            {isLogined ? '로그아웃' : '로그인'}
                        </button>
                        <LoginModal isOpen={modalType === 'login'} closeModal={closeModal} openJoinModal={() => openModal('join')} openFindModal={(type: string) => handleOpenFindModal(type)}/>
                        <FindModal isOpen={modalType == 'find'} closeModal={closeModal} findType={findType}/>
                        <JoinModal isOpen={modalType === 'join'} closeModal={closeModal} />
                        <NotifyModal isOpen={modalType === 'notify'} closeModal={closeModal} />
                    </div>
                </div>
            </div>
        </header>
    );
}
