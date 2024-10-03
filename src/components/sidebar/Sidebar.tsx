import UserProfile from '@/components/sidebar/UserProfile';
import Visitor from '@/components/sidebar/Visitor';
import PanelModule from '@/components/sidebar/PanelModule';

const series = [
    { title: '전체 보기', link: 'all' },
    { title: 'HTML', link: 'all' },
    { title: 'CSS', link: 'all' },
    { title: 'JavaScript', link: 'all' },
    { title: 'React', link: 'all' },
    { title: 'Next', link: 'all' },
    { title: 'TypeSdddddddddddddddddddcript', link: 'all' },
];

export default function Sidebar() {
    return (
        <>
            <aside className="fixed flex h-[100vh] w-1/5 flex-col overflow-y-auto border-r border-solid border-customLightBlue-100 lg:w-1/6">
                <div className="flex-1 p-5">
                    <UserProfile />
                    <PanelModule title="시리즈" contents={series} />
                </div>
                <div className="mb-14 p-5">
                    <Visitor />
                </div>
            </aside>
        </>
    );
}
