import Image from 'next/image';
import PersonIcon from '@/components/icons/PersonIcon';
import Link from 'next/link';

interface Blog {
    blogName: string;
    blogAddress: string;
    shareYn: 'Y' | 'N';
}

export interface UserGridProps {
    image?: string;
    nickName: string;
    blogs: Blog[];
    type: 'BLOG' | 'ADMIN';
}

export default function UserGridCard({
    image,
    nickName,
    blogs,
    type,
}: UserGridProps) {
    return (
        <article
            className={`font-default rounded-xl p-3 ${type === 'BLOG' ? 'border-customLightBlue-100 border border-solid' : ''}`}
        >
            <div className="flex justify-between">
                <div className="flex items-center">
                    <>
                        {image && (
                            <Image src={image} alt={`${nickName}'s photo`} />
                        )}
                        {!image && <PersonIcon size="size-10" />}
                    </>
                    <p>{nickName}</p>
                </div>
                <button>취소</button>
            </div>
            <div>
                {blogs.map((blog, index) => (
                    <p key={index}>
                        <span>
                            {blog.shareYn === 'N' ? '[기본]' : '[참여]'}
                        </span>
                        <Link href={blog.blogAddress}>{blog.blogName}</Link>
                    </p>
                ))}
            </div>
        </article>
    );
}
