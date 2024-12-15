import { IoSearch } from 'react-icons/io5';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Search() {
    const [activeSearch, setActiveSearch] = useState(false);

    const toggleSearch = () => {
        setActiveSearch((prev) => !prev); // 상태를 반전하여 검색창 열고 닫기
    };

    return (
        <div className='relative flex items-center'>
            <motion.div
                initial={{ width: '2.5rem' }}
                animate={{ width: activeSearch ? '16rem' : '2.5rem' }}
                transition={{ duration: 0.5 }}
                className={`overflow-hidden flex items-center border-2 rounded-md ${
                    activeSearch ? 'border-customLightBlue-100' : ''
                }`}
            >
                {activeSearch && (
                    <input
                        type='text'
                        className='w-full px-3 py-1 text-md outline-0 text-gray-500 rounded-md border-2 border-customLightBlue-100 focus:border-customLightBlue-200 duration-200'
                        placeholder='검색어를 입력해주세요.'
                        autoFocus
                    />
                )}
            </motion.div>

            <button
                onClick={toggleSearch}
                className='absolute right-1 text-customLightBlue-200 hover:text-customDarkBlue-200 cursor-pointer duration-200'
                style={{ transform: 'translateY(-50%)', top: '50%' }}
            >
                <IoSearch className='text-xl' />
            </button>
        </div>
    );
}
