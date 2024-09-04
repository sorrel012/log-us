import ContentsSettingList, {
    ContentsProps,
} from '@/components/ContentsSettingList';

const contents: ContentsProps[] = [
    {
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        contents: 'Next.js Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
        contents: '[Next.js] Sanity 사용하기',
        series: 'Next.js',
        category: 'IT·컴퓨터',
        date: new Date(),
        views: 50,
        comments: 2,
        likes: 12,
    },
    {
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
