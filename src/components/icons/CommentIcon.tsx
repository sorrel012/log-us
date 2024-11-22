import { BiComment } from 'react-icons/bi';

export default function CommentIcon({ comments }: { comments: number }) {
    return (
        <div className="flex">
            <BiComment />
            <span className="ml-0.5">{comments}</span>
        </div>
    );
}
