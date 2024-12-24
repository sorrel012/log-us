import Image from 'next/image';
import { useModal } from '@/hooks/useModal';
import LoginModal from '../@Modal/LoginModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { useState } from 'react';
import Link from 'next/link';
import { FiSettings } from 'react-icons/fi';
import { useBlogStore } from '@/store/useBlogStore';
import { usePathname } from 'next/dist/client/components/navigation';
import BlogSearch from '@/components/search/BlogSearch';

export default function BlogHeader() {
    const pathname = usePathname();
    const isSetting = pathname.includes('setting');

    const { modalType, openModal, closeModal } = useModal();
    const loginUser = useStore(useAuthStore, (state) => {
        return state.loginUser;
    });
    const { clearAuthInfo } = useAuthStore();
    const { blogInfo } = useBlogStore();

    const [findType, setFindType] = useState<string | null>(null);

    const handleLogout = () => {
        clearAuthInfo();
    };

    const handleOpenFindModal = (type: string) => {
        setFindType(type);
        openModal('find');
    };

    return (
        <header className="p-2 shadow-md">
            <div className="flex items-center justify-between">
                {/* 블로그 헤더 공통 구역 */}
                <Link
                    className="flex items-center"
                    href={`/${blogInfo?.blogAddress}`}
                >
                    <Image
                        src="/logo_icon.png"
                        className="ml-3"
                        width={30}
                        height={10}
                        alt="Logo"
                    />
                    <p className="ml-1 mt-1 text-2xl">{blogInfo?.blogName}</p>
                </Link>

                {/* 로그인여부에 따라 달라지는 구역 */}
                <div className="flex items-center gap-6">
                    {loginUser && !isSetting && (
                        <>
                            <BlogSearch />
                            <Link href="/setting">
                                <FiSettings className="mr-4 text-xl text-customLightBlue-200 duration-200 hover:text-customDarkBlue-200" />
                            </Link>
                        </>
                    )}

                    {!loginUser && (
                        <>
                            <BlogSearch />
                            <button
                                onClick={
                                    loginUser
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
                                openFindModal={handleOpenFindModal}
                            />
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
