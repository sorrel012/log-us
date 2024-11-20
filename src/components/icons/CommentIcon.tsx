import { AiOutlineComment } from 'react-icons/ai';

export default function CommentIcon({ comments }: { comments: number }) {
    return (
        <div className="flex">
            <AiOutlineComment />
            <span className="ml-0.5">{comments}</span>
        </div>
    );
}
