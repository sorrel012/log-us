import FollowingCard, {
    FollowingsType,
} from '@/components/blog/setting/FollowingCard';

export default function FollowingList({ followings }: FollowingsType[]) {
    return (
        <section className="mb-12 grid h-full grid-cols-1 gap-10 overflow-y-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8">
            {followings.map((following: FollowingsType) => (
                <FollowingCard key={following.followId} {...following} />
            ))}
        </section>
    );
}
