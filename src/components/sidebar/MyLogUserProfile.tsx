import PersonIcon from '@/components/icons/PersonIcon';
import { Member } from '@/components/sidebar/UserProfile';
import Image from 'next/image';

export default function MyLogUserProfile({ members }: { members: Member[] }) {
    const { nickname, imgUrl, memberId, blogAuth } = members[0];

    return (
        <div className="mx-auto pt-1 text-center">
            {imgUrl ? (
                <div className="relative size-10 md:size-20">
                    <Image
                        src={imgUrl}
                        alt={nickname}
                        fill
                        className="rounded-full"
                    />
                </div>
            ) : (
                <PersonIcon />
            )}
            <div className="mt-2 text-lg">{nickname}</div>
        </div>
    );
}
