import { IoSearch } from 'react-icons/io5';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchStore } from '@/store/useSearchStore';

export default function BlogSearch() {
    const { setBlogKeyword, setIsBlogOpen } = useSearchStore();

    const [activeSearch, setActiveSearch] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');

    const toggleSearch = () => {
        if (activeSearch) {
            setSearchKeyword('');
            setBlogKeyword('');
        }
        setIsBlogOpen(!activeSearch);
        setActiveSearch((prev) => !prev);
    };

    return (
        <div className="relative flex items-center">
            <AnimatePresence>
                {activeSearch && (
                    <motion.div
                        initial={{ width: '2.5rem' }}
                        animate={{ width: '16rem' }}
                        exit={{ width: '2.5rem' }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center overflow-hidden rounded-md border-2 border-customLightBlue-100"
                    >
                        <input
                            type="text"
                            className="w-full rounded-md border-2 border-customLightBlue-100 px-3 py-1 text-md text-gray-500 outline-0 duration-200 focus:border-customLightBlue-200"
                            placeholder="검색어를 입력해주세요."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    setBlogKeyword(searchKeyword);
                                }
                            }}
                            autoFocus
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={toggleSearch}
                className="absolute right-1 cursor-pointer text-customLightBlue-200 duration-200 hover:text-customDarkBlue-200"
                style={{ transform: 'translateY(-50%)', top: '50%' }}
            >
                <IoSearch className="text-xl" />
            </button>
        </div>
    );
}
