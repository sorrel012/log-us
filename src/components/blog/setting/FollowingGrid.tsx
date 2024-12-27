import FollowingCard, {
    FollowingsType,
} from '@/components/blog/setting/FollowingCard';

export default function FollowingGrid({
    followings,
}: {
    followings: FollowingsType[];
}) {
    return (
        <section className="flex flex-wrap gap-10">
            {followings.map((following: FollowingsType) => (
                <FollowingCard key={following.followId} {...following} />
            ))}
        </section>
    );
}