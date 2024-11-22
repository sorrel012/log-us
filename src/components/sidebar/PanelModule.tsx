import Link from 'next/link';

interface ModuleProps {
    title: string;
    contents: any[];
}

export default function PanelModule({ title, contents }: ModuleProps) {
    return (
        <section className="font-default p-2">
            <div className="mb-3 font-bold">{title}</div>
            <ul className="text-sm leading-6 lg:leading-7">
                {contents &&
                    contents.map(({ value, link }, index) => (
                        <li key={index} className="truncate">
                            <Link
                                className="hover:cursor-pointer hover:border-b hover:border-solid"
                                href={link}
                            >
                                {value}
                            </Link>
                        </li>
                    ))}
            </ul>
        </section>
    );
}
