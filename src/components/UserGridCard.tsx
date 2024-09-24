import Image from 'next/image';
import PersonIcon from '@/components/icons/PersonIcon';
import Link from 'next/link';
import { GridType, UserGridProps } from '@/components/UserGrid';

export default function UserGridCard({
    image,
    nickName,
    blogs,
    type,
}: UserGridProps) {
    return (
        <article className={`${getCardStyle(type)} `}>
            <div className="mb-3 flex items-center justify-between border-b border-solid border-customLightBlue-100 pb-2 pt-3">
                <div className="flex items-center">
                    <>
                        {image && (
                            <Image src={image} alt={`${nickName}'s photo`} />
                        )}
                        {!image && <PersonIcon size="size-10" />}
                    </>
                    <p className="ml-2 max-w-[220px] truncate text-xl font-bold">
                        {nickName}
                    </p>
                </div>
                <button className={`${getButtonStyle(type)} `}>
                    {type === 'BLOG' ? '취소' : '구독'}
                </button>
            </div>
            <div>
                {blogs.map((blog, index) => (
                    <p key={index} className="ml-0.5 leading-8">
                        <div
                            className={`${blog.shareYn === 'N' ? 'font-bold' : ''}`}
                        >
                            <span className="mr-1">
                                {blog.shareYn === 'N' ? '[기본]' : '[참여]'}
                            </span>
                            <Link href={blog.blogAddress}>{blog.blogName}</Link>
                        </div>
                    </p>
                ))}
            </div>
        </article>
    );
}

function getCardStyle(type: GridType) {
    let className = 'font-default rounded-xl pb-3 px-4 ';

    switch (type) {
        case 'ADMIN':
            className += 'bg-white ';
            break;
        case 'BLOG':
            className += 'border-customLightBlue-100 border border-solid';
            break;
    }
    return className;
}

function getButtonStyle(type: GridType) {
    let className = 'rounded-md py-2 px-3 ';

    switch (type) {
        case 'ADMIN':
            className += 'text-white bg-customLightBlue-200';
            break;
        case 'BLOG':
            className += 'text-customBrown-100 bg-customBeige-100';
            break;
    }
    return className;
}
