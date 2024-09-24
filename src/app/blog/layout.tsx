import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/Header';

export default function BlogLayout({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    return (
        <>
            {modal}
            <div className="flex">
                <div className="z-50">
                    <Header />
                </div>
                <Sidebar />
                <div className="ml-[20%] w-[80%] lg:ml-[16.6667%] lg:w-[83.3333%]">
                    {children}
                </div>
            </div>
        </>
    );
}
