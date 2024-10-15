import { BsList } from 'react-icons/bs';
import UserProfile from '@/components/sidebar/UserProfile';
import Visitor from '@/components/sidebar/Visitor';
import PanelModule from '@/components/sidebar/PanelModule';
import { UseSeries } from '@/hooks/useSeries';
import Popup from '@/components/Popup';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const [shouldFetch, setShouldFetch] = useState(false); // 데이터를 fetching 할지 여부
    const { data, isLoading, showPopup, popupMessage, handleClosePopup } =
        UseSeries(shouldFetch);

    const series = data
        ? [
              {
                  imgUrl: '',
                  seriesOrder: 0,
                  seriesName: '전체보기',
                  seriesId: 0,
              },
              ...data,
          ]
        : [];

    const handleSidebarClick = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        if (isOpen) {
            setShouldFetch(true); // 사이드바가 열릴 때 데이터를 fetching하도록 설정
        } else {
            setShouldFetch(false); // 사이드바가 닫힐 때 데이터 fetching 중단
        }
    }, [isOpen]);

    return (
        <aside className="fixed flex h-[100vh] w-1/5 flex-col overflow-y-auto lg:w-1/6">
            <AnimatePresence>
                {isOpen ? (
                    <motion.section
                        key="sidebar"
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '-150%', opacity: 0 }}
                        ㄴ
                        transition={{ duration: 0.25 }}
                    >
                        <BsList
                            className="absolute right-3 top-3 size-5 cursor-pointer"
                            onClick={handleSidebarClick}
                        />
                        <motion.section
                            key="sidebar-content"
                            className="border-r border-solid border-customLightBlue-100"
                            exit={{ height: 0 }}
                        >
                            <div className="flex-1 p-5">
                                <UserProfile />
                                {series && (
                                    <PanelModule
                                        title="시리즈"
                                        contents={series}
                                    />
                                )}
                                {isLoading && (
                                    <div className="mt-3 px-2">
                                        <LoadingSpinner />
                                    </div>
                                )}
                            </div>
                            <div className="mb-14 p-5">
                                <Visitor />
                            </div>
                        </motion.section>
                        <Popup
                            show={showPopup}
                            title="에러"
                            text={popupMessage}
                            onClose={handleClosePopup}
                        />
                    </motion.section>
                ) : (
                    <BsList
                        className="absolute left-3 top-3 size-5 cursor-pointer"
                        onClick={handleSidebarClick}
                    />
                )}
            </AnimatePresence>
        </aside>
    );
}
