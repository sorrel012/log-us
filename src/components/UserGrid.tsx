import UserGridCard, { UserGridProps } from '@/components/UserGridCard';

const users: UserGridProps[] = [
    {
        image: '',
        nickName: 'hana',
        blogs: [
            {
                blogName: '나무의 하루',
                blogAddress: 'sorrel012/',
                shareYn: 'N',
            },
            {
                blogName: '오늘의 일상',
                blogAddress: 'sorrel0234234/',
                shareYn: 'Y',
            },
            {
                blogName: '우정 일기',
                blogAddress: 'daily/',
                shareYn: 'Y',
            },
        ],
        type: 'BLOG',
    },
    {
        image: '',
        nickName: 'kiki',
        blogs: [
            {
                blogName: '랄랄랄랄 노래',
                blogAddress: 'kiki124/',
                shareYn: 'N',
            },
            {
                blogName: '재미난 블로그',
                blogAddress: 'kikikikikiki/',
                shareYn: 'Y',
            },
        ],
        type: 'BLOG',
    },
    {
        image: '',
        nickName: 'hana',
        blogs: [
            {
                blogName: '나무의 하루',
                blogAddress: 'sorrel012/',
                shareYn: 'N',
            },
            {
                blogName: '오늘의 일상',
                blogAddress: 'sorrel0234234/',
                shareYn: 'Y',
            },
            {
                blogName: '우정 일기',
                blogAddress: 'daily/',
                shareYn: 'Y',
            },
        ],
        type: 'BLOG',
    },
    {
        image: '',
        nickName: 'kiki',
        blogs: [
            {
                blogName: '랄랄랄랄 노래',
                blogAddress: 'kiki124/',
                shareYn: 'N',
            },
            {
                blogName: '재미난 블로그',
                blogAddress: 'kikikikikiki/',
                shareYn: 'Y',
            },
        ],
        type: 'BLOG',
    },
    {
        image: '',
        nickName: 'hana',
        blogs: [
            {
                blogName: '나무의 하루',
                blogAddress: 'sorrel012/',
                shareYn: 'N',
            },
            {
                blogName: '오늘의 일상',
                blogAddress: 'sorrel0234234/',
                shareYn: 'Y',
            },
            {
                blogName: '우정 일기',
                blogAddress: 'daily/',
                shareYn: 'Y',
            },
        ],
        type: 'BLOG',
    },
    {
        image: '',
        nickName: 'kiki',
        blogs: [
            {
                blogName: '랄랄랄랄 노래',
                blogAddress: 'kiki124/',
                shareYn: 'N',
            },
            {
                blogName: '재미난 블로그',
                blogAddress: 'kikikikikiki/',
                shareYn: 'Y',
            },
        ],
        type: 'BLOG',
    },
    {
        image: '',
        nickName: 'hana',
        blogs: [
            {
                blogName: '나무의 하루',
                blogAddress: 'sorrel012/',
                shareYn: 'N',
            },
            {
                blogName: '오늘의 일상',
                blogAddress: 'sorrel0234234/',
                shareYn: 'Y',
            },
            {
                blogName: '우정 일기',
                blogAddress: 'daily/',
                shareYn: 'Y',
            },
        ],
        type: 'BLOG',
    },
    {
        image: '',
        nickName: 'kiki',
        blogs: [
            {
                blogName: '랄랄랄랄 노래',
                blogAddress: 'kiki124/',
                shareYn: 'N',
            },
            {
                blogName: '재미난 블로그',
                blogAddress: 'kikikikikiki/',
                shareYn: 'Y',
            },
        ],
        type: 'BLOG',
    },
    {
        image: '',
        nickName: 'hana',
        blogs: [
            {
                blogName: '나무의 하루',
                blogAddress: 'sorrel012/',
                shareYn: 'N',
            },
            {
                blogName: '오늘의 일상',
                blogAddress: 'sorrel0234234/',
                shareYn: 'Y',
            },
            {
                blogName: '우정 일기',
                blogAddress: 'daily/',
                shareYn: 'Y',
            },
        ],
        type: 'BLOG',
    },
    {
        image: '',
        nickName: 'kiki',
        blogs: [
            {
                blogName: '랄랄랄랄 노래',
                blogAddress: 'kiki124/',
                shareYn: 'N',
            },
            {
                blogName: '재미난 블로그',
                blogAddress: 'kikikikikiki/',
                shareYn: 'Y',
            },
        ],
        type: 'BLOG',
    },
    {
        image: '',
        nickName: 'hana',
        blogs: [
            {
                blogName: '나무의 하루',
                blogAddress: 'sorrel012/',
                shareYn: 'N',
            },
            {
                blogName: '오늘의 일상',
                blogAddress: 'sorrel0234234/',
                shareYn: 'Y',
            },
            {
                blogName: '우정 일기',
                blogAddress: 'daily/',
                shareYn: 'Y',
            },
        ],
        type: 'BLOG',
    },
    {
        image: '',
        nickName: 'kiki',
        blogs: [
            {
                blogName: '랄랄랄랄 노래',
                blogAddress: 'kiki124/',
                shareYn: 'N',
            },
            {
                blogName: '재미난 블로그',
                blogAddress: 'kikikikikiki/',
                shareYn: 'Y',
            },
        ],
        type: 'BLOG',
    },
];

export default function UserGrid() {
    return (
        <section className="grid grid-cols-4">
            {users.map((user, index) => (
                <UserGridCard key={index} {...user} />
            ))}
        </section>
    );
}
