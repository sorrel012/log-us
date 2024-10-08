import UserProfile from '@/components/sidebar/UserProfile';
import Visitor from '@/components/sidebar/Visitor';
import PanelModule from '@/components/sidebar/PanelModule';
import { UseSeries } from '@/hooks/useSeries';
import Popup from '@/components/Popup';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Sidebar() {
    const { data, isLoading, showPopup, popupMessage, handleClosePopup } =
        UseSeries();

    const series = data
        ? [
              {
                  imgUrl: '',
                  seriesOrder: 0,
                  seriesName: '전체보기',
                  seriesId: 0,
              },
              ...data,
          ]
        : [];

    return (
        <>
            <aside className="fixed flex h-[100vh] w-1/5 flex-col overflow-y-auto border-r border-solid border-customLightBlue-100 lg:w-1/6">
                <div className="flex-1 p-5">
                    <div>{`isLoading: ${isLoading}`}</div>
                    <UserProfile />
                    {series && <PanelModule title="시리즈" contents={series} />}
                    {isLoading && (
                        <div className="mt-3 px-2">
                            <LoadingSpinner />
                        </div>
                    )}
                </div>
                <div className="mb-14 p-5">
                    <Visitor />
                </div>
            </aside>
            <Popup
                show={showPopup}
                title="에러"
                text={popupMessage}
                onClose={handleClosePopup}
            />
        </>
    );
}
