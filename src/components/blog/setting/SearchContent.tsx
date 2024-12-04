import React, { useRef, useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { SelectType } from '@/components/SelectBox';
import { IoSearch } from 'react-icons/io5';

const ITEMS = [
    { text: '제목+내용', value: 0 },
    { text: '제목', value: 1 },
    { text: '내용', value: 2 },
];

export default function SearchContent({
    onSearch,
}: {
    onSearch: (value: number, keyword: string) => void;
}) {
    const selectBoxRef = useRef<HTMLDivElement | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedText, setSelectedText] = useState(ITEMS[0].text);
    const [selectedValue, setSelectedValue] = useState(0);

    const [searchQuery, setSearchQuery] = useState('');

    const handleOptionClick = (item: SelectType) => {
        setSelectedText(item.text);
        setSelectedValue(item.value);
        setIsOpen(false);
    };

    const handleSearch = () => {
        onSearch(selectedValue, searchQuery);
    };

    return (
        <div className="mb-8 flex items-center rounded-lg border border-solid border-customLightBlue-100 px-2 shadow-sm">
            <div
                ref={selectBoxRef}
                className="select border-r border-solid border-customLightBlue-100"
            >
                <button
                    className="select-box-in w-[120px] text-sm text-customLightBlue-200"
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <span className="selected-text">{selectedText}</span>
                    <div>
                        {isOpen ? (
                            <MdKeyboardArrowUp />
                        ) : (
                            <MdKeyboardArrowDown />
                        )}
                    </div>
                </button>
                {isOpen && (
                    <ul className={'options-container-in w-[130px]'}>
                        {ITEMS.map((item) => (
                            <li
                                key={item.value}
                                className="option"
                                onClick={() => handleOptionClick(item)}
                            >
                                {item.text}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <input
                type="text"
                className="mx-2 flex-grow p-1 text-sm focus:outline-none"
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />

            <button
                onClick={handleSearch}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
                <IoSearch className="text-2xl text-customLightBlue-200" />
            </button>
        </div>
    );
}
