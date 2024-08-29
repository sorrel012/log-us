import MyLogUserProfile from '@/components/sidebar/MyLogUserProfile';

export default function UserProfile() {
    return (
        <section className="border-customLightBlue-100 mb-4 flex flex-col border-b border-solid pb-4">
            <MyLogUserProfile />
            {/*<OurLogsUserProfile />*/}
            <p className="font-default mt-2 px-2 text-sm leading-4">
                안녕하세용 제 블로그에 오신 여러분 매우 환영합니당~
            </p>
            <div className="text-center">
                <button className="bg-customLightBlue-200 font-default hover:bg-customLightBlue-200/85 mt-4 rounded-md px-3 py-1.5 text-white">
                    글쓰기
                </button>
            </div>
        </section>
    );
}
