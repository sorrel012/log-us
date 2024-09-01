import Link from 'next/link';

export default function MainHeader() {
    return (
        <header>
            <div className="max-w-7xl mx-auto flex justify-between items-center p-5">
                {/* 메인 헤더 공통 구역 */}
                <div className="flex items-center">
                    <img src="/logo.png" width={300} alt="Logo" />
                    <div className="ml-3 flex space-x-10">
                        <Link href='/notice' className='text-2xl'>공지사항</Link>
                        <Link href='/qna' className='text-2xl'>QnA</Link>
                    </div>
                </div>
                {/* 로그인여부에 따라 달라지는 구역 */}
                <div>
                    <button className="text-xl text-white tracking-wide bg-customDarkBlue-200 px-10 py-1.5 rounded-lg mr-2 hover:bg-customDarkBlue-100 transition-colors duration-300">
                        로그인
                    </button>
                </div>
            </div>
        </header>
    );
}
