import UserProfile from '@/components/sidebar/UserProfile';
import Visitor from '@/components/sidebar/Visitor';
import PanelModule from '@/components/sidebar/PanelModule';
import { useFetch } from '@/hooks/useFetch';
import { Series } from '@/lib/series';

export default function Sidebar() {
    let { data, isLoading, isError, error } = useFetch<Series[]>(
        '/series.json',
        { queryKey: ['series'] },
    );

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
                    <UserProfile />
                    {series && <PanelModule title="시리즈" contents={series} />}
                </div>
                <div className="mb-14 p-5">
                    <Visitor />
                </div>
            </aside>
        </>
    );
}
