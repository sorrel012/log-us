import { IoMdHeartEmpty } from 'react-icons/io';

export default function CommentIcon({ comments }: { comments: number }) {
    return (
        <div className="flex">
            <IoMdHeartEmpty />
            <span className="ml-0.5">{comments}</span>
        </div>
    );
}
