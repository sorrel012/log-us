import { useState } from 'react';
import Link from 'next/link';
import { customFetch } from '@/utils/customFetch';

export interface FollowingsType {
    followId: number;
    blogId: number;
    blogName: string;
    blogAddress: string;
    introduce: string;
}

export default function FollowingCard({
    followId,
    blogId,
    blogName,
    blogAddress,
    introduce,
}: FollowingsType) {
    const [isCancel, setIsCancel] = useState(true);

    const handleCancel = async () => {
        setIsCancel((prevState) => !prevState);

        let url;
        let method;

        if (isCancel) {
            url = '/follow?followId=' + followId;
            method = 'DELETE';
        } else {
            url = '/follow?blogId=' + blogId;
            method = 'POST';
        }

        const res = await customFetch<any>(url, {
            queryKey: ['follow', method],
            method,
        });
    };

    return (
        <article className="h-[100px] w-[320px] rounded-md border border-solid border-customGray-100 px-5 py-4">
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <Link
                        href={`/${blogAddress}`}
                        className="flex-1 truncate text-lg font-bold"
                    >
                        {blogName}
                    </Link>
                    <button
                        className="ml-1 shrink-0 rounded-md bg-customBeige-100 px-3 py-0.5 text-sm text-customBrown-100"
                        onClick={handleCancel}
                    >
                        {isCancel ? '취소' : '구독'}
                    </button>
                </div>
                <p className="truncate text-sm leading-5">{introduce}</p>
            </div>
        </article>
    );
}