'use client';

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
    const handleItemsPerPageChange = (event) => {
        const selectedValue = event.target.value;
        onItemsPerPageChange(selectedValue);
    };

    return (
        <select
            onChange={handleItemsPerPageChange}
            className="font-default rounded border border-solid border-customLightBlue-100 px-2 py-1 outline-none"
        >
            {items.map((item) => (
                <option key={item.value} value={item.value}>
                    {item.text}
                </option>
            ))}
        </select>
    );
}
