import SettingSidebar from '@/components/setting/SettingSidebar';

export default async function SettingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex">
            <SettingSidebar />
            <div className="ml-[16.6667%] w-[83.3333%] lg:ml-[14.2857%] lg:w-[85.7143%]">
                {children}
            </div>
        </div>
    );
}
