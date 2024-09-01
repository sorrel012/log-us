import UserProfile from '@/components/sidebar/UserProfile';
import Series from '@/components/sidebar/Series';
import Visitor from '@/components/sidebar/Visitor';

export default function Sidebar() {
    return (
        <>
            <aside className="fixed flex h-[100vh] w-1/5 flex-col overflow-y-auto border-r border-solid border-customLightBlue-100 lg:w-1/6">
                <div className="flex-1 p-5">
                    <UserProfile />
                    <Series />
                </div>
                <div className="mb-3 p-5">
                    <Visitor />
                </div>
            </aside>
        </>
    );
}
