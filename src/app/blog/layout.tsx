import Sidebar from '@/components/sidebar/Sidebar';

export default function BlogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-[20%] w-[80%]">{children}</div>
        </div>
    );
}
