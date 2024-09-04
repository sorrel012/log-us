import { IoMdHeartEmpty } from 'react-icons/io';

export default function CommentIcon({ comments }: { comments: number }) {
    return (
        <div className="flex">
            <IoMdHeartEmpty />
            <div className="ml-0.5">{comments}</div>
        </div>
    );
}
