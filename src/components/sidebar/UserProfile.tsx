import MyLogUserProfile from '@/components/sidebar/MyLogUserProfile';

export default function UserProfile() {
    return (
        <section className="mb-4 flex flex-col border-b border-solid border-customLightBlue-100 pb-4 lg:mb-7 lg:pb-7">
            <MyLogUserProfile />
            {/*<OurLogsUserProfile />*/}
            <p className="font-default mt-2 px-2 text-sm leading-4">
                안녕하세용 제 블로그에 오신 여러분 매우 환영합니당~
            </p>
            <div className="text-center">
                <button className="font-default mt-4 rounded-md bg-customLightBlue-200 px-3 py-1.5 text-white hover:bg-customLightBlue-200/85">
                    글쓰기
                </button>
            </div>
        </section>
    );
}
