import Sidebar from '@/components/sidebar/Sidebar';

export default function BlogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-[20%] w-[80%] lg:ml-[16.6667%] lg:w-[83.3333%]">
                {children}
            </div>
        </div>
    );
}
