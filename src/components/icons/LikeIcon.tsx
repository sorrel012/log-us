import { IoEyeOutline } from 'react-icons/io5';

export default function LikeIcon({ likes }: { likes: number }) {
    return (
        <div className="flex">
            <IoEyeOutline />
            <div className="ml-0.5">{likes}</div>
        </div>
    );
}
