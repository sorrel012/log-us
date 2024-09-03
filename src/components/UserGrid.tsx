import UserGridCard from '@/components/UserGridCard';

export interface UserGridProps {
    image?: string;
    nickName: string;
    blogs: Blog[];
}

interface Blog {
    blogName: string;
    blogAddress: string;
    shareYn: 'Y' | 'N';
}

export type GridType = 'BLOG' | 'ADMIN';

export default function UserGrid({
    users,
    type,
}: {
    users: UserGridProps[];
    type: GridType;
}) {
    return (
        <section className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user, index) => (
                <UserGridCard key={index} {...user} type={type} />
            ))}
        </section>
    );
}
