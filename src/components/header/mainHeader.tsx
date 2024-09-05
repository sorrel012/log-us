import Link from 'next/link';
import Search from "@/components/search/Search";

import { useState } from 'react';
import { FaRegBell } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";

export default function MainHeader() {
    const [isLogined, setIsLogined] = useState(false)

    return (
        <header>
            <div className="max-w-screen-2xl mx-auto flex justify-between items-center p-5">
                {/* 메인 헤더 공통 구역 */}
                <div className="flex items-center">
                    <Link href='/main'>
                        <img src="/logo.png" width={300} alt="Logo" />
                    </Link>
                    <div className="ml-3 flex space-x-10">
                        <Link href='/notice' className='text-2xl'>공지사항</Link>
                        <Link href='/qna' className='text-2xl'>QnA</Link>
                    </div>
                </div>
                {/* 로그인여부에 따라 달라지는 구역 */}
                <div className='flex justify-between items-center'>
                    {isLogined && (
                        <>
                            <div className='flex justify-between items-center gap-5 mr-8'>
                                <p className='text-customLightBlue-200 text-xl hover:text-customDarkBlue-200 cursor-pointer'>My-log</p>
                                <div className='w-0.5 h-5 bg-customLightBlue-200 border-'></div>
                                <p className='text-customLightBlue-200 text-xl hover:text-customDarkBlue-200 cursor-pointer'>Our-log</p>
                            </div>
                            <div className='flex justify-between items-center gap-4 mr-5'>
                                <Search/>
                                <FaRegBell className='text-2xl text-customLightBlue-200 hover:text-customDarkBlue-200 cursor-pointer'/>
                                <FiSettings className='text-2xl text-customLightBlue-200 hover:text-customDarkBlue-200 cursor-pointer'/>
                            </div>
                        </>
                    )}
                    {!isLogined && (
                        <div className="mr-5">
                            <Search />
                        </div>
                    )}
                    <div>
                        <button className="text-xl text-white tracking-wide bg-customDarkBlue-200 px-10 py-1.5 rounded-lg mr-2 hover:bg-customDarkBlue-100 transition-colors duration-300">
                            로그인
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
