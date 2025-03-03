'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useModal } from '@/hooks/useModal';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { customFetch } from '@/utils/customFetch';
import AlertPopup from '@/components/AlertPopup';
import { useRouter, useSearchParams } from 'next/navigation';
import { Blog } from '@/components/UserGrid';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import Search from '@/components/search/Search';
import { FiSettings } from 'react-icons/fi';
import LoginModal from '@/components/modal/LoginModal';
import FindModal from '@/components/modal/FindModal';
import { useStore } from '@/store/useStore';
import { usePathname } from 'next/dist/client/components/navigation';

export default function MainHeader() {
    const pathname = usePathname();
    const isJoin = pathname.includes('join');
    const isSetting = pathname.includes('setting');
    const searchParams = useSearchParams();
    const login = searchParams.get('login');

    useEffect(() => {
        if (login === 'true') {
            openModal('login');
        }
    }, [login]);

    const loginBlogAddress = useStore(useAuthStore, (state) => {
        return state.loginBlogAddress;
    });
    const loginUser = useStore(useAuthStore, (state) => {
        return state.loginUser;
    });
    const { clearAuthInfo } = useAuthStore();

    const router = useRouter();
    const logRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLButtonElement | null>(null);

    const { modalType, openModal, closeModal } = useModal();
    const [findType, setFindType] = useState<string | null>(null);

    const [viewOurLog, setViewOurLog] = useState(false);
    const [ourLogItems, setOurLogItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    const totalPages = Math.ceil(ourLogItems.length / itemsPerPage);

    const itemsToDisplay = useMemo(() => {
        return ourLogItems.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage,
        );
    }, [currentPage, ourLogItems, itemsPerPage]);

    const handleOurLog = async () => {
        if (!viewOurLog && ourLogItems.length === 0) {
            if (ourLogItems.length === 0) {
                const res = await customFetch<[]>('/blog/our-log', {
                    queryKey: ['our-log'],
                });

                if (res.isError) {
                    setPopupTitle('OurLog 목록을 조회하지 못했습니다.');
                    setPopupText('잠시 후 다시 시도해 주세요.');
                    setShowPopup(true);
                    return;
                }
                const blogsData = Array.isArray(res.data) ? res.data : [];
                setOurLogItems(
                    blogsData.filter((blog: Blog) => blog.shareYn === 'Y'),
                );
            }
        }
        setViewOurLog((prevState) => !prevState);
    };

    const handleOpenFindModal = (type: string) => {
        setFindType(type);
        openModal('find');
    };

    const handleLogout = async () => {
        clearAuthInfo();
        window.localStorage.removeItem('auth');
        await customFetch<any>('/logout', {
            queryKey: ['logout'],
            method: 'POST',
        });
    };

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

    return (
        <Suspense>
            <header>
                <div className="mx-auto flex h-[70px] items-center justify-between p-5">
                    {/* 메인 헤더 공통 구역 */}
                    <Link href="/" className="">
                        <Image
                            src="/logo.png"
                            width={150}
                            height={150}
                            alt="Logo"
                        />
                    </Link>
                    {/* 로그인여부에 따라 달라지는 구역 */}
                    <div className="relative flex items-center justify-between">
                        {loginUser && !isSetting && (
                            <>
                                <div className="mr-8 flex items-center justify-between gap-6">
                                    <Link
                                        href={`/${loginBlogAddress}`}
                                        className="cursor-pointer text-md text-customLightBlue-200 duration-200 hover:text-customDarkBlue-200"
                                    >
                                        My-log
                                    </Link>
                                    <div className="h-3 w-0.5 border bg-customLightBlue-200"></div>
                                    <div>
                                        <button
                                            ref={menuRef}
                                            onClick={handleOurLog}
                                            className="relative mr-2 cursor-pointer text-md text-customLightBlue-200 duration-200 hover:text-customDarkBlue-200"
                                        >
                                            Our-log
                                        </button>
                                        {viewOurLog && (
                                            <div
                                                ref={logRef}
                                                className="font-default absolute z-50 w-72 rounded-lg bg-white p-4 pb-2 shadow-md"
                                                style={{
                                                    top: menuRef.current
                                                        ? menuRef.current
                                                              .offsetHeight + 15
                                                        : '50',
                                                    left: 0,
                                                }}
                                            >
                                                <div className="flex items-center justify-between border-b border-solid border-gray-200 pb-3">
                                                    <div className="font-bold">
                                                        Our-log 목록
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={
                                                                handlePrevPage
                                                            }
                                                            disabled={
                                                                currentPage ===
                                                                1
                                                            }
                                                        >
                                                            <IoChevronBackOutline
                                                                className={`${currentPage === 1 ? 'text-gray-400' : 'text-black'}`}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={
                                                                handleNextPage
                                                            }
                                                            disabled={
                                                                currentPage ===
                                                                totalPages
                                                            }
                                                        >
                                                            <IoChevronForwardOutline
                                                                className={`${currentPage === totalPages ? 'text-gray-400' : 'text-black'}`}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                                <ul>
                                                    {itemsToDisplay.map(
                                                        (item) => (
                                                            <li
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/${item.blogAddress}`,
                                                                    );
                                                                }}
                                                                key={
                                                                    item.blogId
                                                                }
                                                                className="w-full truncate border-b-2 py-2 text-sm text-gray-700 hover:cursor-pointer"
                                                            >
                                                                [{item.nickname}
                                                                ]
                                                                {' ' +
                                                                    item.blogName}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mr-5 flex items-center justify-between gap-4">
                                    <Search />
                                    <Link href="/setting">
                                        <FiSettings className="text-xl text-customLightBlue-200 duration-200 hover:text-customDarkBlue-200" />
                                    </Link>
                                </div>
                            </>
                        )}

                        {!loginUser && !isJoin && (
                            <div className="mr-5">
                                <Search />
                            </div>
                        )}
                        {!isJoin && !isSetting && (
                            <div>
                                <button
                                    onClick={
                                        loginUser
                                            ? handleLogout
                                            : () => openModal('login')
                                    }
                                    className="mr-2 rounded-lg bg-customDarkBlue-200 px-8 py-2 text-md tracking-wide text-white transition-colors duration-300 hover:bg-customDarkBlue-100"
                                >
                                    {loginUser ? '로그아웃' : '로그인'}
                                </button>
                            </div>
                        )}
                    </div>
                    <LoginModal
                        isOpen={modalType === 'login'}
                        closeModal={() => {
                            closeModal();
                            router.push('/');
                        }}
                        openFindModal={(type: string) =>
                            handleOpenFindModal(type)
                        }
                    />
                    <FindModal
                        isOpen={modalType == 'find'}
                        closeModal={closeModal}
                        findType={findType}
                    />
                    <AlertPopup
                        show={showPopup}
                        onConfirm={() => setShowPopup(false)}
                        title={popupTitle}
                        text={popupText}
                    />
                </div>
            </header>
        </Suspense>
    );
}