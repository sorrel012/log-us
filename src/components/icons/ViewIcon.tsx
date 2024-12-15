import { IoEyeOutline } from 'react-icons/io5';

export default function ViewIcon({ views }: { views: number }) {
    return (
        <div className="flex items-center">
            <IoEyeOutline />
            <span className="ml-0.5">{views}</span>
        </div>
    );
}
