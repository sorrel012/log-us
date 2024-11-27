import { IoSearch } from 'react-icons/io5';
import { useState } from 'react';

export default function Search() {
    const [activeSearch, setActiveSearch] = useState(false);

    const ClickSearchBtn = () => {
        setActiveSearch(!activeSearch);
    };

    return (
        <div className="relative">
            {activeSearch && (
                <div className="relative w-64">
                    <input
                        type="text"
                        className="w-full rounded-md border-2 border-customLightBlue-100 px-4 py-2 pr-10 text-md text-gray-500 outline-0 focus:border-customLightBlue-200"
                        placeholder="검색어를 입력해 주세요."
                        autoFocus
                    />
                    <button
                        onClick={ClickSearchBtn}
                        className="absolute right-2 top-1/2 -translate-y-1/2 transform"
                    >
                        <IoSearch className="text-2xl text-customLightBlue-200" />
                    </button>
                </div>
            )}

            {!activeSearch && (
                <button
                    onClick={ClickSearchBtn}
                    className="cursor-pointer pt-1 text-customLightBlue-200 hover:text-customDarkBlue-200"
                >
                    <IoSearch className="text-2xl" />
                </button>
            )}
        </div>
    );
}
