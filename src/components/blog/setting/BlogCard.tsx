import Link from 'next/link';
import { Blog } from '@/components/UserGrid';

export default function BlogCard({ blogName, blogAddress, introduce }: Partial<Blog>) {
    return (
        <article className="w-[320px] rounded-md border border-solid border-customGray-100 px-5 py-6">
            <div
                className={
                    'mb-3 flex items-center justify-between border-b border-solid border-customLightBlue-100 pb-2'
                }
            >
                <div className="mb-1 text-lg font-bold">{blogName}</div>
                <Link
                    href={`/setting/our-log/${blogAddress}/posts`}
                    className="ml-1 shrink-0 rounded-md bg-customBeige-100 px-3 py-1 text-md text-customBrown-100"
                >
                    관리
                </Link>
            </div>
            <p className="leading-5">{introduce}</p>
        </article>
    );
}