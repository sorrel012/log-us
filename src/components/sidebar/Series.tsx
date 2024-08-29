import Link from 'next/link';

const series = [
    { title: '전체 보기', link: 'all' },
    { title: 'HTML', link: 'all' },
    { title: 'CSS', link: 'all' },
    { title: 'JavaScript', link: 'all' },
    { title: 'React', link: 'all' },
    { title: 'Next', link: 'all' },
    { title: 'TypeSdddddddddddddddddddcript', link: 'all' },
];

export default function Series() {
    return (
        <section className="font-default p-2">
            <div className="mb-2 font-bold">시리즈</div>
            <ul className="text-sm leading-6">
                {series.map((item, index) => (
                    <li key={index} className="truncate">
                        <Link
                            className="hover:cursor-pointer hover:border-b hover:border-solid"
                            href={item.link}
                        >
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
