import { IoSearch } from "react-icons/io5";
import { useState } from "react";

export default function Search() {
    const [activeSearch, setActiveSearch] = useState(false);

    const ClickSearchBtn = () => {
        setActiveSearch(!activeSearch);
    };

    return (
        <div className="relative">
            {activeSearch && (
                <div className="relative w-64">
                    <input type="text"
                        className="w-full px-4 py-2 pr-10 text-md rounded-md outline-0 border-2 border-customLightBlue-100 text-gray-500 focus:border-customLightBlue-200"
                        placeholder="검색어를 입력해주세요."
                        autoFocus
                    />
                    <button
                        onClick={ClickSearchBtn}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2"
                    >
                        <IoSearch className="text-2xl text-customLightBlue-200" />
                    </button>
                </div>
            )}

            {!activeSearch && (
                <button onClick={ClickSearchBtn} className="text-customLightBlue-200 pt-1 hover:text-customDarkBlue-200 cursor-pointer">
                    <IoSearch className="text-2xl" />
                </button>
            )}
        </div>
    );
}