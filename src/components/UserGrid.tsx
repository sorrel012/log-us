import UserGridCard from '@/components/UserGridCard';

export interface UserGridProps {
    followId?: number;
    memberId: number;
    nickname: string;
    imgUrl?: string;
    blogList: Blog[];
}

export interface Blog {
    blogId: number;
    blogName: string;
    blogAddress: string;
    introduce?: string;
    shareYn: 'Y' | 'N';
}

export type GridType = 'BLOG' | 'ADMIN';

export default function UserGrid({
    users,
    type,
    onButtonClick,
}: {
    users: UserGridProps[];
    type: GridType;
    onButtonClick: (followId: number) => void;
}) {
    return (
        <section className="flex flex-wrap gap-10">
            {users &&
                users.map((user, index) => (
                    <UserGridCard
                        key={index}
                        {...user}
                        type={type}
                        onButtonClick={onButtonClick}
                    />
                ))}
        </section>
    );
}
