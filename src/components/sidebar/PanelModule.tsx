import Link from 'next/link';
import { Series } from '@/lib/series';
import { usePathname } from 'next/navigation';

interface ModuleProps {
    title: string;
    contents: Series[];
}

export default function PanelModule({ title, contents }: ModuleProps) {
    const blogAddress = usePathname().split('/')[1];

    return (
        <section className="font-default p-2">
            <div className="mb-3 font-bold">{title}</div>
            <ul className="text-sm leading-6 lg:leading-7">
                {contents &&
                    contents.map((item, index) => (
                        <li key={index} className="truncate">
                            <Link
                                className="hover:cursor-pointer hover:border-b hover:border-solid"
                                href={`/${blogAddress}/posts/series=${item.seriesId}`}
                            >
                                {item.seriesName}
                            </Link>
                        </li>
                    ))}
            </ul>
        </section>
    );
}
