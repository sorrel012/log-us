import Search from '@/components/search/Search';
import { FaRegBell } from 'react-icons/fa';
import { useState } from 'react';
import { FaCircleUser } from 'react-icons/fa6';

export default function BlogHeader() {
    const [isLogined, setIsLogined] = useState(true);

    return (
        <header className="sticky z-10 p-2 shadow-md">
            <div className="flex items-center justify-between">
                {/* 블로그 헤더 공통 구역 */}
                <div className="flex items-center">
                    <img
                        src="/logo_icon.png"
                        className="ml-3"
                        width={40}
                        alt="Logo"
                    />
                    <p className="text-2xl"> 나무의 하루 </p>
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
                            <button className="mr-4 rounded-lg bg-customDarkBlue-200 px-6 py-1 text-xl tracking-wide text-white transition-colors duration-300 hover:bg-customDarkBlue-100">
                                로그인
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
