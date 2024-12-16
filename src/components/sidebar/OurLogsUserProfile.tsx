import PersonIcon from '@/components/icons/PersonIcon';
import { Member } from '@/components/sidebar/UserProfile';
import Image from 'next/image';
import Link from 'next/link';

export default function OurLogsUserProfile({ members }: { members: Member[] }) {
    return (
        <ul className="mb-2 w-full">
            {members.map(({ nickname, imgUrl, myLogAddress, memberId }) => (
                <li key={memberId} className="mb-1 w-full">
                    <Link
                        href={`/${myLogAddress}`}
                        className="flex w-full items-center"
                    >
                        {imgUrl ? (
                            <div className="relative mr-2 mt-1 size-7">
                                <Image
                                    src={imgUrl}
                                    alt={nickname}
                                    fill
                                    className="rounded-full"
                                />
                            </div>
                        ) : (
                            <PersonIcon className="mr-2 mt-1" size="size-7 " />
                        )}
                        <span className="w-[80%] truncate pt-1 text-lg">
                            {nickname}
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
