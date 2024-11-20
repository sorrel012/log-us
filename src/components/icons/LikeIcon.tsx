import { IoMdHeartEmpty } from 'react-icons/io';

export default function LikeIcon({ likes }: { likes: number }) {
    return (
        <div className="flex">
            <IoMdHeartEmpty />
            <span className="ml-0.5">{likes}</span>
        </div>
    );
}
