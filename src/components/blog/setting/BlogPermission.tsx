import React from 'react';
import Image from 'next/image';
import { Member } from '@/components/sidebar/UserProfile';
import PersonIcon from '@/components/icons/PersonIcon';
import SelectBox from '@/components/SelectBox';
import {
    BLOG_OWNER_PERMISSION_OPTIONS,
    BLOG_PERMISSION_OPTIONS,
} from '@/utils/constant';

export default function BlogPermission({
    member,
    onChangePermission,
}: {
    member: Member;
    onChangePermission: (memberId: number, auth: string) => void;
}) {
    const { nickname, imgUrl, blogAuth, createDate } = member;

    const handlePerValueChange = (value: string) => {
        onChangePermission(member.memberId, value);
    };

    return (
        <div className="flex items-center justify-between px-4 py-1.5">
            <div className="flex">
                <div className="flex items-center gap-3">
                    {imgUrl ? (
                        <div className="relative size-10">
                            <Image
                                src={imgUrl}
                                alt={nickname!}
                                fill
                                className="rounded-full"
                            />
                        </div>
                    ) : (
                        <PersonIcon size="size-10 " />
                    )}
                    <div className="w-20 text-md font-bold">{nickname}</div>
                </div>
                <div>
                    <SelectBox
                        onItemsPerValueChange={handlePerValueChange}
                        items={
                            blogAuth === 'OWNER'
                                ? BLOG_OWNER_PERMISSION_OPTIONS
                                : BLOG_PERMISSION_OPTIONS
                        }
                        defaultValue={blogAuth}
                        disabled={blogAuth === 'OWNER'}
                    />
                </div>
            </div>
            <div className="text-customDarkBlue-100">{createDate}</div>
        </div>
    );
}
