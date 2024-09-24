import { AiOutlineUser } from 'react-icons/ai';

interface PersonIconProps {
    className?: string;
    size?: string;
}

export default function PersonIcon({
    className,
    size = 'size-10 md:size-20',
}: PersonIconProps) {
    return (
        <AiOutlineUser
            className={`rounded-full bg-fuchsia-100 p-1 ${className} ${size}`}
        />
    );
}
