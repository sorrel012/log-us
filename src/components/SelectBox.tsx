'use client';

import { useEffect, useRef, useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

export interface SelectType {
    value: number;
    text: string;
}

interface SelectProps {
    onItemsPerValueChange: (value: number) => void;
    items: SelectType[];
    defaultValue?: number;
    disabled?: boolean;
}

export default function SelectBox({
    onItemsPerValueChange,
    items,
    defaultValue,
    disabled,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedText, setSelectedText] = useState<string>(
        items.length > 0
            ? items.find((item) => item.value === defaultValue)?.text ||
                  items[0].text
            : '선택',
    );

    const selectBoxRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (items.length > 0) {
            const selectedItem = items.find(
                (item) => item.value === defaultValue,
            );
            if (selectedItem) {
                setSelectedText(selectedItem.text);
            }
        }
    }, [defaultValue, items]);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleOptionClick = (item: SelectType) => {
        setSelectedText(item.text);
        onItemsPerValueChange(item.value);
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                selectBoxRef.current &&
                !selectBoxRef.current!.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            className={`select w-full ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            ref={selectBoxRef}
        >
            <button
                className="select-box"
                onClick={handleToggle}
                disabled={disabled}
            >
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
