import ContentsSettingList, {
    ContentsProps,
} from '@/components/ContentsSettingList';

const contents: ContentsProps[] = [
    {
        sn: 1,
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        sn: 2,
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        sn: 3,
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        sn: 4,
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        sn: 5,
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        sn: 6,
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        sn: 7,
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        sn: 8,
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        sn: 9,
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        sn: 10,
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
];

export default function SettingMain() {
    return (
        <div className="p-3">
            <ContentsSettingList contents={contents} />
        </div>
    );
}
