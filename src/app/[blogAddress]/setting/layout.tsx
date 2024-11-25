import SettingSidebar from '@/components/blog/setting/SettingSidebar';

export default async function SettingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="font-default flex">
            <SettingSidebar />
            <div className="ml-[20%] h-screen w-[80%] overflow-y-auto p-10 lg:ml-[16.6667%] lg:w-[83.3333%]">
                {children}
            </div>
        </div>
    );
}
