'use client';

import { useEffect, useRef, useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

export interface SelectType {
    value: number;
    text: string;
}

interface SelectProps {
    onItemsPerPageChange: (value: number) => void;
    items: SelectType[];
}

export default function SelectBox({
    onItemsPerPageChange,
    items,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedText, setSelectedText] = useState(items[0].text);
    const selectBoxRef = useRef<HTMLDivElement | null>(null);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleOptionClick = (item: SelectType) => {
        setSelectedText(item.text);
        onItemsPerPageChange(item.value);
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                selectBoxRef.current &&
                !selectBoxRef.current!.contains(event.target as Node)
            ) {
                setIsOpen(false); // 외부 클릭 시 드롭다운 닫기
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="select" ref={selectBoxRef}>
            <button className="select-box" onClick={handleToggle}>
                <span className="selected-text">{selectedText}</span>
                <div>
                    {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </div>
            </button>
            {isOpen && (
                <ul className="options-container">
                    {items.map((item) => (
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
    );
}
