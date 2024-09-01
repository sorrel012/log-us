import Link from 'next/link';

interface ModuleProps {
    title: string;
    contents?: object[];
}

export default function PanelModule({ title, contents }: ModuleProps) {
    return (
        <section className="font-default p-2">
            <div className="mb-3 font-bold">{title}</div>
            {contents && (
                <ul className="text-sm leading-6 lg:leading-7">
                    {contents.map((item, index) => (
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
            )}
        </section>
    );
}
