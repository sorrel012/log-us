import { GridType, UserGridProps } from '@/components/UserGrid';
import Link from 'next/link';
import PersonIcon from '@/components/icons/PersonIcon';
import Image from 'next/image';

export default function UserGridCard({
    followId,
    imgUrl,
    nickname,
    blogList,
    type,
    onButtonClick,
}: UserGridProps & {
    onButtonClick: (followId: number) => void;
}) {
    return (
        <article className={`${getCardStyle(type)} min-h-[150px] w-[320px]`}>
            <div
                className={
                    'mb-3 flex items-center justify-between border-b border-solid border-customLightBlue-100 pb-2 pt-3'
                }
            >
                <div className="flex items-center">
                    <>
                        {imgUrl && (
                            <div className="relative h-10 w-10">
                                <Image
                                    src={imgUrl}
                                    alt={`${nickname}'s photo`}
                                    fill
                                />
                            </div>
                        )}
                        {!imgUrl && <PersonIcon size="size-10" />}
                    </>
                    <p className="ml-2 max-w-[220px] truncate text-xl font-bold">
                        {nickname}
                    </p>
                </div>
                <button
                    className={`${getButtonStyle(type)} `}
                    onClick={() => onButtonClick(followId!)}
                >
                    {type === 'BLOG' ? '취소' : '구독'}
                </button>
            </div>
            <div>
                {blogList.map((blog, index) => (
                    <div key={index} className="ml-0.5 leading-8">
                        <p
                            className={`${blog.shareYn === 'N' ? 'font-bold' : ''}`}
                        >
                            <span className="mr-1">
                                {blog.shareYn === 'N' ? '[기본]' : '[참여]'}
                            </span>
                            <Link href={`/${blog.blogAddress}`}>
                                {blog.blogName}
                            </Link>
                        </p>
                    </div>
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
