import UserProfile from '@/components/sidebar/UserProfile';
import Series from '@/components/sidebar/Series';
import Visitor from '@/components/sidebar/Visitor';

export default function Sidebar() {
    return (
        <>
            <aside className="border-customLightBlue-100 w-1/5 border-r border-solid">
                <div className="p-5">
                    <UserProfile />
                    <Series />
                    <Visitor />
                </div>
            </aside>
        </>
    );
}
