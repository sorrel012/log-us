import { BsList } from 'react-icons/bs';
import UserProfile from '@/components/sidebar/UserProfile';
import Visitor from '@/components/sidebar/Visitor';
import PanelModule from '@/components/sidebar/PanelModule';
import { UseSeries } from '@/hooks/useSeries';
import Popup from '@/components/Popup';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { AnimatePresence, motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

interface SidebarProps {
    isOpen: boolean;
    handleSidebarClick: () => void;
}

const sidebarVariants = {
    initial: { x: '-150%' },
    animate: {
        x: 0,
        transition: {
            ease: 'easeOut',
            duration: 0.5,
        },
    },
    exit: {
        x: '-150%',
        transition: {
            ease: 'easeOut',
            duration: 0.6,
        },
    },
};

export default function Sidebar({ isOpen, handleSidebarClick }: SidebarProps) {
    const { data, isLoading, showPopup, popupMessage, handleClosePopup } =
        UseSeries();
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

    return (
        <aside
            className={`fixed h-[100vh] select-none ${isOpen ? 'flex w-1/5 flex-col lg:w-1/6' : 'fixed'}`}
        >
            <AnimatePresence>
                {isOpen ? (
                    <>
                        <motion.section
                            key="sidebar"
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={sidebarVariants}
                            className="h-full overflow-y-auto border-r border-solid border-customLightBlue-100"
                        >
                            <IoClose
                                key="closeIcon"
                                className="absolute right-3 top-3 size-5 cursor-pointer text-customDarkBlue-100"
                                onClick={handleSidebarClick}
                                initial="initial"
                                animate="animate"
                                variants={sidebarVariants}
                            />
                            <motion.section
                                key="sidebar-content"
                                className="flex h-full flex-col"
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0 },
                                }}
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
                                onConfirm={handleClosePopup}
                            />
                        </motion.section>
                    </>
                ) : (
                    <BsList
                        className="absolute left-3 top-3 size-5 cursor-pointer text-customDarkBlue-100"
                        onClick={handleSidebarClick}
                    />
                )}
            </AnimatePresence>
        </aside>
    );
}
