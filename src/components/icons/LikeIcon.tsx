import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';

export default function LikeIcon({
    likes,
    isClick,
    onClick,
    liked,
}: {
    likes: number;
    isClick?: boolean;
    onClick?: () => void;
    liked?: boolean;
}) {
    return (
        <div className="flex">
            {liked ? (
                <IoMdHeart
                    className={'cursor-pointer text-orange-600'}
                    onClick={onClick}
                />
            ) : (
                <IoMdHeartEmpty
                    className={`${isClick && 'cursor-pointer'}`}
                    onClick={onClick}
                />
            )}
            <span className="ml-0.5">{likes}</span>
        </div>
    );
}
