import Sidebar from '@/components/sidebar/Sidebar';

export default function BlogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex">
            <Sidebar />
            {children}
        </div>
    );
}
